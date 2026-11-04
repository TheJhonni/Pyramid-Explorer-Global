import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt';

export const langNames: Record<Lang, string> = {
  en: 'English',
  it: 'Italiano',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
};

type TranslationKeys = {
  // Header
  projectTitle: string;
  globalNetwork: string;
  structuresVisible: string;
  // Filters
  search: string;
  searchPlaceholder: string;
  structureHeight: string;
  area: string;
  continent: string;
  categories: string;
  controversialOnly: string;
  alternativeResearch: string;
  resetFilters: string;
  resultsList: string;
  resetView: string;
  intro: string;
  filtersButton: string;
  noWebgl: string;
  loadingGlobe: string;
  close: string;
  // Continents
  africa: string;
  asia: string;
  europe: string;
  northAmerica: string;
  southAmerica: string;
  oceania: string;
  // Details
  physicalData: string;
  comparativeInterpretations: string;
  officialScience: string;
  alternativeScience: string;
  dating: string;
  function_: string;
  civilization: string;
  localLegends: string;
  notes: string;
  officialSources: string;
  alternativeSources: string;
  type: string;
  height: string;
  base: string;
  altitude: string;
  noResults: string;
  photos: string;
  searchMorePhotos: string;
  // Pyramid data fields
  country: string;
};

const translations: Record<Lang, TranslationKeys> = {
  en: {
    projectTitle: 'Pyramid Explorer',
    globalNetwork: 'Pyramids of the world',
    structuresVisible: 'structures visible',
    search: 'Search',
    searchPlaceholder: 'Name, country, region...',
    structureHeight: 'Structure Height (m)',
    area: 'Area (m²)',
    continent: 'Continent',
    categories: 'Categories',
    controversialOnly: 'Controversial only',
    alternativeResearch: 'Alternative research only',
    resetFilters: 'Reset filters',
    resultsList: 'Results list',
    resetView: 'Reset view',
    intro: 'An interactive 3D globe of {n} pyramids and pyramid-like structures. Drag to rotate, pinch or scroll to zoom, tap a marker for details.',
    filtersButton: 'Filters & list',
    noWebgl: '3D globe unavailable on this device (WebGL off): showing a flat map.',
    loadingGlobe: 'Loading globe…',
    close: 'Close',
    africa: 'Africa',
    asia: 'Asia',
    europe: 'Europe',
    northAmerica: 'North America',
    southAmerica: 'South America',
    oceania: 'Oceania',
    physicalData: 'Physical Data',
    comparativeInterpretations: 'Comparative Interpretations',
    officialScience: 'Official science',
    alternativeScience: 'Alternative science',
    dating: 'Dating',
    function_: 'Function',
    civilization: 'Civilization',
    localLegends: 'Local Legends',
    notes: 'Notes',
    officialSources: 'Official sources',
    alternativeSources: 'Alternative sources',
    type: 'Type',
    height: 'Height',
    base: 'Base',
    altitude: 'Altitude a.s.l.',
    noResults: 'No results found',
    photos: 'Photos',
    searchMorePhotos: 'Search more photos on Google',
    country: 'Country',
  },
  it: {
    projectTitle: 'Pyramid Explorer',
    globalNetwork: 'Piramidi del mondo',
    structuresVisible: 'strutture visibili',
    search: 'Ricerca',
    searchPlaceholder: 'Nome, paese, regione...',
    structureHeight: 'Altezza struttura (m)',
    area: 'Area (m²)',
    continent: 'Continente',
    categories: 'Categorie',
    controversialOnly: 'Solo controverse',
    alternativeResearch: 'Solo ricerca alternativa',
    resetFilters: 'Azzera i filtri',
    resultsList: 'Lista risultati',
    resetView: 'Ripristina la vista',
    intro: 'Un globo 3D interattivo con {n} piramidi e strutture piramidali. Trascina per ruotare, pizzica o scorri per lo zoom, tocca un segnaposto per i dettagli.',
    filtersButton: 'Filtri e lista',
    noWebgl: 'Globo 3D non disponibile su questo dispositivo (WebGL disattivato): mappa piana.',
    loadingGlobe: 'Caricamento del globo…',
    close: 'Chiudi',
    africa: 'Africa',
    asia: 'Asia',
    europe: 'Europa',
    northAmerica: 'Nord America',
    southAmerica: 'Sud America',
    oceania: 'Oceania',
    physicalData: 'Dati fisici',
    comparativeInterpretations: 'Interpretazioni a confronto',
    officialScience: 'Scienza ufficiale',
    alternativeScience: 'Scienza alternativa',
    dating: 'Datazione',
    function_: 'Funzione',
    civilization: 'Civiltà',
    localLegends: 'Leggende locali',
    notes: 'Note',
    officialSources: 'Fonti ufficiali',
    alternativeSources: 'Fonti alternative',
    type: 'Tipo',
    height: 'Altezza',
    base: 'Base',
    altitude: 'Altitudine s.l.m.',
    noResults: 'Nessun risultato trovato',
    photos: 'Foto',
    searchMorePhotos: 'Cerca altre foto su Google',
    country: 'Paese',
  },
  es: {
    projectTitle: 'Pyramid Explorer',
    globalNetwork: 'Pirámides del mundo',
    structuresVisible: 'estructuras visibles',
    search: 'Buscar',
    searchPlaceholder: 'Nombre, país, región...',
    structureHeight: 'Altura de la estructura (m)',
    area: 'Área (m²)',
    continent: 'Continente',
    categories: 'Categorías',
    controversialOnly: 'Solo controvertidas',
    alternativeResearch: 'Solo investigación alternativa',
    resetFilters: 'Restablecer filtros',
    resultsList: 'Lista de resultados',
    resetView: 'Restablecer vista',
    intro: 'Un globo 3D interactivo con {n} pirámides y estructuras piramidales. Arrastra para girar, pellizca o desplaza para hacer zoom, toca un marcador para ver detalles.',
    filtersButton: 'Filtros y lista',
    noWebgl: 'Globo 3D no disponible en este dispositivo (WebGL desactivado): mapa plano.',
    loadingGlobe: 'Cargando el globo…',
    close: 'Cerrar',
    africa: 'África',
    asia: 'Asia',
    europe: 'Europa',
    northAmerica: 'América del Norte',
    southAmerica: 'América del Sur',
    oceania: 'Oceanía',
    physicalData: 'Datos físicos',
    comparativeInterpretations: 'Interpretaciones comparadas',
    officialScience: 'Ciencia oficial',
    alternativeScience: 'Ciencia alternativa',
    dating: 'Datación',
    function_: 'Función',
    civilization: 'Civilización',
    localLegends: 'Leyendas locales',
    notes: 'Notas',
    officialSources: 'Fuentes oficiales',
    alternativeSources: 'Fuentes alternativas',
    type: 'Tipo',
    height: 'Altura',
    base: 'Base',
    altitude: 'Altitud s.n.m.',
    noResults: 'Sin resultados',
    photos: 'Fotos',
    searchMorePhotos: 'Buscar más fotos en Google',
    country: 'País',
  },
  fr: {
    projectTitle: 'Pyramid Explorer',
    globalNetwork: 'Les pyramides du monde',
    structuresVisible: 'structures visibles',
    search: 'Rechercher',
    searchPlaceholder: 'Nom, pays, région...',
    structureHeight: 'Hauteur de la structure (m)',
    area: 'Surface (m²)',
    continent: 'Continent',
    categories: 'Catégories',
    controversialOnly: 'Controversées uniquement',
    alternativeResearch: 'Recherche alternative uniquement',
    resetFilters: 'Réinitialiser les filtres',
    resultsList: 'Liste des résultats',
    resetView: 'Réinitialiser la vue',
    intro: 'Un globe 3D interactif de {n} pyramides et structures pyramidales. Faites glisser pour pivoter, pincez ou faites défiler pour zoomer, touchez un repère pour les détails.',
    filtersButton: 'Filtres et liste',
    noWebgl: 'Globe 3D indisponible sur cet appareil (WebGL désactivé) : carte plane.',
    loadingGlobe: 'Chargement du globe…',
    close: 'Fermer',
    africa: 'Afrique',
    asia: 'Asie',
    europe: 'Europe',
    northAmerica: 'Amérique du Nord',
    southAmerica: 'Amérique du Sud',
    oceania: 'Océanie',
    physicalData: 'Données physiques',
    comparativeInterpretations: 'Interprétations comparées',
    officialScience: 'Science officielle',
    alternativeScience: 'Science alternative',
    dating: 'Datation',
    function_: 'Fonction',
    civilization: 'Civilisation',
    localLegends: 'Légendes locales',
    notes: 'Notes',
    officialSources: 'Sources officielles',
    alternativeSources: 'Sources alternatives',
    type: 'Type',
    height: 'Hauteur',
    base: 'Base',
    altitude: 'Altitude',
    noResults: 'Aucun résultat',
    photos: 'Photos',
    searchMorePhotos: 'Chercher plus de photos sur Google',
    country: 'Pays',
  },
  de: {
    projectTitle: 'Pyramid Explorer',
    globalNetwork: 'Pyramiden der Welt',
    structuresVisible: 'Bauwerke sichtbar',
    search: 'Suche',
    searchPlaceholder: 'Name, Land, Region...',
    structureHeight: 'Höhe des Bauwerks (m)',
    area: 'Fläche (m²)',
    continent: 'Kontinent',
    categories: 'Kategorien',
    controversialOnly: 'Nur umstrittene',
    alternativeResearch: 'Nur alternative Forschung',
    resetFilters: 'Filter zurücksetzen',
    resultsList: 'Ergebnisliste',
    resetView: 'Ansicht zurücksetzen',
    intro: 'Ein interaktiver 3D-Globus mit {n} Pyramiden und pyramidenartigen Bauwerken. Zum Drehen ziehen, mit zwei Fingern oder dem Mausrad zoomen, für Details eine Markierung antippen.',
    filtersButton: 'Filter & Liste',
    noWebgl: '3D-Globus auf diesem Gerät nicht verfügbar (WebGL aus): flache Karte.',
    loadingGlobe: 'Globus wird geladen…',
    close: 'Schließen',
    africa: 'Afrika',
    asia: 'Asien',
    europe: 'Europa',
    northAmerica: 'Nordamerika',
    southAmerica: 'Südamerika',
    oceania: 'Ozeanien',
    physicalData: 'Kenndaten',
    comparativeInterpretations: 'Deutungen im Vergleich',
    officialScience: 'Offizielle Wissenschaft',
    alternativeScience: 'Alternative Wissenschaft',
    dating: 'Datierung',
    function_: 'Funktion',
    civilization: 'Zivilisation',
    localLegends: 'Lokale Legenden',
    notes: 'Anmerkungen',
    officialSources: 'Offizielle Quellen',
    alternativeSources: 'Alternative Quellen',
    type: 'Typ',
    height: 'Höhe',
    base: 'Grundseite',
    altitude: 'Höhe ü.d.M.',
    noResults: 'Keine Ergebnisse',
    photos: 'Fotos',
    searchMorePhotos: 'Mehr Fotos auf Google suchen',
    country: 'Land',
  },
  pt: {
    projectTitle: 'Pyramid Explorer',
    globalNetwork: 'Pirâmides do mundo',
    structuresVisible: 'estruturas visíveis',
    search: 'Pesquisar',
    searchPlaceholder: 'Nome, país, região...',
    structureHeight: 'Altura da estrutura (m)',
    area: 'Área (m²)',
    continent: 'Continente',
    categories: 'Categorias',
    controversialOnly: 'Apenas controversas',
    alternativeResearch: 'Só investigação alternativa',
    resetFilters: 'Repor os filtros',
    resultsList: 'Lista de resultados',
    resetView: 'Repor a vista',
    intro: 'Um globo 3D interativo com {n} pirâmides e estruturas piramidais. Arraste para rodar, use dois dedos ou a roda do rato para fazer zoom e toque num marcador para ver os detalhes.',
    filtersButton: 'Filtros e lista',
    noWebgl: 'Globo 3D indisponível neste dispositivo (WebGL desativado): mapa plano.',
    loadingGlobe: 'A carregar o globo…',
    close: 'Fechar',
    africa: 'África',
    asia: 'Ásia',
    europe: 'Europa',
    northAmerica: 'América do Norte',
    southAmerica: 'América do Sul',
    oceania: 'Oceania',
    physicalData: 'Dados físicos',
    comparativeInterpretations: 'Interpretações comparadas',
    officialScience: 'Ciência oficial',
    alternativeScience: 'Ciência alternativa',
    dating: 'Datação',
    function_: 'Função',
    civilization: 'Civilização',
    localLegends: 'Lendas locais',
    notes: 'Notas',
    officialSources: 'Fontes oficiais',
    alternativeSources: 'Fontes alternativas',
    type: 'Tipo',
    height: 'Altura',
    base: 'Base',
    altitude: 'Altitude',
    noResults: 'Sem resultados',
    photos: 'Fotos',
    searchMorePhotos: 'Pesquisar mais fotos no Google',
    country: 'País',
  },
};

