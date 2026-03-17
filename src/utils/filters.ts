import { Pyramid, Filters } from '@/types/pyramid';

export function filterPyramids(pyramids: Pyramid[], filters: Filters): Pyramid[] {
  return pyramids.filter((p) => {
    if (p.altezza_struttura_m < filters.heightMin || p.altezza_struttura_m > filters.heightMax) return false;
    if (p.area_mq < filters.areaMin || p.area_mq > filters.areaMax) return false;
    if (filters.continente && p.continente !== filters.continente) return false;
    if (filters.soloControverse && !p.controversa) return false;
    if (filters.soloOsmanagich && !p.osmanagich_focus) return false;
    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      const searchable = `${p.nome} ${p.nome_locale} ${p.paese} ${p.regione} ${p.tipo}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}
