import { Filters, continenti } from '@/types/pyramid';
import { Search, RotateCcw, Mountain, Ruler, Globe2, Filter, Star, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface PyramidFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

const PyramidFilters = ({ filters, onChange, onReset, resultCount, totalCount }: PyramidFiltersProps) => {
  const { t, tc, lang } = useI18n();
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  return (
    <aside className="w-full md:w-80 md:min-w-[320px] border-r border-border bg-card/95 md:bg-card/60 backdrop-blur-md flex flex-col z-20 overflow-hidden">
      <header className="p-6 border-b border-border">
        <h1 className="text-[10px] uppercase tracking-[0.2em] text-primary font-mono font-semibold">
          {t.projectTitle}
        </h1>
        <p className="text-xl font-semibold text-foreground mt-1">{t.globalNetwork}</p>
        <p className="text-xs text-muted-foreground font-mono mt-2">
          {resultCount} / {totalCount} {t.structuresVisible}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <section>
          <label className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
            <Search size={10} /> {t.search}
          </label>
          <div className="relative mt-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={filters.searchText}
              onChange={(e) => update({ searchText: e.target.value })}
              placeholder={t.searchPlaceholder}
              className="w-full bg-secondary/50 border border-border rounded-md pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
            />
          </div>
        </section>

        <section>
          <label className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
            <Mountain size={10} /> {t.structureHeight}
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={500} value={filters.heightMin}
                onChange={(e) => update({ heightMin: +e.target.value })} className="flex-1 accent-primary h-1" />
              <span className="text-xs font-mono text-muted-foreground w-12 text-right">{filters.heightMin}</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={500} value={filters.heightMax}
                onChange={(e) => update({ heightMax: +e.target.value })} className="flex-1 accent-primary h-1" />
              <span className="text-xs font-mono text-muted-foreground w-12 text-right">{filters.heightMax}</span>
            </div>
          </div>
        </section>

        <section>
          <label className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
            <Ruler size={10} /> {t.area}
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={250000} step={1000} value={filters.areaMin}
                onChange={(e) => update({ areaMin: +e.target.value })} className="flex-1 accent-primary h-1" />
              <span className="text-xs font-mono text-muted-foreground w-16 text-right">{filters.areaMin.toLocaleString(lang)}</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={250000} step={1000} value={filters.areaMax}
                onChange={(e) => update({ areaMax: +e.target.value })} className="flex-1 accent-primary h-1" />
              <span className="text-xs font-mono text-muted-foreground w-16 text-right">{filters.areaMax.toLocaleString(lang)}</span>
            </div>
          </div>
        </section>

        <section>
          <label className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
            <Globe2 size={10} /> {t.continent}
          </label>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {continenti.map((c) => (
              <button
                key={c}
                onClick={() => update({ continente: filters.continente === c ? '' : c })}
                className={`px-3 py-1.5 border text-[11px] rounded-md transition-all duration-200 ${
                  filters.continente === c
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                {tc(c)}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
            <Filter size={10} /> {t.categories}
          </label>
          <div className="mt-2 space-y-2">
            <button
              onClick={() => update({ soloControverse: !filters.soloControverse })}
              className={`w-full flex items-center gap-2 px-3 py-2 border text-xs rounded-md transition-all ${
                filters.soloControverse
                  ? 'bg-accent/20 border-accent/40 text-accent'
                  : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/60'
              }`}
            >
              <AlertTriangle size={12} />
              {t.controversialOnly}
            </button>
            <button
              onClick={() => update({ soloOsmanagich: !filters.soloOsmanagich })}
              className={`w-full flex items-center gap-2 px-3 py-2 border text-xs rounded-md transition-all ${
                filters.soloOsmanagich
                  ? 'bg-pyramid-gold/20 border-pyramid-gold/40 text-pyramid-gold'
                  : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/60'
              }`}
            >
              <Star size={12} />
              {t.alternativeResearch}
            </button>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border text-xs text-muted-foreground rounded-md hover:bg-destructive/20 hover:text-destructive hover:border-destructive/40 transition-all"
        >
          <RotateCcw size={12} />
          {t.resetFilters}
        </button>
      </div>
    </aside>
  );
};

export default PyramidFilters;
