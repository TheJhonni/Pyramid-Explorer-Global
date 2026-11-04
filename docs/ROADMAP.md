# Roadmap

_4 novembre 2026. Da qui scegli cosa costruire: non è ancora stato costruito niente di questa lista._

Effort: **S** ≤ 1 giorno · **M** 2-3 giorni · **L** 4-6 giorni (una persona).
Impatto: quanto il punto rafforza il progetto come pezzo di portfolio su **3D, dati e cura del prodotto**.

## In sintesi

| # | Cosa | Priorità | Effort | Impatto | Dipende da |
|---|---|---|---|---|---|
| 0 | Modello dati v2 (anni numerici, civiltà, fonti per campo, "verificato") | P0 | M | Alto: rende possibili 3, 4, 5 e chiude l'audit | — |
| 1 | Condivisione via URL (stato nella query string) | P0 | S | Alto | — |
| 2 | Performance mobile (Lighthouse 63 → 85-95) | P0 | M | Alto | — |
| 3 | Schede con fonti | P1 | S | Alto: è il segno più visibile di cura dei dati | 0 |
| 4 | Filtri per civiltà ed epoca | P1 | S | Medio | 0 |
| 5 | Linea del tempo | P1 | M | Alto: dati + interazione | 0, 4 |
| 6 | Confronto scale tra piramidi | P1 | M | Alto: è il pezzo 3D più "da demo" | 1 |
| 7 | Pagine indicizzabili per ogni piramide | P2 | L | Medio-alto: SEO e link condivisibili | 1, 3 |
| 8 | Tour guidato | P2 | M | Medio | 1, 5 |

**Ordine consigliato:** 2 → 1 → 0 → 3 → 6 → 4 → 5 → 7 → 8.
La performance va per prima perché oggi è il numero che un recruiter vede se lancia PageSpeed. L'URL e il modello dati sono le fondamenta degli altri punti. Il confronto scale arriva presto perché è il pezzo che si ricorda.

Prima o insieme al punto 0, servono le tue decisioni sull'audit (`docs/DATASET_AUDIT.md`, sezione 3): voci senza fonte, doppione di Güímar, misure bosniache. Ognuna è piccola, ma serve il tuo sì.

---

## 0. Modello dati v2 — P0 · M · Alto

Oggi le datazioni sono testo libero ("~2560 a.C.", "VIII-XII secolo d.C.") e le fonti sono un elenco generico per voce. Timeline, filtro per epoca e schede con fonti non si possono costruire bene sopra questo.

- Campi nuovi: `anno_inizio` e `anno_fine` (interi, negativi = a.C.), presi dalla datazione ufficiale. Il testo resta per la visualizzazione.
- `civilta`: una chiave normalizzata (`egitto_antico`, `maya`, `moche`, …), con l'etichetta tradotta nelle 6 lingue.
- `fonti`: per ogni campo verificato, l'URL e la data di accesso. Per esempio `{ campo: "altezza_struttura_m", url, accesso: "2026-11-04" }`.
- `verificato`: `true`, `parziale` o `no`, calcolato dalle fonti presenti. Pilota un badge nella scheda.
- Lo script di audit (Wikipedia/Wikidata) entra nel repo come `scripts/audit-dataset.mjs` e gira in CI in modalità di sola segnalazione: avvisa se una coordinata si allontana più di 1 km dalla fonte.

## 1. Condivisione via URL — P0 · S · Alto

`?p=giza_great&lang=it&continent=Africa&h=50-500` riapre la stessa vista: globo, piramide selezionata, filtri e lingua. Il pulsante "Copia link" nella scheda usa la Web Share API sui telefoni.
Costa poco ed è la base di 6, 7 e 8. Senza questo, chi riceve un link vede sempre la home.

## 2. Performance mobile — P0 · M · Alto

### Dove siamo (misura di oggi)

Build locale, Lighthouse 12.6.1, profilo mobile (CPU 4× più lenta, rete 4G simulata), tre esecuzioni:

