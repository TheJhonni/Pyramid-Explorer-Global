import { useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pyramid } from '@/types/pyramid';
import { useI18n } from '@/i18n/I18nContext';

const CONTINENT_COLORS: Record<string, string> = {
  Africa: '#d4af37',
  Asia: '#f97316',
  Europa: '#60a5fa',
  'Nord America': '#34d399',
  'Sud America': '#f472b6',
  Oceania: '#a78bfa',
};

interface TimelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pyramids: Pyramid[];
  onSelect: (pyramid: Pyramid) => void;
}

const TimelineDialog = ({ open, onOpenChange, pyramids, onSelect }: TimelineDialogProps) => {
  const { t, tc } = useI18n();

  const dated = useMemo(
    () =>
      pyramids
        .filter((p) => typeof p.anno_inizio === 'number')
        .sort((a, b) => (a.anno_inizio as number) - (b.anno_inizio as number)),
    [pyramids],
  );

  const { min, span, ticks } = useMemo(() => {
    const starts = dated.map((p) => p.anno_inizio as number);
    const ends = dated.map((p) => p.anno_fine ?? (p.anno_inizio as number));
    const lo = Math.floor(Math.min(...starts, 0) / 500) * 500;
    const hi = Math.ceil(Math.max(...ends, 500) / 500) * 500;
    const list: number[] = [];
    for (let y = lo; y <= hi; y += 500) list.push(y);
    return { min: lo, span: hi - lo || 1, ticks: list };
  }, [dated]);

  const pct = (year: number) => ((year - min) / span) * 100;
  const label = (year: number) => (year < 0 ? `${-year} ${t.bce}` : year === 0 ? '0' : `${year} ${t.ce}`);
  const undated = pyramids.length - dated.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90svh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t.timelineTitle}</DialogTitle>
          {undated > 0 && <DialogDescription>{t.timelineNote.replace('{n}', String(undated))}</DialogDescription>}
        </DialogHeader>

        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {Object.entries(CONTINENT_COLORS).map(([name, color]) => (
            <li key={name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden />
              {tc(name)}
            </li>
          ))}
        </ul>

        <div className="relative h-5 ml-1 mr-1 text-[10px] font-mono text-muted-foreground shrink-0" aria-hidden>
          {ticks.map((y, i) =>
            i % 2 === 0 ? (
              <span key={y} className="absolute -translate-x-1/2 whitespace-nowrap first:translate-x-0" style={{ left: `${pct(y)}%` }}>
                {label(y)}
              </span>
            ) : null,
          )}
        </div>

        <ol className="flex-1 overflow-y-auto space-y-0.5 min-h-0 pr-1">
          {dated.map((p) => {
            const start = p.anno_inizio as number;
            const end = p.anno_fine ?? start;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelect(p)}
                  className="w-full text-left px-1 py-1 rounded hover:bg-secondary/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
                >
                  <span className="flex justify-between gap-2 text-[11px]">
                    <span className="truncate">{p.nome}</span>
                    <span className="shrink-0 font-mono text-muted-foreground">
                      {label(start)}
                      {end !== start ? ` – ${label(end)}` : ''}
                    </span>
                  </span>
                  <span className="relative block h-1.5 mt-1 bg-secondary/40 rounded-full" aria-hidden>
                    <span
                      className="absolute top-0 h-full rounded-full"
                      style={{
                        left: `${pct(start)}%`,
                        width: `max(6px, ${pct(end) - pct(start)}%)`,
                        background: CONTINENT_COLORS[p.continente] ?? '#888',
                      }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineDialog;
