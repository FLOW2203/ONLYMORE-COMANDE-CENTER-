import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ============================================
// AGENT ROUTING TABLE
// Maps task_type → responsible agent
// ============================================
const AGENT_ROUTING: Record<string, string> = {
  // FORGE — Build & Deploy
  deploy: "FORGE",
  build: "FORGE",
  fix_bug: "FORGE",
  feature: "FORGE",
  hotfix: "FORGE",
  migration: "FORGE",
  // SENTINEL — Monitoring & Security
  monitor: "SENTINEL",
  security_audit: "SENTINEL",
  health_check: "SENTINEL",
  incident: "SENTINEL",
  alert: "SENTINEL",
  // CONTENT — Content Generation
  generate_post: "CONTENT",
  write_article: "CONTENT",
  create_template: "CONTENT",
  translate: "CONTENT",
  // SOCIAL — Social Media Publishing
  publish: "SOCIAL",
  schedule_post: "SOCIAL",
  engage: "SOCIAL",
  // REPUTATION — Review Management
  review_reply: "REPUTATION",
  fetch_reviews: "REPUTATION",
  reputation_report: "REPUTATION",
  // ANALYTICS — Data & Reporting
  report: "ANALYTICS",
  dashboard: "ANALYTICS",
  kpi: "ANALYTICS",
  metrics: "ANALYTICS",
  // SUPPORT — Customer Support
  support_ticket: "SUPPORT",
  faq: "SUPPORT",
  onboarding: "SUPPORT",
  // ARCHITECT — Planning & Strategy
  plan: "ARCHITECT",
  design: "ARCHITECT",
  architecture: "ARCHITECT",
  roadmap: "ARCHITECT",
  strategy: "ARCHITECT",
};

const VALID_AGENTS = ["FORGE", "SENTINEL", "CONTENT", "SOCIAL", "REPUTATION", "ANALYTICS", "SUPPORT", "ARCHITECT"];