// Localized pyramid field names for each language
// Map from internal continent names to localized versions
export const continentTranslations: Record<Lang, Record<string, string>> = {
  en: { 'Africa': 'Africa', 'Asia': 'Asia', 'Europa': 'Europe', 'Nord America': 'North America', 'Sud America': 'South America', 'Oceania': 'Oceania' },
  it: { 'Africa': 'Africa', 'Asia': 'Asia', 'Europa': 'Europa', 'Nord America': 'Nord America', 'Sud America': 'Sud America', 'Oceania': 'Oceania' },
  es: { 'Africa': 'África', 'Asia': 'Asia', 'Europa': 'Europa', 'Nord America': 'América del Norte', 'Sud America': 'América del Sur', 'Oceania': 'Oceanía' },
  fr: { 'Africa': 'Afrique', 'Asia': 'Asie', 'Europa': 'Europe', 'Nord America': 'Amérique du Nord', 'Sud America': 'Amérique du Sud', 'Oceania': 'Océanie' },
  de: { 'Africa': 'Afrika', 'Asia': 'Asien', 'Europa': 'Europa', 'Nord America': 'Nordamerika', 'Sud America': 'Südamerika', 'Oceania': 'Ozeanien' },
  pt: { 'Africa': 'África', 'Asia': 'Ásia', 'Europa': 'Europa', 'Nord America': 'América do Norte', 'Sud America': 'América do Sul', 'Oceania': 'Oceania' },
};

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationKeys;
  tc: (continent: string) => string; // translate continent
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
  tc: (c) => c,
});

const isLang = (value: string): value is Lang => value in langNames;

/** First browser language we support, English otherwise. */
export const detectLang = (): Lang => {
  if (typeof navigator === 'undefined') return 'en';
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const c of candidates) {
    const short = (c || '').slice(0, 2).toLowerCase();
    if (isLang(short)) return short;
  }
  return 'en';
};

export const I18nProvider = ({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) => {
  const [lang, setLang] = useState<Lang>(() => initialLang ?? detectLang());

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];
  const tc = (continent: string) => continentTranslations[lang][continent] || continent;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tc }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
