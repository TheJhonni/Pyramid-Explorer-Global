import type { Lang } from './I18nContext';

// Labels for the `civilta` keys in pyramids.json. Each key comes from the site's
// "popolazione_ufficiale_associata" text; sites with mixed, modern, natural or
// unknown builders have no key and are not listed here.
type Labels = [en: string, it: string, es: string, fr: string, de: string, pt: string];

const LABELS: Record<string, Labels> = {
  egyptian: ['Ancient Egypt', 'Antico Egitto', 'Antiguo Egipto', 'Égypte antique', 'Altes Ägypten', 'Antigo Egito'],
  maya: ['Maya', 'Maya', 'Maya', 'Maya', 'Maya', 'Maia'],
  khmer: ['Khmer', 'Khmer', 'Jemer', 'Khmer', 'Khmer', 'Khmer'],
  moche: ['Moche', 'Moche', 'Moche', 'Moche', 'Moche', 'Moche'],
  kush: ['Kingdom of Kush', 'Regno di Kush', 'Reino de Kush', 'Royaume de Koush', 'Reich von Kusch', 'Reino de Cuxe'],
  teotihuacan: ['Teotihuacan', 'Teotihuacan', 'Teotihuacan', 'Teotihuacan', 'Teotihuacan', 'Teotihuacan'],
  mississippian: ['Mississippian culture', 'Cultura del Mississippi', 'Cultura del Misisipi', 'Culture du Mississippi', 'Mississippi-Kultur', 'Cultura do Mississippi'],
  han: ['Han dynasty', 'Dinastia Han', 'Dinastía Han', 'Dynastie Han', 'Han-Dynastie', 'Dinastia Han'],
  babylonian: ['Babylonians', 'Babilonesi', 'Babilonios', 'Babyloniens', 'Babylonier', 'Babilônios'],
  qin: ['Qin dynasty', 'Dinastia Qin', 'Dinastía Qin', 'Dynastie Qin', 'Qin-Dynastie', 'Dinastia Qin'],
  tiwanaku: ['Tiwanaku', 'Tiwanaku', 'Tiwanaku', 'Tiwanaku', 'Tiwanaku', 'Tiwanaku'],
  majapahit: ['Majapahit', 'Majapahit', 'Majapahit', 'Majapahit', 'Majapahit', 'Majapahit'],
  caral_supe: ['Caral-Supe', 'Caral-Supe', 'Caral-Supe', 'Caral-Supe', 'Caral-Supe', 'Caral-Supe'],
  neolithic_britain: ['Neolithic Britain', 'Britannia neolitica', 'Britania neolítica', 'Bretagne néolithique', 'Neolithisches Britannien', 'Britânia neolítica'],
  sailendra: ['Sailendra dynasty', 'Dinastia Sailendra', 'Dinastía Sailendra', 'Dynastie Sailendra', 'Sailendra-Dynastie', 'Dinastia Sailendra'],
  sumerian: ['Sumerians', 'Sumeri', 'Sumerios', 'Sumériens', 'Sumerer', 'Sumérios'],
  caranqui: ['Caranqui', 'Caranqui', 'Caranqui', 'Caranqui', 'Caranqui', 'Caranqui'],
  greek: ['Ancient Greeks', 'Antichi Greci', 'Antiguos griegos', 'Grecs anciens', 'Antike Griechen', 'Gregos antigos'],
  pre_nuragic: ['Pre-Nuragic Sardinia', 'Sardegna prenuragica', 'Cerdeña prenurágica', 'Sardaigne prénuragique', 'Vornuraghisches Sardinien', 'Sardenha pré-nurágica'],
  pre_islamic_arabia: ['Pre-Islamic southeastern Arabia', 'Arabia sudorientale preislamica', 'Arabia suroriental preislámica', 'Arabie du Sud-Est préislamique', 'Vorislamisches Südostarabien', 'Arábia sudeste pré-islâmica'],
  nazca: ['Nazca', 'Nazca', 'Nazca', 'Nazca', 'Nazca', 'Nazca'],
  chola: ['Chola dynasty', 'Dinastia Chola', 'Dinastía Chola', 'Dynastie Chola', 'Chola-Dynastie', 'Dinastia Chola'],
  tui_tonga: ['Tuʻi Tonga', 'Tuʻi Tonga', 'Tuʻi Tonga', 'Tuʻi Tonga', 'Tuʻi Tonga', 'Tuʻi Tonga'],
  roman: ['Romans', 'Romani', 'Romanos', 'Romains', 'Römer', 'Romanos'],
  elamite: ['Elamites', 'Elamiti', 'Elamitas', 'Élamites', 'Elamer', 'Elamitas'],
  kassite: ['Kassites', 'Cassiti', 'Casitas', 'Kassites', 'Kassiten', 'Cassitas'],
  goguryeo: ['Goguryeo', 'Goguryeo', 'Goguryeo', 'Koguryo', 'Goguryeo', 'Goguryeo'],
  classic_veracruz: ['Classic Veracruz culture', 'Cultura classica di Veracruz', 'Cultura clásica de Veracruz', 'Culture classique de Veracruz', 'Klassische Veracruz-Kultur', 'Cultura clássica de Veracruz'],
  mexica: ['Mexica (Aztecs)', 'Mexica (Aztechi)', 'Mexicas (aztecas)', 'Mexicas (Aztèques)', 'Mexica (Azteken)', 'Mexicas (astecas)'],
  zapotec: ['Zapotecs', 'Zapotechi', 'Zapotecas', 'Zapotèques', 'Zapoteken', 'Zapotecas'],
  toltec: ['Toltecs', 'Toltechi', 'Toltecas', 'Toltèques', 'Tolteken', 'Toltecas'],
  xochicalco: ['Xochicalco', 'Xochicalco', 'Xochicalco', 'Xochicalco', 'Xochicalco', 'Xochicalco'],
  lima: ['Lima culture', 'Cultura Lima', 'Cultura Lima', 'Culture Lima', 'Lima-Kultur', 'Cultura Lima'],
  ychma: ['Ychma', 'Ychma', 'Ychma', 'Ychma', 'Ychma', 'Ychma'],
  poverty_point: ['Poverty Point culture', 'Cultura di Poverty Point', 'Cultura Poverty Point', 'Culture de Poverty Point', 'Poverty-Point-Kultur', 'Cultura Poverty Point'],
  tahitian: ['Tahitians', 'Tahitiani', 'Tahitianos', 'Tahitiens', 'Tahitianer', 'Taitianos'],
  samoan: ['Samoans', 'Samoani', 'Samoanos', 'Samoans', 'Samoaner', 'Samoanos'],
};

const ORDER: Lang[] = ['en', 'it', 'es', 'fr', 'de', 'pt'];

export const civilizationKeys = Object.keys(LABELS);

export const civilizationLabel = (key: string, lang: Lang) => LABELS[key]?.[ORDER.indexOf(lang)] ?? key;
