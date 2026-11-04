import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import FlatMap from '@/components/FlatMap';
import PyramidFilters from '@/components/PyramidFilters';
import PyramidList from '@/components/PyramidList';
import PyramidDetails from '@/components/PyramidDetails';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import pyramidsData from '@/data/pyramids.json';
import { pyramidImages } from '@/data/pyramidImages';
import { Pyramid, Filters, defaultFilters, continentCenters } from '@/types/pyramid';
import { filterPyramids } from '@/utils/filters';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useLocalizedPyramids } from '@/i18n/pyramidLocale';

// three.js + globe.gl are the bulk of the JS: load them only after first paint.
const Globe3D = lazy(() => import('@/components/Globe3D'));

const hasWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
};

const allPyramids = (pyramidsData as Pyramid[]).map(p => ({
  ...p,
  ...(pyramidImages[p.id] || {}),
}));

const Index = () => {
  const { t, lang } = useI18n();
  const pyramids = useLocalizedPyramids(allPyramids, lang);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Derived from the id so the details panel follows a language switch.
  const selectedPyramid = useMemo(() => pyramids.find((p) => p.id === selectedId) ?? null, [pyramids, selectedId]);
  const [flyToKey, setFlyToKey] = useState(0);
  const [showList, setShowList] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [webgl] = useState(hasWebGL);
  const [showIntro, setShowIntro] = useState(true);

  const filtered = useMemo(() => filterPyramids(pyramids, filters), [pyramids, filters]);
  const filteredIds = useMemo(() => filtered.map((p) => p.id), [filtered]);

  const focusPoint = useMemo(() => {
    if (filters.continente && continentCenters[filters.continente]) {
      return continentCenters[filters.continente];
    }
    return null;
  }, [filters.continente]);

  const handleSelect = useCallback((pyramid: Pyramid) => {
    setSelectedId(pyramid.id);
    setFlyToKey(k => k + 1);
    setPanelOpen(false);
    setShowIntro(false);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedId(null);
  }, []);

  return (
    <main className="h-svh w-full bg-void overflow-hidden flex flex-row">
      <h1 className="sr-only">Pyramid Explorer</h1>
      {/* Left sidebar: drawer on mobile, fixed column from md up */}
      {panelOpen && (
        <button
          type="button"
          aria-label={t.close}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setPanelOpen(false)}
        />
      )}
      <div
        id="explorer-panel"
        className={`fixed inset-y-0 left-0 z-40 flex flex-col h-full w-[min(320px,88vw)] transition-transform duration-200 md:static md:z-auto md:w-auto md:translate-x-0 ${
          panelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={() => setPanelOpen(false)}
          className="md:hidden absolute top-3 right-3 z-50 p-1 text-muted-foreground"
          aria-label={t.close}
        >
          <X size={18} />
        </button>
        <PyramidFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
          resultCount={filtered.length}
          totalCount={allPyramids.length}
        />
        <div className="w-full md:w-80 md:min-w-[320px] border-r border-border bg-card/90 md:bg-card/40 backdrop-blur-sm">
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
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      {/* Center: Globe */}
      <section className="flex-1 relative min-w-0">
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          aria-controls="explorer-panel"
          aria-expanded={panelOpen}
          className="md:hidden absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-card/85 backdrop-blur-sm border border-border rounded-md text-xs font-mono text-foreground"
        >
          <SlidersHorizontal size={14} /> {t.filtersButton} ({filtered.length})
        </button>

        {showIntro && (
          <div className="absolute left-1/2 top-16 md:top-4 z-10 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 rounded-md border border-border bg-card/85 px-4 py-3 pr-9 text-xs leading-relaxed text-foreground backdrop-blur-sm">
            {t.intro.replace('{n}', String(allPyramids.length))}
            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={t.close}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Language switcher top-right */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>

        {webgl ? (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-muted-foreground" role="status">
                {t.loadingGlobe}
              </div>
            }
          >
            <Globe3D
              pyramids={pyramids}
              filteredIds={filteredIds}
              selectedId={selectedId}
              flyToKey={flyToKey}
              onSelect={handleSelect}
              focusPoint={focusPoint}
            />
          </Suspense>
        ) : (
          <FlatMap
            pyramids={pyramids}
            filteredIds={filteredIds}
            selectedId={selectedId}
            onSelect={handleSelect}
            note={t.noWebgl}
          />
        )}
        
        <button
          onClick={handleReset}
          className="absolute bottom-6 left-6 z-10 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-all font-mono"
        >
          ⟳ {t.resetView}
        </button>
      </section>

      <PyramidDetails
        pyramid={selectedPyramid}
        onClose={() => setSelectedId(null)}
      />
    </main>
  );
};

export default Index;
