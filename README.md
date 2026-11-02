# Pyramid Explorer Global

Voglio che tu crei una web app in React + TypeScript con backend (Node/Express o simile) che mostri un globo terrestre 3D interattivo con tutti i segnaposto relativi a piramidi e strutture piramidali / presunte costruzioni di origine dubbia diffuse nel mondo.

Stack e librerie

Frontend: React + TypeScript.

3D: Usa Three.js oppure globe.gl (basato su Three.js) per il globo 3D interattivo con possibilità di:

rotazione automatica lenta (auto-rotate),

rotazione con mouse / touch (orbit controls),

zoom in / zoom out fluido.

Styling: Tailwind CSS o equivalente.

Backend: Node.js + Express o NestJS, con endpoint REST per servire il dataset delle piramidi.

Data format: file JSON strutturato con tutti i campi che ti elenco.

Puoi ispirarti a esempi di globo 3D interattivo con pins e auto-rotazione, luce, texture terrestre, ecc. (es. demo di Three.js o globe.gl che mostrano come convertire lat/long in coordinate 3D e gestire pins/markers).

Funzionalità del globo 3D

Globo sferico 3D realistico

Texture stile mappamondo classico: continenti, oceani, mari, catene montuose, stati, capitali e principali città ben visibili.

Colori e stile simili a un mappamondo fisico da scrivania (toni blu per mari, verdi/marroni per terre).

Rotazione lenta continua (auto-rotate) che l’utente può interrompere/alterare usando il mouse o il touch.

Controlli di:

rotazione con drag del mouse / swipe,

zoom con scroll o pinch,

reset posizione camera.

Parte illuminata in tempo reale (day/night terminator)

Implementa un sistema che mostra il lato illuminato dal Sole in base all’ora corrente e alla posizione del Sole rispetto alla Terra.

Calcola la terminatrice giorno/notte in tempo reale, oppure aggiorna almeno ogni 30 minuti.

Visualizza:

zona diurna ben illuminata,

zona notturna più scura,

una fascia di “twilight” se possibile (alba/tramonto).

L’illuminazione deve ruotare in sincronizzazione con la Terra: la porzione illuminata cambia con il passare del tempo.

Pins a forma di piramide

Ogni piramide o presunta struttura piramidale deve essere rappresentata da un pin 3D a forma di piccola piramide (non il solito pin tondo).

I pins devono:

essere posizionati secondo latitudine e longitudine,

avere un leggero effetto emissivo o glow quando selezionati o filtrati,

essere cliccabili e selezionabili anche dopo uno zoom in,

comparire sempre sopra la superficie (leggermente “staccati” dal globo).

Quando si applicano filtri, le piramidi che soddisfano i criteri devono:

illuminarsi di verde (o altro colore ben visibile),

eventuale leggera animazione di “pulse” per attirare l’attenzione.

Dataset e focus su Sam Osmanagich

Voglio che tu costruisca e includa un enorme file JSON (anche inizialmente parziale, ma strutturato) che elenca:

Tutte le piramidi note al mondo o strutture a forma piramidale / monumenti a gradoni / tumuli piramidali ecc., con dati il più possibile completi.

In particolare tutte le piramidi e siti collegati al lavoro di Sam (Semir) Osmanagich, cioè:

Complesso delle Piramidi di Bosnia (Visoko):

“Piramide del Sole” (Visočica Hill),

“Piramide della Luna”,

“Piramide dell’Amore”,

“Piramide del Drago”,

“Piramide della Terra”,

sistema di tunnel Ravne, Ravne 2, Ravne 3, Ravne 5, ecc.

Altre località/piramidi su cui Osmanagich ha fatto ricerche o affermazioni, come ad esempio:

Piramidi in Cina,

Gunung Padang (Indonesia),

Mesoamerica (Teotihuacan, La Danta in Guatemala, Cholula, ecc.),

Yangling Mausoleum in Cina,

