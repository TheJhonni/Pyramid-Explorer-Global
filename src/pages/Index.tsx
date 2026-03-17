import { useState, useMemo, useCallback } from 'react';
import Globe3D from '@/components/Globe3D';
import PyramidFilters from '@/components/PyramidFilters';
import PyramidList from '@/components/PyramidList';
import PyramidDetails from '@/components/PyramidDetails';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import pyramidsData from '@/data/pyramids.json';
import { pyramidImages } from '@/data/pyramidImages';
import { Pyramid, Filters, defaultFilters, continentCenters } from '@/types/pyramid';
import { filterPyramids } from '@/utils/filters';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

const allPyramids = (pyramidsData as Pyramid[]).map(p => ({
  ...p,
  ...(pyramidImages[p.id] || {}),
}));

const Index = () => {
  const { t } = useI18n();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedPyramid, setSelectedPyramid] = useState<Pyramid | null>(null);
  const [flyToKey, setFlyToKey] = useState(0);
  const [showList, setShowList] = useState(true);

  const filtered = useMemo(() => filterPyramids(allPyramids, filters), [filters]);
  const filteredIds = useMemo(() => filtered.map((p) => p.id), [filtered]);

  const focusPoint = useMemo(() => {
    if (filters.continente && continentCenters[filters.continente]) {
      return continentCenters[filters.continente];
    }
    return null;
  }, [filters.continente]);

  const handleSelect = useCallback((pyramid: Pyramid) => {
    setSelectedPyramid(pyramid);
    setFlyToKey(k => k + 1);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedPyramid(null);
  }, []);

  return (
    <main className="h-svh w-full bg-void overflow-hidden flex flex-row">
      {/* Left sidebar */}
      <div className="flex flex-col h-full">
        <PyramidFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
          resultCount={filtered.length}
          totalCount={allPyramids.length}
        />
        <div className="w-80 min-w-[320px] border-r border-border bg-card/40 backdrop-blur-sm">
          <button
            onClick={() => setShowList(!showList)}
            className="w-full flex items-center justify-between px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-mono border-b border-border hover:bg-secondary/30 transition-colors"
          >
            {t.resultsList} ({filtered.length})
            {showList ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showList && (
            <PyramidList
              pyramids={filtered}
              selectedId={selectedPyramid?.id ?? null}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      {/* Center: Globe */}
      <section className="flex-1 relative">
        {/* Language switcher top-right */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>

        <Globe3D
          pyramids={allPyramids}
          filteredIds={filteredIds}
          selectedId={selectedPyramid?.id ?? null}
          onSelect={handleSelect}
          focusPoint={focusPoint}
        />
        
        <button
          onClick={handleReset}
          className="absolute bottom-6 left-6 z-10 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-all font-mono"
        >
          ⟳ {t.resetView}
        </button>
      </section>

      <PyramidDetails
        pyramid={selectedPyramid}
        onClose={() => setSelectedPyramid(null)}
      />
    </main>
  );
};

export default Index;
