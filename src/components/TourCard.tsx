import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Pause, Play, X } from 'lucide-react';
import { Pyramid } from '@/types/pyramid';
import { useI18n } from '@/i18n/I18nContext';

const STOP_MS = 9000;

interface TourCardProps {
  stops: Pyramid[];
  index: number;
  onIndexChange: (index: number) => void;
  onOpenDetails: (pyramid: Pyramid) => void;
  onEnd: () => void;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TourCard = ({ stops, index, onIndexChange, onOpenDetails, onEnd }: TourCardProps) => {
  const { t } = useI18n();
  // People who asked for less motion start paused and move on their own.
  const [playing, setPlaying] = useState(() => !reducedMotion());
  const stop = stops[index];

  useEffect(() => {
    if (!playing) return;
    if (index >= stops.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => onIndexChange(index + 1), STOP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, stops.length, onIndexChange]);

  if (!stop) return null;

  const iconButton = 'p-2 rounded-md border border-border bg-secondary/40 hover:bg-secondary text-foreground disabled:opacity-40';

  return (
    <div className="absolute inset-x-3 bottom-20 md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[440px] z-20 rounded-lg border border-border bg-card/95 backdrop-blur-sm p-4 shadow-xl" role="region" aria-label={t.tour} aria-live="polite">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-wider text-primary">
            {t.tour} · {index + 1}/{stops.length}
          </p>
          <h2 className="text-sm font-semibold mt-1">{stop.nome}</h2>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
            {stop.paese} · {stop.datazione_ufficiale}
          </p>
        </div>
        <button type="button" onClick={onEnd} aria-label={t.tourEnd} className="p-1 text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed mt-2">{stop.note}</p>
      <div className="flex items-center gap-2 mt-3">
        <button type="button" className={iconButton} onClick={() => onIndexChange(index - 1)} disabled={index === 0} aria-label={t.tourPrev}>
          <ChevronLeft size={14} />
        </button>
        <button type="button" className={iconButton} onClick={() => setPlaying((v) => !v)} aria-label={playing ? t.tourPause : t.tourPlay}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button type="button" className={iconButton} onClick={() => onIndexChange(index + 1)} disabled={index >= stops.length - 1} aria-label={t.tourNext}>
          <ChevronRight size={14} />
        </button>
        <button type="button" onClick={() => onOpenDetails(stop)} className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-secondary/40 hover:bg-secondary text-xs">
          <FileText size={12} /> {t.tourDetails}
        </button>
      </div>
    </div>
  );
};

export default TourCard;