| Run | Performance | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| 1 | 63 | 2,2 s | 2,5 s | 8.620 ms | 0 |
| 2 | 55 | 2,9 s | 3,4 s | 4.470 ms | 0 |
| 3 | 71 | 2,2 s | 2,5 s | 1.150 ms | 0 |

Desktop, una esecuzione: 74 (TBT 660 ms). Accessibilità 95, best practices 96, SEO 100.

**La causa è una sola:** il blocco del main thread (TBT). Il chunk del globo (three.js + globe.gl, 543 kB gzip) genera circa 9,3 dei 9,5 secondi di lavoro JavaScript. FCP e LCP sono già accettabili: l'elemento LCP è il testo introduttivo, non il globo.

Attenzione a come leggere questi numeri: Lighthouse in headless disegna WebGL in software, cioè senza GPU, quindi il TBT di laboratorio è più alto di quello di un telefono vero. Il numero che conta per gli utenti va misurato sul campo (vedi il punto 2.5).

### Piano, in ordine di resa

1. **Globo a caricamento differito (facade)** — M, effetto stimato **+20-30 punti**.
   Al primo caricamento si mostra un'immagine statica del globo, con la stessa inquadratura e i segnaposti: un WebP di circa 60 kB, generato in build. Three.js parte solo al primo tocco o trascinamento, oppure quando il browser è inattivo (`requestIdleCallback`) dopo l'evento `load`. Lista e filtri funzionano subito, anche prima.
   Va detto chiaramente: così il costo si sposta, non sparisce. Chi tocca il globo aspetta comunque 1-2 secondi su un telefono di fascia media. È il pattern standard per i componenti pesanti, ma va presentato come tale.
2. **Font self-hosted** — S, circa **-0,3/-0,5 s di FCP**.
   Oggi il CSS di Google Fonts blocca il rendering per circa 450 ms. Basta servire in locale Inter e IBM Plex Mono, ridotti ai caratteri latini, con `preload` e un peso in meno.
3. **Bundle iniziale più leggero** — S, effetto da misurare.
   Il main chunk pesa 176 kB gzip. `App.tsx` monta React Query, due sistemi di toast e un TooltipProvider che la pagina non usa. Basta toglierli e caricare il pannello dettagli (framer-motion) solo alla prima selezione. Lighthouse stima 413 KiB di JavaScript inutilizzato al primo caricamento.
4. **Globo più leggero** — L, solo se dopo i passi 1-3 non basta.
   globe.gl porta con sé three-globe, d3 e altre librerie. Un globo scritto direttamente in three.js (sfera texturizzata, segnaposti instanziati, OrbitControls), con import mirati, dovrebbe stare tra 150 e 200 kB gzip contro gli attuali 543. Il rischio è dover rifare atmosfera, etichette e fly-to.
5. **Misura sul campo** — S.
   La preview è protetta da Vercel Auth, quindi PageSpeed Insights non la raggiunge. Le opzioni sono un link di bypass temporaneo per la misura, oppure aspettare il merge. Poi va attivato Vercel Speed Insights per avere i Core Web Vitals reali.

**Obiettivo realistico:** 85-95 su mobile in laboratorio con i passi 1-3; circa 70-75 senza la facade. Non prometto 100: il globo è il prodotto.

### Quick win non legati alla velocità

- Accessibilità 95 → 100: i 4 slider (altezza e area) non hanno etichetta (`aria-label` mancante). Costa pochi minuti.
- Best practices 96 → 100: circa il 21% del testo è sotto i 12 px (`text-[9px]`, `text-[10px]`). Va deciso col design: alzare a 11-12 px cambia la densità della sidebar.

## 3. Schede con fonti — P1 · S · Alto

Nella scheda, ogni valore ha accanto un rimando numerato `[1]` che porta alla fonte, con il dominio e la data di accesso. In fondo c'è l'elenco delle fonti e un badge di stato ("Verificato su Wikipedia/Wikidata" oppure "Dati non verificati").
Qui entrano anche le attribuzioni delle foto: autore e licenza Commons, oggi assenti.
Dipende dal punto 0, perché servono le fonti per campo.