Monks Mound (USA),

Akapana (Bolivia),

Huaca del Sol (Perù),

altre piramidi e siti che Osmanagich cita come parte di una rete globale di piramidi.

Per ogni piramide/struttura nel JSON, usa una struttura tipo:

json

{
  "id": "bosnia_pyramid_sun",
  "nome": "Piramide del Sole",
  "nome_locale": "Bosanska Piramida Sunca",
  "coordinate": {
    "lat": 43.9883,
    "lon": 18.1760
  },
  "paese": "Bosnia ed Erzegovina",
  "regione": "Visoko",
  "continente": "Europa",
  "altitudine_sul_livello_del_mare_m": 766,
  "altezza_struttura_m": 220,
  "base_m": 420,
  "area_mq": 176400,
  "datazione_ufficiale": "Collina naturale medievale con resti di fortezza; nessuna piramide riconosciuta ufficialmente",
  "datazione_non_ufficiale": "piramide artificiale > 25.000 anni (secondo Osmanagich)",
  "funzione_ufficiale": "sito naturale con resti archeologici medievali",
  "funzione_non_ufficiale": "antico complesso piramidale energetico",
  "popolazione_ufficiale_associata": "medievali bosniaci, possibili insediamenti precedenti",
  "popolazione_non_ufficiale_associata": "civiltà avanzata preistorica non identificata",
  "leggende_locali": [
    "storie orali sulle colline sacre di Visoko",
    "racconti moderni sulle piramidi bosniache e la loro energia"
  ],
  "riferimenti_ufficiali": [
    "articoli accademici e musei che negano la natura artificiale delle colline",
    "istituzioni come la Commission to Preserve National Monuments of Bosnia and Herzegovina"
  ],
  "riferimenti_non_ufficiali": [
    "libri e articoli di Sam Osmanagich",
    "fondazione 'Archaeological Park: Bosnian Pyramid of the Sun Foundation'"
  ],
  "link_approfondimento_ufficiale": [
    "URL a pagine di musei e articoli critici sulla teoria delle piramidi bosniache"
  ],
  "link_approfondimento_non_ufficiale": [
    "URL al sito ufficiale di Sam Osmanagich",
    "URL al sito della fondazione delle Piramidi Bosniache",
    "interviste e conferenze di Osmanagich"
  ],
  "note": "campo testo libero per sintetizzare il contrasto tra scienza ufficiale e interpretazione di Osmanagich"
}


Applica uno schema simile per:

Piramidi di Giza e principali piramidi egizie.

Piramidi mesoamericane (Teotihuacan, Cholula, La Danta, ecc.).

Piramidi cinesi, indonesiane (Gunung Padang), boliviane (Akapana), peruviane (Huaca del Sol), nordamericane (Monks Mound) e qualsiasi altra struttura che Osmanagich menzioni.

Importante: nel JSON tieni separati i campi “ufficiali” e “non ufficiali” (Osmanagich o altri ricercatori alternativi) in modo chiaro.

Pannello informazioni piramide

Quando l’utente clicca su un pin piramidale:

Apri a lato (o in un pannello modale) una scheda dettagli della piramide con:

Nome della piramide.

Foto placeholder o spazio per futura immagine.

Posizione (paese, regione, coordinate).

Tabelle ricapitolative con due colonne affiancate:

Tabella 1 – Dati fisici:

Altezza (m).

Base / dimensioni.

Area (mq).

Altitudine sul livello del mare.

Tipo di struttura (piramide a gradoni, tumulo, collina naturale, ecc.).

Tabella 2 – Interpretazioni:

Colonna A: “Scienza ufficiale”.

Colonna B: “Scienza alternativa / Osmanagich”.

Righe possibili: datazione, funzione, civiltà costruttrice, presenza di tunnel o camere, interpretazioni energetiche, ecc.

Sotto le tabelle mostra:

Leggende locali (lista di punti).

