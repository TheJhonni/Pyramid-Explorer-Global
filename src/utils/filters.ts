import { Pyramid, Filters, Period, HEIGHT_LIMIT, AREA_LIMIT } from '@/types/pyramid';

const inPeriod = (year: number | null | undefined, period: Period) => {
  if (!period) return true;
  if (year === null || year === undefined) return false;
  if (period === 'ancient') return year < -2000;
  if (period === 'bce') return year >= -2000 && year < 1;
  if (period === 'first') return year >= 1 && year <= 1000;
  return year > 1000;
};

// The top of a slider means "no upper limit", so nothing larger is ever hidden by default.
const withinMax = (value: number, max: number, limit: number) => max >= limit || value <= max;

export function filterPyramids(pyramids: Pyramid[], filters: Filters): Pyramid[] {
  return pyramids.filter((p) => {
    if (p.altezza_struttura_m < filters.heightMin || !withinMax(p.altezza_struttura_m, filters.heightMax, HEIGHT_LIMIT)) return false;
    if (p.area_mq < filters.areaMin || !withinMax(p.area_mq, filters.areaMax, AREA_LIMIT)) return false;
    if (filters.continente && p.continente !== filters.continente) return false;
    if (filters.soloControverse && !p.controversa) return false;
    if (filters.soloOsmanagich && !p.osmanagich_focus) return false;
    if (filters.soloVerificate && p.stato_verifica !== 'verified') return false;
    if (!inPeriod(p.anno_inizio, filters.period)) return false;
    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      const searchable = `${p.nome} ${p.nome_locale} ${p.paese} ${p.regione} ${p.tipo}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

export function sortPyramids(pyramids: Pyramid[], sort: Filters['sort']): Pyramid[] {
  const sorted = [...pyramids];
  if (sort === 'height') return sorted.sort((a, b) => b.altezza_struttura_m - a.altezza_struttura_m);
  if (sort === 'oldest') {
    return sorted.sort((a, b) => (a.anno_inizio ?? Infinity) - (b.anno_inizio ?? Infinity));
  }
  return sorted.sort((a, b) => a.nome.localeCompare(b.nome));
}
