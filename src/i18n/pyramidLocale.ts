import { useEffect, useMemo, useState } from 'react';
import type { Pyramid } from '@/types/pyramid';
import type { Lang } from './I18nContext';
import en from '@/data/locales/en.json';

/**
 * The dataset (src/data/pyramids.json) is written in Italian. Each other UI
 * language has an overlay in src/data/locales/<lang>.json that replaces the
 * human-readable fields, keyed by pyramid id. Numbers, coordinates, flags and
 * links stay in the base dataset only.
 *
 * English is the default UI language, so its overlay ships in the main bundle;
 * the others are fetched as separate chunks the first time they are picked.
 */
export const LOCALIZED_FIELDS = [
  'nome',
  'paese',
  'regione',
  'tipo',
  'datazione_ufficiale',
  'datazione_non_ufficiale',
  'funzione_ufficiale',
  'funzione_non_ufficiale',
  'popolazione_ufficiale_associata',
  'popolazione_non_ufficiale_associata',
  'leggende_locali',
  'note',
] as const;

type LocalizedField = (typeof LOCALIZED_FIELDS)[number];
export type PyramidOverlay = Partial<Pick<Pyramid, LocalizedField>>;
export type LocaleOverlay = Record<string, PyramidOverlay>;

const lazyOverlays = import.meta.glob<LocaleOverlay>(['@/data/locales/*.json', '!@/data/locales/en.json'], {
  import: 'default',
});

const cache: Partial<Record<Lang, LocaleOverlay>> = { en: en as LocaleOverlay, it: {} };

export async function loadLocaleOverlay(lang: Lang): Promise<LocaleOverlay> {
  const cached = cache[lang];
  if (cached) return cached;
  const loader = Object.entries(lazyOverlays).find(([path]) => path.endsWith(`/${lang}.json`))?.[1];
  const overlay = loader ? await loader() : {};
  cache[lang] = overlay;
  return overlay;
}

export function localizePyramids(base: Pyramid[], overlay: LocaleOverlay): Pyramid[] {
  return base.map((p) => (overlay[p.id] ? { ...p, ...overlay[p.id] } : p));
}

/** Returns the dataset in the current UI language (Italian base while an overlay is loading). */
export function useLocalizedPyramids(base: Pyramid[], lang: Lang): Pyramid[] {
  const [overlay, setOverlay] = useState<LocaleOverlay>(() => cache[lang] ?? {});

  useEffect(() => {
    let alive = true;
    const cached = cache[lang];
    if (cached) {
      setOverlay(cached);
      return;
    }
    loadLocaleOverlay(lang).then((o) => {
      if (alive) setOverlay(o);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  return useMemo(() => localizePyramids(base, overlay), [base, overlay]);
}
