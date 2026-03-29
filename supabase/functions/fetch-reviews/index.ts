import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface FetchReviewsRequest {
  merchant_id: string;
}

Deno.serve(async (req: Request) => {
  try {
    const { merchant_id } = (await req.json()) as FetchReviewsRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: merchant } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", merchant_id)
      .single();

    if (!merchant?.google_place_id) {
      return new Response(JSON.stringify({ error: "No Google Place ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: googleToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "google_business")
      .eq("merchant_id", merchant_id)
      .single();

    if (!googleToken?.access_token) {
      throw new Error("Google Business token not found");
    }

    const reviewsResponse = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${merchant.config.google_account_id}/locations/${merchant.google_place_id}/reviews`,
      {
        headers: { Authorization: `Bearer ${googleToken.access_token}` },
      }
    );

    if (!reviewsResponse.ok) {
      throw new Error(`Google API error: ${reviewsResponse.status}`);
    }

    const reviewsData = await reviewsResponse.json();
    const reviews = reviewsData.reviews || [];

    const { data: claudeToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "claude_api")
      .is("merchant_id", null)
      .single();

    let newReviewsCount = 0;
    let aiRepliesGenerated = 0;

    for (const review of reviews) {
      const { data: existing } = await supabase
        .from("google_reviews")
        .select("id, reply_text")
        .eq("review_id", review.reviewId)
        .single();

      const sentiment =
        review.starRating >= 4 ? "positive" : review.starRating >= 3 ? "neutral" : "negative";

      const reviewRecord = {
        merchant_id,
        review_id: review.reviewId,
        author_name: review.reviewer?.displayName || "Anonyme",
        rating: review.starRating,
        comment: review.comment || "",
        review_date: review.createTime,
        reply_text: review.reviewReply?.comment || null,
        reply_date: review.reviewReply?.updateTime || null,
        sentiment,
        needs_attention: review.starRating <= 2,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await supabase.from("google_reviews").update(reviewRecord).eq("id", existing.id);
      } else {
        await supabase.from("google_reviews").insert(reviewRecord);
        newReviewsCount++;
      }

      if (!review.reviewReply && merchant.plan === "reputation_locale" && claudeToken?.access_token) {
        const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": claudeToken.access_token,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 512,
            system: `Tu es le gérant de ${merchant.name} (${merchant.business_type}).
Tu réponds aux avis Google de manière professionnelle, empathique et personnalisée.
- Avis positif : remercie chaleureusement, mentionne un détail de l'avis
- Avis négatif : excuse sincère, propose une solution concrète, invite à revenir
- Toujours en français, 2-4 phrases max`,
            messages: [
              {
                role: "user",
                content: `Avis ${review.starRating}/5 de ${review.reviewer?.displayName || "un client"} : "${review.comment || "Pas de commentaire"}"`,
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          const suggestedReply = aiResult.content[0].text;

          await supabase
            .from("google_reviews")
            .update({ ai_suggested_reply: suggestedReply })
            .eq("review_id", review.reviewId);

          aiRepliesGenerated++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_reviews: reviews.length,
        new_reviews: newReviewsCount,
        ai_replies_generated: aiRepliesGenerated,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
