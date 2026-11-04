import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X, ZoomIn, ZoomOut } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useI18n } from '@/i18n/I18nContext';
import { CommonsPhoto } from '@/utils/commonsPhotos';

// Adapted from the GetLayers "Carousel Spotlight" section. It stops at the first and last photo,
// because repeating a site's few photos to fill the ring would look like padding.
const STEP = 24;
const DRAG = 0.16;
const DAMP = 0.94;

interface PhotoGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  photos: CommonsPhoto[];
}

const pad2 = (n: number) => String(n).padStart(2, '0');

const PhotoGallery = ({ open, onOpenChange, title, subtitle, photos }: PhotoGalleryProps) => {
  const { t } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState(0);
  const [full, setFull] = useState<CommonsPhoto | null>(null);
  const motion = useRef({ rot: 0, vel: 0, target: 0, dragging: false, lastX: 0, downX: 0, moved: false, settled: true });
  const frame = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const zoomTrigger = useRef<HTMLButtonElement | null>(null);
  const openFull = (photo: CommonsPhoto, trigger: HTMLButtonElement | null) => {
    zoomTrigger.current = trigger;
    setFull(photo);
  };
  // The full view replaces the gallery for assistive technology too, and gives focus back on close.
  const closeFull = () => {
    setFull(null);
    requestAnimationFrame(() => zoomTrigger.current?.focus());
  };
  useEffect(() => {
    if (mainRef.current) mainRef.current.inert = !!full;
  }, [full]);
  const count = photos.length;
  const clampIndex = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);

  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = Math.min(vw * 0.72, (vh * 0.5) / 0.68, 620);
    const r = cw * 3;
    stage.style.setProperty('--cw', `${cw}px`);
    stage.style.setProperty('--ch', `${cw * 0.68}px`);
    stage.style.setProperty('--r', `${r}px`);
    stage.style.setProperty('--push', `${r * 0.86}px`);
    stage.style.perspective = `${Math.max(800, vw * 0.9)}px`;
  }, []);

  const tick = useCallback(() => {
    const m = motion.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!m.dragging) {
      m.rot += m.vel;
      m.vel *= DAMP;
      if (Math.abs(m.vel) < 0.05) {
        if (!m.settled) {
          m.target = clampIndex(Math.round(m.rot / STEP));
          m.settled = true;
        }
        const diff = m.target * STEP - m.rot;
        m.rot = Math.abs(diff) < 0.01 ? m.target * STEP : m.rot + diff * (reduce ? 1 : 0.14);
      } else {
        m.settled = false;
      }
    }
    ringRef.current?.style.setProperty('--rot', `${m.rot}deg`);
    setFront(clampIndex(Math.round(m.rot / STEP)));
    frame.current = requestAnimationFrame(tick);
  }, [clampIndex]);

  const go = useCallback(
    (index: number) => {
      const m = motion.current;
      m.target = clampIndex(index);
      m.settled = true;
      m.vel = 0;
    },
    [clampIndex],
  );

  useEffect(() => {
    if (!open || !count) return;
    motion.current = { ...motion.current, rot: 0, vel: 0, target: 0, settled: true };
    setFront(0);
    setFull(null);
    // The dialog content mounts on the next frame.
    const start = requestAnimationFrame(() => {
      layout();
      frame.current = requestAnimationFrame(tick);
    });
    window.addEventListener('resize', layout);
    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', layout);
    };
  }, [open, count, layout, tick]);

  const current = photos[front];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onEscapeKeyDown={(e) => {
            if (full) {
              e.preventDefault();
              closeFull();
            }
          }}
          onKeyDown={(e) => {
            if (full) return;
            if (e.key === 'ArrowRight') go(front + 1);
            if (e.key === 'ArrowLeft') go(front - 1);
            if (e.key === 'Home') go(0);
            if (e.key === 'End') go(count - 1);
          }}
          className="fixed inset-0 z-50 overflow-hidden bg-[#070a14] text-foreground outline-none"
        >
          <div ref={mainRef}>
          <div
            ref={stageRef}
            className="gallery-stage absolute inset-0 grid cursor-grab touch-none select-none place-items-center active:cursor-grabbing"
            onPointerDown={(e) => {
              const m = motion.current;
              m.dragging = true;
              m.lastX = m.downX = e.clientX;
              m.moved = false;
              m.vel = 0;
              m.settled = false;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const m = motion.current;
              if (!m.dragging) return;
              const dx = e.clientX - m.lastX;
              m.lastX = e.clientX;
              if (Math.abs(e.clientX - m.downX) > 6) m.moved = true;
              // The photos follow the hand: dragging left brings in the next one, on the right.
              const d = -dx * DRAG;
              // Resist at both ends instead of spinning past the photos.
              m.rot = Math.max(-8, Math.min((count - 1) * STEP + 8, m.rot + d));
              m.vel = d;
            }}
            onPointerUp={(e) => {
              const m = motion.current;
              m.dragging = false;
              m.settled = false;
              // No coasting after a swipe when the user asks for less motion.
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) m.vel = 0;
              if (m.moved) return;
              const target = document.elementFromPoint(e.clientX, e.clientY);
              const zoom = target?.closest<HTMLElement>('[data-zoom]');
              if (zoom) {
                const photo = photos[Number(zoom.dataset.zoom)];
                if (photo) openFull(photo, zoom as HTMLButtonElement);
                return;
              }
              const card = target?.closest<HTMLElement>('[data-slot]');
              if (card) go(Number(card.dataset.slot));
            }}
            onPointerCancel={() => {
              motion.current.dragging = false;
            }}
          >
            <div ref={ringRef} className="gallery-ring">
              {photos.map((photo, i) => (
                <article key={photo.title} data-slot={i} aria-hidden={i !== front} className={`gallery-card ${i === front ? 'is-front' : ''}`} style={{ '--a': `${-i * STEP}deg` } as React.CSSProperties}>
                  <div className="gallery-card-inner">
                    <img src={photo.url} alt={`${title}, ${t.photoAlt.replace('{n}', String(i + 1)).replace('{total}', String(count))}`} draggable={false} loading={Math.abs(i - front) < 3 ? 'eager' : 'lazy'} referrerPolicy="no-referrer" />
                    <span className="gallery-card-no">{pad2(i + 1)}</span>
                    <button type="button" data-zoom={i} tabIndex={i === front ? 0 : -1} aria-label={t.viewFullPhoto} onClick={(e) => openFull(photo, e.currentTarget)} className="gallery-zoom">
                      <ZoomIn size={20} aria-hidden />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <header className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-4 pr-16 md:px-8 md:pt-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">{subtitle}</p>
            <DialogPrimitive.Title className="mt-1 text-lg font-semibold leading-tight md:text-2xl">{title}</DialogPrimitive.Title>
          </header>

          <DialogPrimitive.Close aria-label={t.close} className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-border bg-card/80 hover:bg-card md:right-6 md:top-5">
            <X size={20} />
          </DialogPrimitive.Close>

          <footer className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8 md:pb-6">
            <button type="button" onClick={() => go(front - 1)} disabled={front === 0} aria-label={t.previousPhoto} className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/80 hover:bg-card disabled:opacity-30">
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-0 text-center" aria-live="polite">
              <p className="font-mono text-xs text-muted-foreground">{pad2(front + 1)} / {pad2(count)}</p>
              {current && (
                <p className="mt-1 truncate text-xs text-foreground/80">
                  {current.author} ·{' '}
                  {current.licenseUrl ? (
                    <a href={current.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{current.license}</a>
                  ) : current.license}{' '}
                  · <a href={current.page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-primary">Commons <ExternalLink size={10} /></a>
                </p>
              )}
              <p className="sr-only mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:not-sr-only md:block">{t.galleryHint}</p>
            </div>
            <button type="button" onClick={() => go(front + 1)} disabled={front >= count - 1} aria-label={t.nextPhoto} className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/80 hover:bg-card disabled:opacity-30">
              <ChevronRight size={20} />
            </button>
          </footer>
          </div>

          {full && (
            <div role="group" aria-label={t.viewFullPhoto} className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/95 p-3">
              <div className="relative max-h-[88svh] max-w-full">
                <img src={full.url} alt={`${title}, ${t.photoAlt.replace('{n}', String(photos.indexOf(full) + 1)).replace('{total}', String(count))}`} referrerPolicy="no-referrer" className="max-h-[88svh] max-w-full object-contain" />
                <button type="button" autoFocus aria-label={t.closeFullPhoto} onClick={closeFull} className="gallery-zoom">
                  <ZoomOut size={20} aria-hidden />
                </button>
              </div>
              <span className="max-w-full truncate text-xs text-foreground/80">{full.author} · {full.license}</span>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default PhotoGallery;
