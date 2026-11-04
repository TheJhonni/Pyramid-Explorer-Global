export interface CommonsPhoto {
  title: string;
  url: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl?: string;
  page: string;
}

interface ImageInfo {
  thumburl?: string;
  thumbwidth?: number;
  thumbheight?: number;
  descriptionurl?: string;
  extmetadata?: Record<string, { value?: string }>;
}

interface CommonsResponse {
  query?: {
    normalized?: { from: string; to: string }[];
    pages?: Record<string, { title: string; imageinfo?: ImageInfo[] }>;
  };
}

const stripTags = (html = '') =>
  new DOMParser().parseFromString(html, 'text/html').body.textContent?.replace(/\s+/g, ' ').trim() ?? '';

/** Keeps the requested order and drops files that no longer exist or lack a licence. */
export function parseCommonsResponse(data: CommonsResponse, titles: string[]): CommonsPhoto[] {
  const normalized = new Map((data.query?.normalized ?? []).map((n) => [n.from, n.to]));
  const pages = Object.values(data.query?.pages ?? {});
  const photos: CommonsPhoto[] = [];
  for (const title of titles) {
    const requested = `File:${title}`;
    const wanted = normalized.get(requested) ?? requested;
    const info = pages.find((p) => p.title === wanted)?.imageinfo?.[0];
    const license = info?.extmetadata?.LicenseShortName?.value;
    if (!info?.thumburl || !license) continue;
    photos.push({
      title,
      url: info.thumburl,
      width: info.thumbwidth ?? 4,
      height: info.thumbheight ?? 3,
      author: stripTags(info.extmetadata?.Artist?.value) || 'Wikimedia Commons',
      license,
      licenseUrl: info.extmetadata?.LicenseUrl?.value,
      page: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title)}`,
    });
  }
  return photos;
}

const cache = new Map<string, Promise<CommonsPhoto[]>>();

/** Author and licence come live from Commons, so credits stay correct if a file page changes. */
export function fetchCommonsPhotos(titles: string[]): Promise<CommonsPhoto[]> {
  const key = titles.join('|');
  const known = cache.get(key);
  if (known) return known;
  const width = window.innerWidth < 768 ? 960 : 1280;
  const params = new URLSearchParams({
    action: 'query',
    origin: '*',
    format: 'json',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: String(width),
    titles: titles.map((t) => `File:${t}`).join('|'),
  });
  const request = fetch(`https://commons.wikimedia.org/w/api.php?${params}`)
    .then((r) => {
      if (!r.ok) throw new Error(`Commons ${r.status}`);
      return r.json();
    })
    .then((data: CommonsResponse) => parseCommonsResponse(data, titles))
    .catch((error) => {
      cache.delete(key);
      throw error;
    });
  cache.set(key, request);
  return request;
}
