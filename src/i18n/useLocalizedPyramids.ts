import { useEffect, useMemo, useState } from 'react';
import { allPyramids } from '@/data';
import { Pyramid } from '@/types/pyramid';
import { Lang } from './I18nContext';

type Overlay = Record<string, Partial<Pyramid>>;

const loaders = import.meta.glob<{ default: Overlay }>('../data/locales/*.json');

const applyOverlay = (overlay: Overlay | undefined): Pyramid[] =>
  overlay ? allPyramids.map((p) => ({ ...p, ...overlay[p.id] })) : allPyramids;

/** Site texts in the current language. Shows English until the overlay arrives. */
export function useLocalizedPyramids(lang: Lang): Pyramid[] {
  const [overlays, setOverlays] = useState<Partial<Record<Lang, Overlay>>>({});

  useEffect(() => {
    if (lang === 'en' || overlays[lang]) return;
    const load = loaders[`../data/locales/${lang}.json`];
    if (!load) return;
    let active = true;
    load()
      .then((mod) => {
        if (active) setOverlays((prev) => ({ ...prev, [lang]: mod.default }));
      })
      .catch(() => {
        // Offline or a failed chunk: keep showing English instead of breaking the page.
      });
    return () => {
      active = false;
    };
  }, [lang, overlays]);

  return useMemo(() => applyOverlay(lang === 'en' ? undefined : overlays[lang]), [lang, overlays]);
}
