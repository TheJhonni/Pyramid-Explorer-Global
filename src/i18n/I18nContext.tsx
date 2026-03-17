import { createContext, useContext, useState, ReactNode } from 'react';

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
    projectTitle: 'Aetherius Project',
    globalNetwork: 'Global Pyramid Network',
    structuresVisible: 'structures visible',
    search: 'Search',
    searchPlaceholder: 'Name, country, region...',
    structureHeight: 'Structure Height (m)',
    area: 'Area (m²)',
    continent: 'Continent',
    categories: 'Categories',
    controversialOnly: 'Controversial only',
    alternativeResearch: 'Alternative research focus',
    resetFilters: 'Reset filters',
    resultsList: 'Results list',
    resetView: 'Reset view',
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
    projectTitle: 'Progetto Aetherius',
    globalNetwork: 'Rete Piramidale Globale',
    structuresVisible: 'strutture visibili',
    search: 'Ricerca',
    searchPlaceholder: 'Nome, paese, regione...',
    structureHeight: 'Altezza struttura (m)',
    area: 'Area (m²)',
    continent: 'Continente',
    categories: 'Categorie',
    controversialOnly: 'Solo controverse',
    alternativeResearch: 'Focus ricerca alternativa',
    resetFilters: 'Reset filtri',
    resultsList: 'Lista risultati',
    resetView: 'Reset vista',
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
    projectTitle: 'Proyecto Aetherius',
    globalNetwork: 'Red Piramidal Global',
    structuresVisible: 'estructuras visibles',
    search: 'Buscar',
    searchPlaceholder: 'Nombre, país, región...',
    structureHeight: 'Altura estructura (m)',
    area: 'Área (m²)',
    continent: 'Continente',
    categories: 'Categorías',
    controversialOnly: 'Solo controvertidas',
    alternativeResearch: 'Foco investigación alternativa',
    resetFilters: 'Restablecer filtros',
    resultsList: 'Lista de resultados',
    resetView: 'Restablecer vista',
    africa: 'África',
    asia: 'Asia',
    europe: 'Europa',
    northAmerica: 'América del Norte',
    southAmerica: 'América del Sur',
    oceania: 'Oceanía',
    physicalData: 'Datos físicos',
    comparativeInterpretations: 'Interpretaciones comparativas',
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
    country: 'País',
  },
  fr: {
    projectTitle: 'Projet Aetherius',
    globalNetwork: 'Réseau Pyramidal Mondial',
    structuresVisible: 'structures visibles',
    search: 'Rechercher',
    searchPlaceholder: 'Nom, pays, région...',
    structureHeight: 'Hauteur structure (m)',
    area: 'Surface (m²)',
    continent: 'Continent',
    categories: 'Catégories',
    controversialOnly: 'Controversées uniquement',
    alternativeResearch: 'Focus recherche alternative',
    resetFilters: 'Réinitialiser les filtres',
    resultsList: 'Liste des résultats',
    resetView: 'Réinitialiser la vue',
    africa: 'Afrique',
    asia: 'Asie',
    europe: 'Europe',
    northAmerica: 'Amérique du Nord',
    southAmerica: 'Amérique du Sud',
    oceania: 'Océanie',
    physicalData: 'Données physiques',
    comparativeInterpretations: 'Interprétations comparatives',
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
    country: 'Pays',
  },
  de: {
    projectTitle: 'Projekt Aetherius',
    globalNetwork: 'Globales Pyramiden-Netzwerk',
    structuresVisible: 'Strukturen sichtbar',
    search: 'Suche',
    searchPlaceholder: 'Name, Land, Region...',
    structureHeight: 'Strukturhöhe (m)',
    area: 'Fläche (m²)',
    continent: 'Kontinent',
    categories: 'Kategorien',
    controversialOnly: 'Nur kontroverse',
    alternativeResearch: 'Alternative Forschung',
    resetFilters: 'Filter zurücksetzen',
    resultsList: 'Ergebnisliste',
    resetView: 'Ansicht zurücksetzen',
    africa: 'Afrika',
    asia: 'Asien',
    europe: 'Europa',
    northAmerica: 'Nordamerika',
    southAmerica: 'Südamerika',
    oceania: 'Ozeanien',
    physicalData: 'Physische Daten',
    comparativeInterpretations: 'Vergleichende Interpretationen',
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
    base: 'Basis',
    altitude: 'Höhe ü.d.M.',
    noResults: 'Keine Ergebnisse',
    country: 'Land',
  },
  pt: {
    projectTitle: 'Projeto Aetherius',
    globalNetwork: 'Rede Piramidal Global',
    structuresVisible: 'estruturas visíveis',
    search: 'Pesquisar',
    searchPlaceholder: 'Nome, país, região...',
    structureHeight: 'Altura estrutura (m)',
    area: 'Área (m²)',
    continent: 'Continente',
    categories: 'Categorias',
    controversialOnly: 'Apenas controversas',
    alternativeResearch: 'Foco pesquisa alternativa',
    resetFilters: 'Redefinir filtros',
    resultsList: 'Lista de resultados',
    resetView: 'Redefinir vista',
    africa: 'África',
    asia: 'Ásia',
    europe: 'Europa',
    northAmerica: 'América do Norte',
    southAmerica: 'América do Sul',
    oceania: 'Oceania',
    physicalData: 'Dados físicos',
    comparativeInterpretations: 'Interpretações comparativas',
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

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en');

  const t = translations[lang];
  const tc = (continent: string) => continentTranslations[lang][continent] || continent;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tc }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
