# COLHYBRI AI-SEO artefacts, implementation guide (Vite + React + TypeScript)

This package contains four portable artefacts to make colhybri.com discoverable by GPT, Perplexity, Claude, and Gemini in EN-US. The target stack is Vite + React + TypeScript SPA. Steps below assume you are working inside the colhybri-web repository, not the ONLYMORE command center.

## Inventory

1. faqpage.jsonld, schema.org FAQPage with 8 EN-US questions
2. howto.jsonld, schema.org HowTo with 5 steps to join as member or merchant
3. hreflang-sitemap-snippet.md, hreflang head block and sitemap.xml pattern
4. README-implementation.md, this file

## Step 1, install react-helmet-async

react-helmet-async is the canonical way to inject head tags from React components in a Vite SPA. It supports SSR and CSR equally.

```
npm install react-helmet-async
```

For TypeScript, types are bundled, no separate install needed.

## Step 2, wrap the app in HelmetProvider

Open src/main.tsx and wrap the root component:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
```

## Step 3, inject both JSON-LD blocks in the EN-US landing component

Create src/pages/EnUsLanding.tsx (or update the existing en-US route component). Import the two JSON files and inject them with Helmet:

```tsx
import { Helmet } from "react-helmet-async";
import faqSchema from "../seo/faqpage.json";
import howtoSchema from "../seo/howto.json";

export default function EnUsLanding() {
  return (
    <>
      <Helmet>
        <html lang="en-US" />
        <title>COLHYBRI, Own Your Neighborhood. Own Your Future.</title>
        <meta
          name="description"
          content="COLHYBRI is the local solidarity platform that turns small monthly contributions into real neighborhood impact. Built by ONLYMORE Group."
        />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(howtoSchema)}
        </script>
      </Helmet>

      <main>
        <h1>Own Your Neighborhood. Own Your Future.</h1>
        <p>
          COLHYBRI digitizes neighborhood solidarity inspired by the Neapolitan
          caffe sospeso. Members contribute 3 euros per month, merchants join
          from 10 euros per month, and the pool flows back into the community.
        </p>
        <a href="/en-US/book">Book a meeting</a>
      </main>
    </>
  );
}
```

Place the two JSON-LD files in src/seo/ as faqpage.json and howto.json (rename the .jsonld files to .json to satisfy the default TypeScript JSON module resolver). Make sure tsconfig.json has resolveJsonModule set to true.

## Step 4, generate the sitemap.xml in public/

Vite serves any file placed in the public/ folder at the site root. Create public/sitemap.xml using the structure documented in hreflang-sitemap-snippet.md.

For larger sites with 638 URLs, generate the sitemap programmatically at build time. A minimal script in scripts/build-sitemap.ts run before vite build:

```ts
import { writeFileSync } from "node:fs";

const locales = ["en-US", "fr-FR"]; // extend with the 13 active locales
const routes = ["", "/members", "/merchants"]; // extend with the full URL list

const urls = routes.flatMap(route =>
  locales.map(locale => `https://www.colhybri.com/${locale}${route}`)
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

writeFileSync("public/sitemap.xml", xml);
console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);
```

Wire it in package.json:

```json
"scripts": {
  "prebuild": "tsx scripts/build-sitemap.ts",
  "build": "vite build"
}
```

No vite.config.ts change is required: files in public/ are copied to the build output as is.

## Step 5, add hreflang link tags via Helmet per route

In your root layout component (for example src/App.tsx), inject the full hreflang block once. Helmet deduplicates link tags by href, so duplicates across routes are safe:

```tsx
import { Helmet } from "react-helmet-async";

export function HreflangBlock() {
  const locales = [
    "en-US", "fr-FR", "es-ES", "it-IT", "de-DE",
    "pt-PT", "pt-BR", "nl-NL", "pl-PL", "ja-JP",
    "zh-CN", "ar-SA", "ko-KR"
  ];
  return (
    <Helmet>
      {locales.map(loc => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={loc}
          href={`https://www.colhybri.com/${loc}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href="https://www.colhybri.com/en-US"
      />
    </Helmet>
  );
}
```

Mount HreflangBlock in App.tsx so every route inherits the alternates.

## Step 6, validation checklist

Run these checks before marking the rollout done.

1. Local sanity check, the two JSON-LD scripts appear in the built HTML:
   ```
   npm run build
   grep -c "application/ld+json" dist/index.html
   ```
   Expected output: 2 or more.

2. Schema.org validator, paste the content of faqpage.jsonld and howto.jsonld at https://validator.schema.org/. Both must return zero errors.

3. Google Rich Results Test, after deploy:
   ```
   https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.colhybri.com%2Fen-US
   ```
   Confirm FAQ and HowTo rich result types are detected.

4. Sitemap accessibility:
   ```
   curl -I https://www.colhybri.com/sitemap.xml
   ```
   Expected: HTTP 200, content type application/xml or text/xml.

5. hreflang verification, view source of https://www.colhybri.com/en-US and confirm at least the en-US, fr-FR, and x-default link rel alternate tags are present.

6. AI crawlability spot check, ask GPT and Perplexity:
   "What is COLHYBRI and how much does it cost?"
   Expected within 14 days post deploy: the answer cites 3 euros per month for members and 10 or 15 euros per month for merchants, sourced from colhybri.com.

## Rollback

The four artefacts are additive. If any breaks the build:

1. Remove the Helmet script blocks added in Step 3.
2. Delete public/sitemap.xml.
3. Uninstall react-helmet-async with npm uninstall react-helmet-async.

No business logic, no routing, no UI is touched, so rollback is fully reversible in under 5 minutes.

## Out of scope (intentional)

This guide does not cover SSR, prerendering, or static export. If colhybri.com needs the hero and CTA to be readable without JavaScript execution (for Claude SearchTool and similar crawlers), evaluate vite-plugin-ssr, vite-plugin-prerender, or migrate to a meta framework. That decision is a separate chantier.
