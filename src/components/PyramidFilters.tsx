import { AREA_LIMIT, Filters, HEIGHT_LIMIT, Period, SortKey, continenti } from '@/types/pyramid';
import { Search, RotateCcw, Mountain, Ruler, Globe2, Filter, Star, AlertTriangle, Hourglass, BadgeCheck, ArrowDownUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useI18n } from '@/i18n/I18nContext';

interface PyramidFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

interface RangeFieldProps {
  icon: React.ReactNode;
  label: string;
  min: number;
  max: number;
  limit: number;
  step: number;
  onChange: (min: number, max: number) => void;
}

/** One control with two thumbs, so the minimum can never pass the maximum. */
const RangeField = ({ icon, label, min, max, limit, step, onChange }: RangeFieldProps) => {
  const { lang } = useI18n();
  return (
  <section>
    <p className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
      {icon} {label}
    </p>
    <Slider
      className="mt-3"
      min={0}
      max={limit}
      step={step}
      minStepsBetweenThumbs={1}
      value={[min, Math.min(max, limit)]}
      aria-label={label}
      onValueChange={([lo, hi]) => onChange(lo, hi)}
    />
    <p className="mt-2 flex justify-between text-[11px] font-mono text-muted-foreground">
      <span>{min.toLocaleString(lang)}</span>
      <span>{max >= limit ? `${limit.toLocaleString(lang)}+` : max.toLocaleString(lang)}</span>
    </p>
  </section>
  );
};

const PyramidFilters = ({ filters, onChange, onReset, resultCount, totalCount }: PyramidFiltersProps) => {
  const { t, tc } = useI18n();
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });
  const periods: { value: Period; label: string }[] = [
    { value: 'ancient', label: t.periodAncient },
    { value: 'bce', label: t.periodBce },
    { value: 'first', label: t.periodFirst },
    { value: 'late', label: t.periodLate },
  ];

  return (
    <aside className="w-full md:w-80 md:min-w-[320px] border-r border-border bg-card/95 md:bg-card/60 backdrop-blur-md flex flex-col z-20 overflow-hidden">
      <header className="p-6 border-b border-border">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-mono font-semibold">
          {t.projectTitle}
        </p>
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

        <RangeField
          icon={<Mountain size={10} />}
          label={t.structureHeight}
          min={filters.heightMin}
          max={filters.heightMax}
          limit={HEIGHT_LIMIT}
          step={5}
          onChange={(heightMin, heightMax) => update({ heightMin, heightMax })}
        />

        <RangeField
          icon={<Ruler size={10} />}
          label={t.area}
          min={filters.areaMin}
          max={filters.areaMax}
          limit={AREA_LIMIT}
          step={1000}
          onChange={(areaMin, areaMax) => update({ areaMin, areaMax })}
        />

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
            <Hourglass size={10} /> {t.period}
          </label>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {periods.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filters.period === value}
                onClick={() => update({ period: filters.period === value ? '' : value })}
                className={`px-2 py-1.5 border text-[11px] rounded-md transition-all duration-200 ${
                  filters.period === value
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label htmlFor="sort-sites" className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
            <ArrowDownUp size={10} /> {t.sort}
          </label>
          <select
            id="sort-sites"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortKey })}
            className="mt-2 w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="name">{t.sortName}</option>
            <option value="height">{t.sortHeight}</option>
            <option value="oldest">{t.sortOldest}</option>
          </select>
        </section>

        <section>
          <label className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
            <Filter size={10} /> {t.categories}
          </label>
          <div className="mt-2 space-y-2">
            <button
              onClick={() => update({ soloVerificate: !filters.soloVerificate })}
              aria-pressed={filters.soloVerificate}
              className={`w-full flex items-center gap-2 px-3 py-2 border text-xs rounded-md transition-all ${
                filters.soloVerificate
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/60'
              }`}
            >
              <BadgeCheck size={12} />
              {t.verifiedOnly}
            </button>
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
