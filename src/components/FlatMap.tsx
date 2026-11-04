import { Pyramid } from '@/types/pyramid';
import { useI18n } from '@/i18n/I18nContext';

interface FlatMapProps {
  pyramids: Pyramid[];
  filteredIds: string[];
  selectedId: string | null;
  onSelect: (pyramid: Pyramid) => void;
  note?: string;
}

/** 2D equirectangular fallback used when WebGL is not available. */
const FlatMap = ({ pyramids, filteredIds, selectedId, onSelect, note }: FlatMapProps) => {
  const { t } = useI18n();
  const filtered = new Set(filteredIds);
  const hasFilter = filteredIds.length < pyramids.length;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-auto p-4" data-testid="flat-map">
      <div className="relative w-full max-w-5xl">
        <img
          src="/textures/earth-map.webp"
          alt={t.worldMap}
          width={1600}
          height={800}
          className="w-full h-auto rounded-md border border-border"
        />
        {pyramids.map((p) => {
          const x = ((p.coordinate.lon + 180) / 360) * 100;
          const y = ((90 - p.coordinate.lat) / 180) * 100;
          const active = p.id === selectedId;
          const dim = hasFilter && !filtered.has(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              aria-label={`${p.nome}, ${p.paese}`}
              title={p.nome}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 h-3 w-3 rotate-45 border border-black/40 transition-transform hover:scale-150 focus-visible:scale-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                active ? 'bg-emerald-300 scale-150' : dim ? 'bg-amber-900/50' : 'bg-amber-400'
              }`}
            />
          );
        })}
        {note && <p className="mt-2 text-center text-xs text-muted-foreground font-mono">{note}</p>}
      </div>
    </div>
  );
};

export default FlatMap;
