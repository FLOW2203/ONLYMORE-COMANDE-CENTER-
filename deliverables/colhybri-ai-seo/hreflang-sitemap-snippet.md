# hreflang and sitemap snippets for colhybri.com (Vite + React SPA)

## 1. hreflang block to inject in the HTML head

Paste this inside the document head via react-helmet-async, on every locale route. Update the locale list to match the 13 active locales of colhybri.com. The x-default points to en-US for international AI crawlers (GPT, Perplexity, Claude, Gemini).

```html
<link rel="alternate" hreflang="en-US" href="https://www.colhybri.com/en-US" />
<link rel="alternate" hreflang="fr-FR" href="https://www.colhybri.com/fr-FR" />
<link rel="alternate" hreflang="es-ES" href="https://www.colhybri.com/es-ES" />
<link rel="alternate" hreflang="it-IT" href="https://www.colhybri.com/it-IT" />
<link rel="alternate" hreflang="de-DE" href="https://www.colhybri.com/de-DE" />
<link rel="alternate" hreflang="pt-PT" href="https://www.colhybri.com/pt-PT" />
<link rel="alternate" hreflang="pt-BR" href="https://www.colhybri.com/pt-BR" />
<link rel="alternate" hreflang="nl-NL" href="https://www.colhybri.com/nl-NL" />
<link rel="alternate" hreflang="pl-PL" href="https://www.colhybri.com/pl-PL" />
<link rel="alternate" hreflang="ja-JP" href="https://www.colhybri.com/ja-JP" />
<link rel="alternate" hreflang="zh-CN" href="https://www.colhybri.com/zh-CN" />
<link rel="alternate" hreflang="ar-SA" href="https://www.colhybri.com/ar-SA" />
<link rel="alternate" hreflang="ko-KR" href="https://www.colhybri.com/ko-KR" />
<link rel="alternate" hreflang="x-default" href="https://www.colhybri.com/en-US" />
```

Note: replace the 11 placeholder locales (es-ES through ko-KR) with the actual 13 locales shipped in the colhybri.com bundle. Keep en-US and fr-FR as confirmed active. Validate each URL returns HTTP 200 before publishing the sitemap.

## 2. sitemap.xml structure to place in public/sitemap.xml

Vite serves the file at the site root automatically when placed in the public folder. The xhtml:link alternate pattern signals all locale variants of each canonical URL.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <url>
    <loc>https://www.colhybri.com/en-US</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://www.colhybri.com/en-US" />
    <xhtml:link rel="alternate" hreflang="fr-FR" href="https://www.colhybri.com/fr-FR" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.colhybri.com/en-US" />
    <lastmod>2026-05-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://www.colhybri.com/en-US/members</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://www.colhybri.com/en-US/members" />
    <xhtml:link rel="alternate" hreflang="fr-FR" href="https://www.colhybri.com/fr-FR/societaires" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.colhybri.com/en-US/members" />
    <lastmod>2026-05-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.colhybri.com/en-US/merchants</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://www.colhybri.com/en-US/merchants" />
    <xhtml:link rel="alternate" hreflang="fr-FR" href="https://www.colhybri.com/fr-FR/commercants" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.colhybri.com/en-US/merchants" />
    <lastmod>2026-05-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

</urlset>
```

Note: this is the structural pattern for 3 canonical en-US URLs. Replicate the same xhtml:link block (with all 13 locales) for every page indexed across the 638 URLs of colhybri.com. The sitemap.xml file lives at public/sitemap.xml in the Vite project and is served as is at https://www.colhybri.com/sitemap.xml. Declare it in robots.txt with the directive Sitemap: https://www.colhybri.com/sitemap.xml.