## 4. Filtri per civiltà ed epoca — P1 · S · Medio

- Civiltà: chip multi-selezione, generati dal campo `civilta`.
- Epoca: slider doppio da -4000 a 1800, sugli anni numerici del punto 0, con scorciatoie ("Età del bronzo", "Mesoamerica classica"…).
- I filtri finiscono nell'URL (punto 1).

## 5. Linea del tempo — P1 · M · Alto

Una striscia in basso, sopra il globo, con l'asse degli anni in scala lineare a tratti: il periodo prima del 3000 a.C. è compresso. Ogni piramide è un segmento da `anno_inizio` ad `anno_fine`, colorato per civiltà. Trascinare una finestra sulla timeline filtra il globo, e passare sopra un segmento evidenzia il segnaposto.
Le datazioni ufficiali e quelle alternative stanno su due righe separate, così il confronto resta onesto: la riga alternativa è tratteggiata e attiva solo con il filtro "ricerca alternativa".
Su mobile diventa un cassetto a scomparsa.

## 6. Confronto scale tra piramidi — P1 · M · Alto

Si scelgono da 2 a 4 piramidi e compare una vista 3D affiancata in scala reale. È una scena three.js separata, dato che three è già nel bundle del globo.
- Profili semplificati, generati dai dati (altezza, base e tipo: liscia, a gradoni, tronca, tumulo), non modelli scaricati.
- Riferimenti di scala attivabili: una persona di 1,75 m, la Statua della Libertà (93 m), un campo da calcio.
- Tabella numerica sotto la vista: altezza, base, area e volume se c'è una fonte.
- Si condivide via URL (`?compare=giza_great,cholula,la_danta`).

È il punto che lega meglio 3D e dati, e Cholula (bassa ma enorme) contro Giza dà un buon effetto sorpresa.

## 7. Pagine indicizzabili per ogni piramide — P2 · L · Medio-alto

Oggi Google vede una sola pagina. L'idea è generare in build 57 × 6 = 342 pagine statiche, del tipo `/it/piramidi/grande-piramide-di-giza` o `/en/pyramids/great-pyramid-of-giza`, con:
- titolo, descrizione e Open Graph per pagina (con un'immagine OG generata per ogni piramide);
- `hreflang` tra le lingue, `sitemap.xml` e dati strutturati JSON-LD (`LandmarksOrHistoricalBuildings`, con `geo`);
- il contenuto della scheda in HTML, leggibile senza JavaScript; il globo si attiva sopra, centrato su quella piramide.

Lo slug va tradotto per lingua. Il prerender si fa con `react-dom/server` in uno script di build, senza cambiare framework: niente migrazione a Next.js.
Dipende dai punti 1 (routing) e 3 (fonti nella pagina).

## 8. Tour guidato — P2 · M · Medio

"Da Saqqara a Teotihuacan in 8 tappe": il globo vola da una piramide all'altra (il fly-to esiste già), con una didascalia breve per tappa e i controlli avanti, indietro e pausa. Rispetta `prefers-reduced-motion`, quindi niente voli automatici in quel caso.
Si possono fare 2-3 percorsi tematici: cronologico, "le più grandi", "mito contro fatti". Le didascalie vanno scritte nelle 6 lingue, ed è lì che sta la maggior parte del lavoro.
Ogni tappa ha il suo URL.

---

## Fuori da questa lista, da tenere presenti

- Il bundle cresce di circa 12 kB gzip per le traduzioni inglesi, incluse perché l'inglese è la lingua di default. Le altre lingue sono chunk separati da circa 9 kB, caricati solo quando vengono scelte.
- La lingua iniziale ora segue quella del browser. Con il punto 1 anche `?lang=` avrà la precedenza.
- L'immagine OG (`public/og.jpg`) mostra ancora i nomi in italiano con l'interfaccia in inglese: va rigenerata, ed è un'operazione da S.
