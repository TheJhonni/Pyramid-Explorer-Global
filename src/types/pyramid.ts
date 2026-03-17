export interface Pyramid {
  id: string;
  nome: string;
  nome_locale: string;
  coordinate: {
    lat: number;
    lon: number;
  };
  paese: string;
  regione: string;
  continente: string;
  altitudine_sul_livello_del_mare_m: number;
  altezza_struttura_m: number;
  base_m: number;
  area_mq: number;
  tipo: string;
  datazione_ufficiale: string;
  datazione_non_ufficiale: string;
  funzione_ufficiale: string;
  funzione_non_ufficiale: string;
  popolazione_ufficiale_associata: string;
  popolazione_non_ufficiale_associata: string;
  leggende_locali: string[];
  riferimenti_ufficiali: string[];
  riferimenti_non_ufficiali: string[];
  link_approfondimento_ufficiale: string[];
  link_approfondimento_non_ufficiale: string[];
  note: string;
  osmanagich_focus: boolean;
  controversa: boolean;
  immagini?: string[];
  google_images_url?: string;
}

export interface Filters {
  heightMin: number;
  heightMax: number;
  areaMin: number;
  areaMax: number;
  continente: string;
  searchText: string;
  soloControverse: boolean;
  soloOsmanagich: boolean;
}

export const defaultFilters: Filters = {
  heightMin: 0,
  heightMax: 500,
  areaMin: 0,
  areaMax: 250000,
  continente: '',
  searchText: '',
  soloControverse: false,
  soloOsmanagich: false,
};

export const continenti = [
  'Africa',
  'Asia',
  'Europa',
  'Nord America',
  'Sud America',
  'Oceania',
];

export const continentCenters: Record<string, { lat: number; lng: number; altitude: number }> = {
  'Africa': { lat: 5, lng: 20, altitude: 2 },
  'Asia': { lat: 30, lng: 90, altitude: 2 },
  'Europa': { lat: 48, lng: 15, altitude: 1.8 },
  'Nord America': { lat: 35, lng: -100, altitude: 2 },
  'Sud America': { lat: -15, lng: -60, altitude: 2 },
  'Oceania': { lat: -25, lng: 135, altitude: 2 },
};
