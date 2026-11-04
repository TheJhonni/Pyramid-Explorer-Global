// Writes a real HTML page per site after `vite build`, plus sitemap.xml, so that search engines and link
// previews see each site's content. React replaces the static content on load.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ORIGIN = 'https://pyramid-explorer-global.vercel.app';
const pyramids = JSON.parse(readFileSync(join(root, 'src/data/pyramids.json'), 'utf8'));
// Inlining the small stylesheet removes the only render-blocking request.
const inlineCss = (html) =>
  html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) =>
    `<style>${readFileSync(join(dist, href), 'utf8').replace(/<\/style/g, '<\\/style')}</style>`,
  );
const template = inlineCss(readFileSync(join(dist, 'index.html'), 'utf8'));
writeFileSync(join(dist, 'index.html'), template);

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

const describe = (p) => {
  const size = p.altezza_struttura_m > 0 ? ` ${p.altezza_struttura_m} m high.` : '';
  return `${p.nome}, ${p.regione}, ${p.paese}. ${p.tipo}.${size} ${p.note}`.slice(0, 300);
};

const page = (p) => {
  const url = `${ORIGIN}/site/${p.id}`;
  const description = describe(p);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LandmarksOrHistoricalBuildings',
    name: p.nome,
    alternateName: p.nome_locale,
    description,
    url,
    geo: { '@type': 'GeoCoordinates', latitude: p.coordinate.lat, longitude: p.coordinate.lon },
    address: { '@type': 'PostalAddress', addressCountry: p.paese, addressRegion: p.regione },
  }).replace(/</g, '\\u003c');

  const sources = (p.fonti ?? [])
    .map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.title)}</a></li>`)
    .join('');
  const body = `<article style="max-width:42rem;margin:0 auto;padding:2rem 1rem;color:#e0e0e6;background:#0a0a14;font-family:Inter,sans-serif">
<p><a href="/" style="color:#2fbf7f">Pyramid Explorer</a></p>
<h1>${esc(p.nome)}</h1>
<p>${esc(p.regione)}, ${esc(p.paese)}</p>
<p>${esc(p.tipo)}${p.altezza_struttura_m > 0 ? `. Height: ${p.altezza_struttura_m} m` : ''}. Date: ${esc(p.datazione_ufficiale)}.</p>
<p>${esc(p.funzione_ufficiale)}. ${esc(p.note)}</p>
${sources ? `<h2>Sources</h2><ul>${sources}</ul>` : ''}
</article>`;

  return template
    .replace(/<title>.*?<\/title>/, `<title>${esc(p.nome)} · Pyramid Explorer</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(description)}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(p.nome)} · Pyramid Explorer"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(description)}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
    .replace('</head>', `<link rel="canonical" href="${url}" />\n<script type="application/ld+json">${jsonLd}</script>\n</head>`)
    .replace(/<!--shell-->.*<!--\/shell-->/s, body);
};

for (const p of pyramids) {
  const dir = join(dist, 'site', p.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p));
}

const urls = ['/', ...pyramids.map((p) => `/site/${p.id}`)];
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${ORIGIN}${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
console.log(`Prerendered ${pyramids.length} site pages and sitemap.xml`);