Link per approfondire (separati tra “fonti ufficiali” e “fonti non ufficiali”).

Eventuali citazioni brevi di Osmanagich (massimo 1–2 frasi, non violare copyright; parafrasa).

Filtri e ricerca

Implementa un pannello filtri sul lato sinistro o destro dello schermo.

Filtri richiesti:

Per grandezza

Range slider o selettore per:

Altezza minima / massima (m).

Area minima / massima (mq).

Filtrando per grandezza, il globo:

mantiene visibili solo le piramidi che rientrano nel range,

illumina in verde i pins che soddisfano i criteri.

Per datazione

Selettore per:

Epoca ufficiale (es. “< 2000 a.C.”, “2000 a.C. – 0”, “0 – 1500 d.C.”, “> 1500 d.C.”, “non datata ufficialmente”).

Epoca non ufficiale secondo Osmanagich (simile categorizzazione).

Possibilità di filtrare per:

Solo piramidi con datazione controversa (ufficiale diversa da non ufficiale).

Per geografia

Filtro per continente (Africa, Europa, Asia, Nord America, Sud America, Oceania, Antartide se necessario).

Campo di ricerca testuale per:

Paese,

Regione,

Nome sito.

Quando si filtra per continente:

Il continente viene evidenziato (ad esempio con una leggera luce verde sulla superficie),

Il globo ruota automaticamente fino a portare quel continente centrato di fronte all’utente.

Ricerca per area disegnata

Possibilità, anche in modo basico inizialmente, di disegnare un cerchio o rettangolo approssimativo sull’area visibile del globo (o selezionare un bounding box via coordinate).

Tutte le piramidi dentro quell’area vengono evidenziate in verde e listate in un elenco sotto i filtri.

Reset filtri

Pulsante chiaro “Reset filtri” che:

ripristina la visibilità di tutte le piramidi,

disattiva tutte le evidenziazioni,

riporta il globo alla rotazione e vista iniziali.

UI/UX richieste

Layout a schermo intero:

Globo 3D al centro (o leggermente a sinistra),

Pannello filtri e lista risultati a destra o sinistra,

Pannello dettagli piramide che si apre sovrapponendosi o affiancandosi.

Stile moderno, scuro (dark theme) con accenti verde/neon per gli elementi interattivi e i pins filtrati.

Le etichette principali (nomi continenti, oceani, mari, stati) dovrebbero essere visibili o comparire come overlay/label 2D sopra il globo.

Ridimensionamento responsivo per desktop; per mobile puoi semplificare (ma la priorità è desktop).

Struttura del codice e organizzazione

Organizza il codice in componenti React:

Globe3D per la scena 3D.

PyramidFilters per i filtri.

PyramidList per l’elenco delle piramidi filtrate.

PyramidDetails per il pannello dettagli.

Crea un pyramids.json nel progetto con la struttura dati completa o almeno un set iniziale di esempi reali, con particolare cura per:

complesso delle piramidi bosniache,

siti che Osmanagich cita spesso,

principali piramidi note nel mondo (Egitto, Mesoamerica, Cina, ecc.).

Prepara le funzioni di utilità per:

conversione lat/long → coordinate 3D sul globo,

calcolo/aggiornamento della terminatrice giorno/notte in base all’ora corrente,

filtraggio dell’array di piramidi in base ai parametri di UI.

Note finali

Obiettivo: permettere all’utente di esplorare visivamente il pianeta e, cliccando sulle piramidi, confrontare fianco a fianco:

interpretazione della “scienza ufficiale”,

interpretazione di Sam Osmanagich e di altre fonti non ufficiali.

L’interfaccia deve guidare l’utente a farsi una propria idea leggendo entrambe le versioni dei fatti in modo chiaro e ordinato.

Crea tutto il boilerplate necessario, inclusa una configurazione di base per far girare subito la web app in locale (comandi npm install e npm start o equivalenti).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0a340803-827c-4954-acfc-e85574ec7f1e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
