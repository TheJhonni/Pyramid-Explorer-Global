import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pyramid } from '@/types/pyramid';
import { useI18n } from '@/i18n/I18nContext';
import { X } from 'lucide-react';

const COLORS = ['#d4af37', '#34d399', '#60a5fa', '#f472b6', '#f97316', '#a78bfa'];
const MAX = 6;

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pyramids: Pyramid[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 260;
const GROUND = 225;
const GAP = 18;

const Silhouettes = ({ sites }: { sites: Pyramid[] }) => {
  const widthOf = (p: Pyramid) => p.base_m || p.altezza_struttura_m;
  const maxHeight = Math.max(...sites.map((p) => p.altezza_struttura_m));
  const totalBase = sites.reduce((sum, p) => sum + widthOf(p), 0);
  // One scale for both axes and every site: that is what makes the comparison honest.
  const scale = Math.min((GROUND - 25) / maxHeight, (VIEW_WIDTH - GAP * (sites.length + 1)) / totalBase);
  let x = GAP;

  return (
    <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="w-full h-auto" role="img" aria-label={sites.map((p) => `${p.nome}: ${p.altezza_struttura_m} m`).join(', ')}>
      <line x1="0" x2={VIEW_WIDTH} y1={GROUND} y2={GROUND} stroke="hsl(var(--border))" />
      {sites.map((p, i) => {
        const w = widthOf(p) * scale;
        const h = p.altezza_struttura_m * scale;
        const left = x;
        x += w + GAP;
        const color = COLORS[i % COLORS.length];
        return (
          <g key={p.id}>
            <polygon points={`${left},${GROUND} ${left + w / 2},${GROUND - h} ${left + w},${GROUND}`} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
            <text x={left + w / 2} y={GROUND - h - 6} textAnchor="middle" fontSize="12" fill="hsl(var(--foreground))" fontFamily="IBM Plex Mono, monospace">
              {p.altezza_struttura_m} m
            </text>
            <text x={left + w / 2} y={GROUND + 18} textAnchor="middle" fontSize="12" fill={color}>
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const CompareDialog = ({ open, onOpenChange, pyramids, selectedIds, onChange }: CompareDialogProps) => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');

  const candidates = useMemo(
    () => pyramids.filter((p) => p.altezza_struttura_m > 0 && !p.campi_senza_fonte?.includes('altezza_struttura_m')).sort((a, b) => a.nome.localeCompare(b.nome)),
    [pyramids],
  );
  const sites = selectedIds
    .map((id) => candidates.find((p) => p.id === id))
    .filter((p): p is Pyramid => !!p);
  const q = query.toLowerCase();
  const visible = candidates.filter((p) => `${p.nome} ${p.paese}`.toLowerCase().includes(q));

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter((x) => x !== id));
    else if (selectedIds.length < MAX) onChange([...selectedIds, id]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.compareTitle}</DialogTitle>
          <DialogDescription>{t.compareHint}</DialogDescription>
        </DialogHeader>

        {sites.length > 0 ? (
          <>
            <Silhouettes sites={sites} />
            <p className="text-[11px] text-muted-foreground">{t.compareNote}</p>
            <ol className="space-y-1">
              {sites.map((p, i) => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-xs border-b border-border/50 py-1">
                  <span className="min-w-0 truncate">
                    <span className="font-mono mr-2" style={{ color: COLORS[i % COLORS.length] }}>{i + 1}</span>
                    {p.nome}
                  </span>
                  <span className="flex items-center gap-3 shrink-0 font-mono text-muted-foreground">
                    {p.altezza_struttura_m} m{p.base_m > 0 ? ` × ${p.base_m} m` : ''}
                    <button type="button" onClick={() => toggle(p.id)} aria-label={`${t.close}: ${p.nome}`} className="p-1 hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="text-xs text-muted-foreground py-6 text-center">{t.compareEmpty}</p>
        )}

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.filterSites}
          aria-label={t.filterSites}
          className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <ul className="max-h-48 overflow-y-auto border border-border rounded-md divide-y divide-border/50">
          {visible.map((p) => {
            const checked = selectedIds.includes(p.id);
            return (
              <li key={p.id}>
                <label className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer hover:bg-secondary/40">
                  <input type="checkbox" checked={checked} disabled={!checked && selectedIds.length >= MAX} onChange={() => toggle(p.id)} className="accent-primary" />
                  <span className="flex-1 truncate">{p.nome}</span>
                  <span className="font-mono text-muted-foreground">{p.altezza_struttura_m} m</span>
                </label>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default CompareDialog;
