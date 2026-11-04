// Image data for each pyramid
// Using Wikipedia thumbnail API for reliable loading + Google Images search

type ImageData = {
  immagini: string[];
  google_images_url: string;
};

// Helper: generate Wikipedia thumbnail URL from filename
const wiki = (filename: string, width = 800) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${filename}/${width}px-${filename.split('/').pop()}`;

export const pyramidImages: Record<string, ImageData> = {
  bosnia_sun: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Visocica_hill.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Bosnian+Pyramid+of+the+Sun+Visoko",
  },
  bosnia_moon: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Bosnian+Pyramid+of+the+Moon+Visoko+Pljesevica",
  },
  bosnia_love: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Bosnian+Pyramid+of+Love+Visoko",
  },
  bosnia_dragon: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Bosnian+Pyramid+of+the+Dragon+Visoko",
  },
  bosnia_earth: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Bosnian+Pyramid+of+Earth+Visoko",
  },
  bosnia_ravne_tunnels: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Ravne+tunnels+Visoko+Bosnia+pyramid",
  },
  giza_great: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/af/All_Gizah_Pyramids.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Great+Pyramid+of+Giza+Khufu+Cheops",
  },
  giza_khafre: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Khafre%27s_Pyramid_01.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Pyramid+of+Khafre+Giza+sphinx",
  },
  giza_menkaure: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Pyramid+of+Menkaure+Giza+Egypt",
  },
  saqqara_djoser: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/6/60/Saqqara_BW_5.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Step+Pyramid+Djoser+Saqqara",
  },
  dahshur_red: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Red+Pyramid+Dahshur+Egypt",
  },
  dahshur_bent: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/e/ed/Snefru%27s_Bent_Pyramid_in_Dahshur.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Bent+Pyramid+Dahshur+Sneferu",
  },
  teotihuacan_sun: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Piramide_del_Sol_072006.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Pyramid+of+the+Sun+Teotihuacan+Mexico",
  },
  teotihuacan_moon: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Pyramid+of+the+Moon+Teotihuacan",
  },
  cholula: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Great+Pyramid+Cholula+Tlachihualtepetl+Mexico",
  },
  la_danta: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=La+Danta+pyramid+El+Mirador+Guatemala",
  },
  gunung_padang: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Gunung+Padang+megalithic+site+Indonesia",
  },
  xian_mausoleum: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Mausoleum+Qin+Shi+Huang+pyramid+aerial+Xian",
  },
  xian_white_pyramid: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=White+Pyramid+Xian+China+Chinese+pyramids",
  },
  yangling: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Yangling+Mausoleum+Han+Dynasty+pyramid",
  },
  monks_mound: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Monks_Mound_in_July.JPG",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Monks+Mound+Cahokia+Illinois+aerial",
  },
  akapana: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Akapana+pyramid+Tiwanaku+Bolivia",
  },
  huaca_del_sol: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Huaca+del+Sol+Moche+Peru+pyramid",
  },
  nubian_meroe: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/f/f0/Sudan_Meroe_Pyramids_30sep2005_2.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Meroe+pyramids+Sudan+Nubian",
  },
  chichen_itza: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Chichen-Itza-Castillo-Seen-From-East.JPG",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=El+Castillo+Kukulkan+Chichen+Itza",
  },
  tikal_temple1: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Tikal+Temple+I+Great+Jaguar+Guatemala",
  },
  candi_sukuh: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Candi+Sukuh+Java+pyramid+temple",
  },
  caral: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Caral+pyramid+Peru+ancient+city+Supe",
  },
  tenerife_guimar: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Pyramids+Guimar+Tenerife+Canary+Islands",
  },
  yonaguni: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Yonaguni+Monument+underwater+pyramid+Japan",
  },
  silbury_hill: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Silbury_Hill_02.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Silbury+Hill+Wiltshire+England",
  },
  borobudur: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Borobudur-Nothwest-view.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Borobudur+temple+pyramid+Java+Indonesia+aerial",
  },
  ziggurat_ur: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Ziggurat_of_ur.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Ziggurat+of+Ur+Iraq+reconstruction",
  },
  cochasqui: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Cochasqui+pyramids+Ecuador",
  },
  tucume: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Tucume+valley+of+pyramids+Peru+aerial",
  },
  etemenanki: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Etemenanki+Tower+of+Babel+Babylon+reconstruction",
  },
  palenque: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Temple+of+Inscriptions+Palenque+Pakal+sarcophagus",
  },
  hellinikon: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Pyramid+of+Hellinikon+Greece+Argolid",
  },
  monte_daccodi: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Monte+d%27Accoddi+Sardinia+ziggurat+altar",
  },
  sharjah_mleiha: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Mleiha+archaeological+site+Sharjah+UAE",
  },
  indonesia_lalakon: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Lalakon+site+Bandung+Indonesia+pyramid",
  },
  peru_cahuachi: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Cahuachi+Nazca+Peru+pyramids+archaeological",
  },
  india_brihadisvara: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Brihadisvara+Temple+Thanjavur+vimana+tower",
  },
  cambodia_koh_ker: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Prasat+Thom+Koh+Ker+pyramid+Cambodia",
  },
  tonga_langi: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Langi+tombs+Tonga+pyramid+Mu%27a",
  },
  australia_gympie: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Gympie+Pyramid+Queensland+Australia",
  },
  canary_tenerife_step: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Icod+de+los+Vinos+pyramid+Tenerife",
  },
  mexico_uxmal: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Pyramid+of+the+Magician+Uxmal+Mexico",
  },
  sudan_jebel_barkal: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Jebel+Barkal+pyramids+Sudan+Napata",
  },
  russia_kola: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Kola+Peninsula+pyramids+Russia+Hyperborea",
  },
  crimea_underwater: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Crimea+underwater+pyramid+Sevastopol",
  },
  azores_underwater: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Azores+underwater+pyramid+Terceira+Atlantis",
  },
  egypt_abu_rawash: {
    immagini: [],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Abu+Rawash+pyramid+Djedefre+Egypt",
  },
  egypt_meidum: {
    immagini: [
      "https://upload.wikimedia.org/wikipedia/commons/7/73/Meidum_pyramid_2005.jpg",
    ],
    google_images_url: "https://www.google.com/search?tbm=isch&q=Meidum+pyramid+Egypt+collapsed",
  },
};
