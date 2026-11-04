import { Pyramid } from '@/types/pyramid';
import { MapPin, Star } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface PyramidListProps {
  pyramids: Pyramid[];
  selectedId: string | null;
  onSelect: (pyramid: Pyramid) => void;
}

const PyramidList = ({ pyramids, selectedId, onSelect }: PyramidListProps) => {
  const { t, tc, lang } = useI18n();

  if (pyramids.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-xs font-mono">
        {t.noResults}
      </div>
    );
  }

  return (
    <div className="max-h-[32svh] overflow-y-auto">
      {pyramids.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p)}
          className={`w-full text-left px-4 py-3 border-b border-border/50 transition-all duration-200 hover:bg-secondary/40 ${
            selectedId === p.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate flex items-center gap-1.5">
                {p.osmanagich_focus && <Star size={10} className="text-pyramid-gold shrink-0" />}
                {p.nome}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
                <MapPin size={8} />
                {p.paese} · {tc(p.continente)}
              </div>
            </div>
            {p.altezza_struttura_m > 0 && (
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                {p.altezza_struttura_m.toLocaleString(lang)} m
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default PyramidList;
