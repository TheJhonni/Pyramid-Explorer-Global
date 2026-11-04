import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Images, Rotate3D, Search } from 'lucide-react';
import panoramaIndex from '@/data/sitePanoramas.json';
import photoIndex from '@/data/sitePhotos.json';
import { useI18n } from '@/i18n/I18nContext';
import { Pyramid } from '@/types/pyramid';
import { CommonsPhoto, fetchCommonsPhotos } from '@/utils/commonsPhotos';
import { SitePanorama } from '@/utils/panorama';

const PhotoGallery = lazy(() => import('./PhotoGallery'));
const PanoramaViewer = lazy(() => import('./PanoramaViewer'));
const panoramas = panoramaIndex as Record<string, SitePanorama>;
const index = photoIndex as Record<string, string[]>;

const SitePhotos = ({ pyramid }: { pyramid: Pyramid }) => {
  const { t } = useI18n();
  const titles = index[pyramid.id];
  const [photos, setPhotos] = useState<CommonsPhoto[]>([]);
  const [open, setOpen] = useState(false);
  const [panoramaOpen, setPanoramaOpen] = useState(false);
  const panorama = panoramas[pyramid.id];
  const panoramaButton = useRef<HTMLButtonElement>(null);
  const galleryButton = useRef<HTMLButtonElement>(null);
  // The viewers unmount as soon as they close, so focus goes back to the button that opened them.
  const refocus = (button: React.RefObject<HTMLButtonElement>) => requestAnimationFrame(() => button.current?.focus());
  const setPanorama = (next: boolean) => {
    setPanoramaOpen(next);
    if (!next) refocus(panoramaButton);
  };
  const setGallery = (next: boolean) => {
    setOpen(next);
    if (!next) refocus(galleryButton);
  };

  useEffect(() => {
    setPhotos([]);
    setOpen(false);
    setPanoramaOpen(false);
    if (!titles) return;
    let active = true;
    fetchCommonsPhotos(titles)
      .then((result) => {
        if (active) setPhotos(result);
      })
      .catch(() => {
        // Commons is unreachable: the panel simply shows no photos.
      });
    return () => {
      active = false;
    };
  }, [titles, pyramid.id]);

  const cover = photos[0];
  const search = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(pyramid.nome_locale || pyramid.nome)}`;

  return (
    <section className="space-y-2">
      <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
        <Images size={10} /> {t.photos}
      </h3>
      {panorama && (
        <>
          <button ref={panoramaButton} type="button" onClick={() => setPanoramaOpen(true)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary hover:bg-primary/20">
            <Rotate3D size={16} aria-hidden="true" /> {t.panoramaOpen}
          </button>
          {panoramaOpen && (
            <Suspense fallback={null}>
              <PanoramaViewer open={panoramaOpen} onOpenChange={setPanorama} title={pyramid.nome} subtitle={`${pyramid.paese} · ${pyramid.regione}`} panorama={panorama} />
            </Suspense>
          )}
        </>
      )}
      {cover ? (
        <>
          <button ref={galleryButton} type="button" onClick={() => setOpen(true)} className="group relative block w-full overflow-hidden rounded-lg border border-border">
            <img src={cover.url} alt={pyramid.nome} loading="lazy" referrerPolicy="no-referrer" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            <span className="absolute bottom-2 right-2 flex min-h-9 items-center gap-1.5 rounded-full bg-black/75 px-3 text-xs font-medium text-white">
              <Images size={14} /> {t.openGallery} ({photos.length})
            </span>
          </button>
          <p className="truncate text-[10px] font-mono text-muted-foreground">
            {cover.author} · {cover.license} ·{' '}
            <a href={cover.page} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Commons</a>
          </p>
          {open && (
            <Suspense fallback={null}>
              <PhotoGallery open={open} onOpenChange={setGallery} title={pyramid.nome} subtitle={`${pyramid.paese} · ${pyramid.regione}`} photos={photos} />
            </Suspense>
          )}
        </>
      ) : !titles ? (
        <a href={search} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/40 border border-border text-[11px] text-foreground/70 hover:text-primary hover:border-primary/30 transition-all font-mono">
          <Search size={11} /> {t.searchCommons}
        </a>
      ) : null}
    </section>
  );
};

export default SitePhotos;
