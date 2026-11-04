import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FlatMap from '@/components/FlatMap';
import PyramidFilters from '@/components/PyramidFilters';
import PyramidList from '@/components/PyramidList';
import PyramidDetails from '@/components/PyramidDetails';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CompareDialog from '@/components/CompareDialog';
import TimelineDialog from '@/components/TimelineDialog';
import TourCard from '@/components/TourCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TOUR_IDS, allPyramids as basePyramids } from '@/data';
import { Pyramid, Filters, continentCenters } from '@/types/pyramid';
import { filterPyramids, sortPyramids } from '@/utils/filters';
import { filtersFromParams, filtersToParams, parseCompare } from '@/utils/urlState';
import { ChevronDown, ChevronUp, CircleHelp, History, Route, Scale, SlidersHorizontal, X } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useLocalizedPyramids } from '@/i18n/useLocalizedPyramids';

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

const knownIds = new Set(basePyramids.map((p) => p.id));
const toolbarButton =
  'flex items-center gap-1.5 px-3 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-all font-mono';

const Index = () => {
  const { t, lang } = useI18n();
  const allPyramids = useLocalizedPyramids(lang);
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => filtersFromParams(params), [params]);
  const compareIds = useMemo(() => parseCompare(params.get('compare'), knownIds), [params]);
  const selectedPyramid = useMemo(() => allPyramids.find((p) => p.id === siteId) ?? null, [allPyramids, siteId]);

  const [flyToKey, setFlyToKey] = useState(0);
  const [showList, setShowList] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [webgl, setWebgl] = useState(hasWebGL);
  const showFlatMap = useCallback(() => setWebgl(false), []);
  const [showIntro, setShowIntro] = useState(!siteId);
  const [compareOpen, setCompareOpen] = useState(() => params.has('compare') && !siteId);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [tourFocusId, setTourFocusId] = useState<string | null>(null);

  const filtered = useMemo(() => sortPyramids(filterPyramids(allPyramids, filters), filters.sort), [allPyramids, filters]);
  const filteredIds = useMemo(() => filtered.map((p) => p.id), [filtered]);
  const tourStops = useMemo(
    () => TOUR_IDS.map((id) => allPyramids.find((p) => p.id === id)).filter((p): p is Pyramid => !!p),
    [allPyramids],
  );

  const focusPoint = useMemo(() => {
    if (filters.continente && continentCenters[filters.continente]) {
      return continentCenters[filters.continente];
    }
    return null;
  }, [filters.continente]);

  const search = params.toString();
  const goToSite = useCallback(
    (id: string | null) => navigate({ pathname: id ? `/site/${id}` : '/', search: search ? `?${search}` : '' }),
    [navigate, search],
  );

  const handleSelect = useCallback((pyramid: Pyramid) => {
    goToSite(pyramid.id);
    setFlyToKey((k) => k + 1);
    setPanelOpen(false);
    setShowIntro(false);
    setTimelineOpen(false);
    setTourIndex(null);
    setTourFocusId(null);
  }, [goToSite]);

  const handleClose = useCallback(() => goToSite(null), [goToSite]);

  const updateFilters = useCallback(
    (next: Filters) => setParams((prev) => filtersToParams(next, prev), { replace: true }),
    [setParams],
  );

  const handleReset = useCallback(() => {
    setTourIndex(null);
    setTourFocusId(null);
    navigate('/');
  }, [navigate]);

  const setCompare = useCallback(
    (ids: string[]) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (ids.length) next.set('compare', ids.join(','));
          else next.delete('compare');
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  const toggleCompare = useCallback(
    (id: string) => {
      if (compareIds.includes(id)) {
        setCompare(compareIds.filter((x) => x !== id));
      } else if (compareIds.length < 6) {
        setCompare([...compareIds, id]);
        setCompareOpen(true);
      }
    },
    [compareIds, setCompare],
  );

  const startTour = useCallback(() => {
    setShowIntro(false);
    setPanelOpen(false);
    goToSite(null);
    setTourIndex(0);
  }, [goToSite]);

  const moveTour = useCallback((index: number) => setTourIndex(Math.max(0, index)), []);

  const endTour = useCallback(() => {
    setTourIndex(null);
    setTourFocusId(null);
  }, []);

  useEffect(() => {
    if (tourIndex === null) return;
    const stop = tourStops[tourIndex];
    if (stop) {
      setTourFocusId(stop.id);
      setFlyToKey((k) => k + 1);
    }
  }, [tourIndex, tourStops]);

  // Keep the tab title useful when a site is shared or bookmarked.
  useEffect(() => {
    document.title = selectedPyramid ? `${selectedPyramid.nome} · Pyramid Explorer` : 'Pyramid Explorer';
  }, [selectedPyramid]);

  const highlightId = tourFocusId ?? selectedPyramid?.id ?? null;

  return (
    <main className="h-svh w-full bg-void overflow-hidden flex flex-row">
      <h1 className="sr-only">Pyramid Explorer</h1>
      {/* Left sidebar: drawer on mobile, fixed column from md up */}
      {panelOpen && (
        <button
          type="button"
          aria-label={t.closePanel}
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
          aria-label={t.closePanel}
        >
          <X size={18} />
        </button>
        <PyramidFilters
          filters={filters}
          onChange={updateFilters}
          onReset={handleReset}
          resultCount={filtered.length}
          totalCount={allPyramids.length}
        />
        <div className="w-full md:w-80 md:min-w-[320px] border-r border-border bg-card/90 md:bg-card/40 backdrop-blur-sm">
          <button
            onClick={() => setShowList(!showList)}
            aria-expanded={showList}
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
              aria-label={t.dismiss}
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
                {t.loading}
              </div>
            }
          >
            <Globe3D
              pyramids={allPyramids}
              filteredIds={filteredIds}
              selectedId={highlightId}
              flyToKey={flyToKey}
              onSelect={handleSelect}
              focusPoint={focusPoint}
              detailsOpen={!!selectedPyramid}
              loadingLabel={t.loading}
              onUnavailable={showFlatMap}
            />
          </Suspense>
        ) : (
          <FlatMap
            pyramids={allPyramids}
            filteredIds={filteredIds}
            selectedId={highlightId}
            onSelect={handleSelect}
            note={t.noWebgl}
          />
        )}

        {tourIndex !== null && (
          <TourCard
            stops={tourStops}
            index={tourIndex}
            onIndexChange={moveTour}
            onOpenDetails={handleSelect}
            onEnd={endTour}
          />
        )}

        <div className={`absolute bottom-4 left-3 right-3 md:left-6 md:right-auto md:bottom-6 z-10 flex flex-wrap gap-2 ${tourIndex !== null ? 'md:hidden' : ''} ${selectedPyramid ? 'md:right-[496px]' : ''}`}>
          <button type="button" onClick={handleReset} className={toolbarButton}>
            ⟳ {t.resetView}
          </button>
          <button type="button" onClick={startTour} className={toolbarButton}>
            <Route size={13} /> {t.tour}
          </button>
          <button type="button" onClick={() => setCompareOpen(true)} className={toolbarButton}>
            <Scale size={13} /> {t.compare}{compareIds.length > 0 ? ` (${compareIds.length})` : ''}
          </button>
          <button type="button" onClick={() => setTimelineOpen(true)} className={toolbarButton}>
            <History size={13} /> {t.timeline}
          </button>
          <button type="button" onClick={() => setAboutOpen(true)} className={toolbarButton}>
            <CircleHelp size={13} /> {t.aboutData}
          </button>
        </div>
      </section>

      <PyramidDetails
        pyramid={selectedPyramid}
        onClose={handleClose}
        inCompare={!!selectedPyramid && compareIds.includes(selectedPyramid.id)}
        onToggleCompare={toggleCompare}
      />

      <CompareDialog
        open={compareOpen}
        onOpenChange={setCompareOpen}
        pyramids={allPyramids}
        selectedIds={compareIds}
        onChange={setCompare}
      />
      <TimelineDialog open={timelineOpen} onOpenChange={setTimelineOpen} pyramids={filtered} onSelect={handleSelect} />
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.aboutData}</DialogTitle>
            <DialogDescription className="leading-relaxed">{t.aboutDataBody}</DialogDescription>
          </DialogHeader>
          <ul className="text-xs font-mono space-y-1">
            <li>{t.statusVerified}: {allPyramids.filter((p) => p.stato_verifica === 'verified').length}</li>
            <li>{t.statusPartial}: {allPyramids.filter((p) => p.stato_verifica === 'partial').length}</li>
            <li>{t.statusUnverified}: {allPyramids.filter((p) => !p.stato_verifica || p.stato_verifica === 'unverified').length}</li>
          </ul>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Index;