interface OrchestratorRequest {
  action: string;
  // create_task
  title?: string;
  description?: string;
  task_type?: string;
  entity?: string;
  agent?: string;
  priority?: number;
  input_data?: Record<string, unknown>;
  due_at?: string;
  // submit_output
  task_id?: string;
  output_type?: string;
  output_data?: Record<string, unknown>;
  summary?: string;
  quality_score?: number;
  forward_to?: string;
  // send_message
  from_agent?: string;
  to_agent?: string;
  message_type?: string;
  subject?: string;
  body?: string;
  // get_tasks / get_messages
  status?: string;
  limit?: number;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as OrchestratorRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    switch (body.action) {
      // ==========================================
      // CREATE TASK — Auto-route to correct agent
      // ==========================================
      case "create_task": {
        if (!body.title || !body.task_type) {
          return new Response(JSON.stringify({ error: "title and task_type required" }), { status: 400, headers: corsHeaders });
        }

        const agent = body.agent && VALID_AGENTS.includes(body.agent)
          ? body.agent
          : AGENT_ROUTING[body.task_type] || "ARCHITECT";

        const { data: task, error } = await supabase
          .from("agent_tasks")
          .insert({
            title: body.title,
            description: body.description || null,
            task_type: body.task_type,
            entity: body.entity || null,
            agent,
            priority: body.priority || 5,
            input_data: body.input_data || {},
            due_at: body.due_at || null,
            assigned_at: new Date().toISOString(),
            created_by: body.from_agent || "system",
          })
          .select()
          .single();

        if (error) throw error;

        // Notify the assigned agent
        await supabase.from("agent_messages").insert({
          from_agent: "SYSTEM",
          to_agent: agent,
          message_type: "request",
          subject: `New task: ${body.title}`,
          body: `Task ${task.id} assigned to you. Type: ${body.task_type}. Priority: ${body.priority || 5}.`,
          ref_task_id: task.id,
          priority: body.priority || 5,
        });

        return new Response(JSON.stringify({
          success: true,
          task_id: task.id,
          routed_to: agent,
          task,
        }), { status: 201, headers: corsHeaders });
      }

      // ==========================================
      // SUBMIT OUTPUT — Agent delivers result
      // ==========================================
      case "submit_output": {
        if (!body.task_id || !body.output_type) {
          return new Response(JSON.stringify({ error: "task_id and output_type required" }), { status: 400, headers: corsHeaders });
        }

        // Get the task
        const { data: task, error: taskErr } = await supabase
          .from("agent_tasks")
          .select("*")
          .eq("id", body.task_id)
          .single();

        if (taskErr || !task) {
          return new Response(JSON.stringify({ error: "Task not found" }), { status: 404, headers: corsHeaders });
        }

        // Create output
        const { data: output, error: outErr } = await supabase
          .from("agent_outputs")
          .insert({
            task_id: body.task_id,
            agent: task.agent,
            output_type: body.output_type,
            output_data: body.output_data || {},
            summary: body.summary || null,
            quality_score: body.quality_score || null,
            forwarded_to: body.forward_to || null,
          })
          .select()
          .single();

        if (outErr) throw outErr;

        // Mark task as done
        await supabase
          .from("agent_tasks")
          .update({
            status: "done",
            completed_at: new Date().toISOString(),
            output_ref: output.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", body.task_id);

        // If forward_to is set, create handoff task + messages
        if (body.forward_to && VALID_AGENTS.includes(body.forward_to)) {
          // Create handoff task for receiving agent
          const { data: handoffTask } = await supabase
            .from("agent_tasks")
            .insert({
              title: `[Handoff] ${task.title}`,
              description: `Handoff from ${task.agent}: ${body.summary || task.title}`,
              task_type: "handoff",
              entity: task.entity,
              agent: body.forward_to,
              priority: task.priority,
              input_data: { source_task_id: task.id, source_output_id: output.id, ...body.output_data },
              parent_task_id: task.id,
              assigned_at: new Date().toISOString(),
              created_by: task.agent,
            })
            .select()
            .single();

          // Handoff message
          await supabase.from("agent_messages").insert({
            from_agent: task.agent,
            to_agent: body.forward_to,
            message_type: "handoff",
            subject: `Handoff: ${task.title}`,
            body: `${task.agent} completed task and forwarded to you. Summary: ${body.summary || "N/A"}`,
            ref_task_id: handoffTask?.id || task.id,
            ref_output_id: output.id,
            priority: task.priority,
          });

          // Status update broadcast
          await supabase.from("agent_messages").insert({
            from_agent: task.agent,
            to_agent: "SUPERVISOR",
            message_type: "status_update",
            subject: `Task completed: ${task.title}`,
            body: `${task.agent} completed "${task.title}" and handed off to ${body.forward_to}. Output: ${body.summary || "N/A"}`,
            ref_task_id: task.id,
            ref_output_id: output.id,
            priority: 3,
          });
        }

        return new Response(JSON.stringify({
          success: true,
          output_id: output.id,
          task_status: "done",
          forwarded_to: body.forward_to || null,
        }), { status: 200, headers: corsHeaders });
      }

      // ==========================================
      // SEND MESSAGE — Inter-agent communication
      // ==========================================
      case "send_message": {
        if (!body.from_agent || !body.to_agent || !body.subject) {
          return new Response(JSON.stringify({ error: "from_agent, to_agent, and subject required" }), { status: 400, headers: corsHeaders });
        }

        const { data: msg, error: msgErr } = await supabase
          .from("agent_messages")
          .insert({
            from_agent: body.from_agent,
            to_agent: body.to_agent,
            message_type: body.message_type || "request",
            subject: body.subject,
            body: body.body || null,
            ref_task_id: body.task_id || null,
            priority: body.priority || 5,
          })
          .select()
          .single();

        if (msgErr) throw msgErr;

        return new Response(JSON.stringify({ success: true, message_id: msg.id }), { status: 201, headers: corsHeaders });
      }

      // ==========================================
      // GET TASKS — List tasks for an agent
      // ==========================================
      case "get_tasks": {
        let query = supabase
          .from("agent_tasks")
          .select("*")
          .order("priority", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(body.limit || 20);

        if (body.agent) query = query.eq("agent", body.agent);
        if (body.status) query = query.eq("status", body.status);
        if (body.entity) query = query.eq("entity", body.entity);

        const { data: tasks, error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ success: true, tasks, count: tasks?.length || 0 }), { status: 200, headers: corsHeaders });
      }

      // ==========================================
      // GET MESSAGES — List messages for an agent
      // ==========================================
      case "get_messages": {
        if (!body.agent) {
          return new Response(JSON.stringify({ error: "agent required" }), { status: 400, headers: corsHeaders });
        }

        const { data: messages, error } = await supabase
          .from("agent_messages")
          .select("*")
          .or(`to_agent.eq.${body.agent},to_agent.eq.ALL`)
          .order("created_at", { ascending: false })
          .limit(body.limit || 20);

        if (error) throw error;

        // Mark as read
        if (messages?.length) {
          const unreadIds = messages.filter((m: Record<string, unknown>) => !m.is_read).map((m: Record<string, unknown>) => m.id);
          if (unreadIds.length > 0) {
            await supabase
              .from("agent_messages")
              .update({ is_read: true, read_at: new Date().toISOString() })
              .in("id", unreadIds);
          }
        }

        return new Response(JSON.stringify({ success: true, messages, count: messages?.length || 0 }), { status: 200, headers: corsHeaders });
      }

      // ==========================================
      // DASHBOARD — Supervisor overview
      // ==========================================
      case "dashboard": {
        const [workloadRes, outputsRes, messagesRes, taskStatsRes] = await Promise.all([
          supabase.from("v_agent_workload").select("*"),
          supabase.from("v_recent_outputs").select("*").limit(10),
          supabase.from("v_unread_messages").select("*"),
          supabase
            .from("agent_tasks")
            .select("status")
            .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        ]);

        const taskStats = {
          total_24h: taskStatsRes.data?.length || 0,
          pending: taskStatsRes.data?.filter((t: Record<string, unknown>) => t.status === "pending").length || 0,
          in_progress: taskStatsRes.data?.filter((t: Record<string, unknown>) => t.status === "in_progress").length || 0,
          done: taskStatsRes.data?.filter((t: Record<string, unknown>) => t.status === "done").length || 0,
          failed: taskStatsRes.data?.filter((t: Record<string, unknown>) => t.status === "failed").length || 0,
          blocked: taskStatsRes.data?.filter((t: Record<string, unknown>) => t.status === "blocked").length || 0,
        };

        return new Response(JSON.stringify({
          success: true,
          timestamp: new Date().toISOString(),
          agents: VALID_AGENTS,
          workload: workloadRes.data || [],
          recent_outputs: outputsRes.data || [],
          unread_messages: messagesRes.data || [],
          task_stats_24h: taskStats,
        }), { status: 200, headers: corsHeaders });
      }

      // ==========================================
      // UPDATE TASK — Change status, priority
      // ==========================================
      case "update_task": {
        if (!body.task_id) {
          return new Response(JSON.stringify({ error: "task_id required" }), { status: 400, headers: corsHeaders });
        }

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (body.status) {
          updates.status = body.status;
          if (body.status === "in_progress") updates.started_at = new Date().toISOString();
          if (body.status === "done") updates.completed_at = new Date().toISOString();
        }
        if (body.priority) updates.priority = body.priority;
        if (body.agent && VALID_AGENTS.includes(body.agent)) updates.agent = body.agent;

        const { data: updated, error } = await supabase
          .from("agent_tasks")
          .update(updates)
          .eq("id", body.task_id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, task: updated }), { status: 200, headers: corsHeaders });
      }

      default:
        return new Response(JSON.stringify({
          error: `Unknown action: ${body.action}`,
          available_actions: ["create_task", "submit_output", "send_message", "get_tasks", "get_messages", "dashboard", "update_task"],
        }), { status: 400, headers: corsHeaders });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
