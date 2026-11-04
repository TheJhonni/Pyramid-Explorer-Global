# Audit del dataset

_4 novembre 2026. Dataset: `src/data/pyramids.json`, 57 voci._

## Metodo

- **Fonti:** Wikipedia in inglese (coordinate della pagina, infobox, testo) e Wikidata (P625 coordinate, P2048 altezza, P2049 larghezza, P571 data). Le ho scaricate dalle API pubbliche con uno script, non da un browser: in questa sessione non c'era un browser disponibile. Ogni riga sotto cita la pagina usata.
- **Coordinate:** ho calcolato la distanza tra il punto del dataset e quello della fonte. Sotto 0,3 km la considero corretta: sul globo non si vede differenza.
- **Correzioni:** ho cambiato un valore solo quando la fonte lo riporta in modo esplicito. Tutto il resto è segnalato qui e non l'ho toccato: niente valori stimati o dedotti.
- **Non verificato:** altitudini sul livello del mare (solo controlli a campione), leggende locali, volumi nelle note e il campo `osmanagich_focus`.

## 1. Correzioni applicate (con fonte)

### Coordinate

| id | prima | dopo | scarto | fonte |
|---|---|---|---|---|
| `la_danta` | 17.7556, -89.8167 | 17.7550, -89.9206 | **11 km** | [El Mirador](https://en.wikipedia.org/wiki/El_Mirador) (Q504904). Il nuovo punto è il centro di El Mirador. La Danta si trova circa 2 km più a est, ma non ho trovato una fonte aperta con le coordinate del singolo edificio: **da precisare**. |
| `tonga_langi` | -21.1467, -175.1553 | -21.1792, -175.1167 | 5,3 km | [Muʻa (Tongatapu)](https://en.wikipedia.org/wiki/Mu%CA%BBa_(Tongatapu)). La pagina [Langi](https://en.wikipedia.org/wiki/Langi) non ha coordinate: uso quelle del paese, dove si trovano i langi di Lapaha. Posizione indicativa. |
| `hellinikon` | 37.5483, 22.6789 | 37.5873, 22.6714 | 4,4 km | [Greek pyramids](https://en.wikipedia.org/wiki/Greek_pyramids) (Q493527), coordinate della piramide di Hellinikon, l'unica ancora in piedi. |
| `australia_gympie` | -26.1900, 152.6650 | -26.1690, 152.6930 | 3,6 km | [Gympie Pyramid](https://en.wikipedia.org/wiki/Gympie_Pyramid) (Q5625145) |
| `tenerife_guimar` | 28.3145, -16.3828 | 28.3208, -16.4136 | 3,1 km | [Pyramids of Güímar](https://en.wikipedia.org/wiki/Pyramids_of_G%C3%BC%C3%ADmar) (Q619588) |
| `yangling` | 34.4417, 108.9681 | 34.4438, 108.9407 | 2,5 km | [Yangling Mausoleum of Han](https://en.wikipedia.org/wiki/Yangling_Mausoleum_of_Han). Il link nel dataset (`Yangling_Mausoleum`) era rotto: corretto. |
| `tucume` | -6.5089, -79.8539 | -6.5158, -79.8442 | 1,3 km | [Túcume](https://en.wikipedia.org/wiki/T%C3%BAcume) (Q1677131) |
| `huaca_del_sol` | -8.1333, -78.9833 | -8.1322, -78.9947 | 1,3 km | [Huaca del Sol](https://en.wikipedia.org/wiki/Huaca_del_Sol) (Q1632711) |
| `bosnia_sun` | 43.9883, 18.1760 | 43.9769, 18.1761 | 1,3 km | [Bosnian pyramid claims](https://en.wikipedia.org/wiki/Bosnian_pyramid_claims) (Q746765): coordinate della collina Visočica, quella chiamata "Piramide del Sole". |
| `teotihuacan_moon` | 19.6953, -98.8447 | 19.6996, -98.8440 | 0,5 km | [Pyramid of the Moon](https://en.wikipedia.org/wiki/Pyramid_of_the_Moon) (Q29240). Prima il segnaposto cadeva sul Viale dei Morti. |

### Misure

| id | campo | prima | dopo | fonte |
|---|---|---|---|---|
| `cholula` | altezza / base / area | 66 m / 450 m / 202.500 m² | 25 m / 300 m / 94.500 m² | [Great Pyramid of Cholula](https://en.wikipedia.org/wiki/Great_Pyramid_of_Cholula): "a base of 300 by 315 metres and a height of 25 m". |
| `akapana` | altezza / base / area | 18 m / 200 m / 40.000 m² | 16,5 m / 257 m / 50.629 m² | [Akapana](https://en.wikipedia.org/wiki/Akapana): "257 m wide, 197 m broad at its maximum, and 16.5 m tall". |
| `candi_sukuh` | altezza | 11 m | 8,7 m | [Sukuh](https://en.wikipedia.org/wiki/Sukuh): "a height of 8.7 metres". |
| `giza_menkaure` | base / area | 108,5 m / 11.772 m² | 102,2 m / 10.690 m² | [Pyramid of Menkaure](https://en.wikipedia.org/wiki/Pyramid_of_Menkaure), infobox: 102,2 × 104,6 m. |
| `monte_daccodi` | base / area | 38 m / 1.444 m² | 36 m / 1.044 m² | [Monte d'Accoddi](https://en.wikipedia.org/wiki/Monte_d%27Accoddi): seconda fase 36 × 29 m, circa 10 m di altezza (altezza confermata). |

### Datazioni e note

| id | campo | prima | dopo | fonte |
|---|---|---|---|---|
| `gunung_padang` | datazione ufficiale | ~5000 a.C. (livelli superiori) | Ceramiche datate 45 a.C. – 22 d.C.; nessuna datazione accettata oltre 9.000 anni | [Gunung Padang](https://en.wikipedia.org/wiki/Gunung_Padang): ceramiche 45 BCE – 22 CE; lo studio del 2023 su *Archaeological Prospection* è stato ritrattato da Wiley a marzo 2024 (aggiunto anche nella nota). |
| `chichen_itza` | datazione ufficiale | ~600-900 d.C. | VIII-XII secolo d.C. | [El Castillo, Chichen Itza](https://en.wikipedia.org/wiki/El_Castillo,_Chichen_Itza), infobox. |
| `caral` | datazione ufficiale | ~3000 a.C. | ~2600-2000 a.C. | [Caral](https://en.wikipedia.org/wiki/Caral): "inhabited from around 2600 BC to 2000 BC". La cultura Caral nel suo insieme va dal 3000 al 1800 a.C. |
| `monks_mound` | datazione ufficiale | ~600-1400 d.C. | ~900-950 d.C. (inizio costruzione) | [Monks Mound](https://en.wikipedia.org/wiki/Monks_Mound), infobox. |
| `giza_khafre` | nota | — | aggiunto: 136,4 m è l'altezza attuale, in origine circa 143,5 m | [Pyramid of Khafre](https://en.wikipedia.org/wiki/Pyramid_of_Khafre), Wikidata Q208358. |
| `egypt_abu_rawash` | nota | — | aggiunto: 67 m è l'altezza originaria stimata, oggi ne restano circa 11 m | [Pyramid of Djedefre](https://en.wikipedia.org/wiki/Pyramid_of_Djedefre): 67 m originale, 11,4 m attuale. |

## 2. Verificati e corretti (nessuna modifica)

Coordinate entro 0,3 km dalla fonte e altezza o datazione coerenti con la fonte:

Grande Piramide di Giza (146,6 m originale, ~2560 a.C.), Chefren, Micerino (65 m originale), Djoser (62/62,5 m, ~2670 a.C.), Piramide Rossa (104/105 m), Romboidale, Piramide del Sole di Teotihuacan (65 m), Piramide della Luna (43 m, 100-450 d.C.), coordinate di Cholula e di Gunung Padang, Mausoleo di Qin Shi Huang (76 m, 246-208 a.C.), Monks Mound (30 m), Akapana (coordinate), Meroe, El Castillo (30 m con il tempio), Tempio I di Tikal (47 m, ~732 d.C.), Caral (28 m), Silbury Hill (39,3 m, base 167 m, ~2400 a.C.), Borobudur, Ziggurat di Ur (~30 m, 64 m, ~2100 a.C.), Etemenanki, Tempio delle Iscrizioni, Monte d'Accoddi (coordinate, 10 m), Brihadisvara (66 m, ~1010 d.C.), Uxmal (coordinate), Jebel Barkal, Abu Rawash, Meidum (65 m oggi, base 144 m), Cahuachi (1-500 d.C.), Yonaguni (coordinate), Cochasquí (0,6 km, accettabile), Mleiha (coincide con Wikidata), volume di La Danta (2,8 milioni di m³, dalla pagina di El Mirador).

## 3. Dati dubbi o senza fonte (non modificati)

### Voci senza nessuna fonte ufficiale (`link_approfondimento_ufficiale` vuoto)

`bosnia_love`, `bosnia_dragon`, `bosnia_earth`, `bosnia_ravne_tunnels`, `mauritius_underwater`, `indonesia_lalakon`, `canary_tenerife_step`, `russia_kola`, `crimea_underwater`, `azores_underwater`.

Coordinate, altezze, basi e datazioni di queste 10 voci non hanno una fonte verificabile. Per le strutture sottomarine (Mauritius, Crimea, Azzorre) il punto sul globo è di fatto simbolico.
**Proposta:** un badge "posizione e misure non verificate" nella scheda, oppure toglierle. Decidi tu.

### Misure presentate come fatti ma che sono tesi alternative

- **Colline bosniache** (`bosnia_sun` 220 m, `bosnia_moon` 190 m, `bosnia_love`, `bosnia_dragon`, `bosnia_earth`): sono misure di Osmanagich, non di rilievi indipendenti, eppure compaiono in "Dati fisici" come le altre. Wikipedia non riporta un'altezza della struttura, perché si tratta di colline naturali.
  **Proposta:** spostarle nella colonna alternativa o etichettarle "secondo Osmanagich".

### Doppioni

- `tenerife_guimar` e `tenerife_guanche` descrivono lo stesso sito (stessa pagina Wikipedia, Q619588), con misure diverse (12/30 m e 14/35 m). Prima i due segnaposti distavano 200 m ed erano entrambi circa 3 km fuori posto. Ho corretto le coordinate solo della prima, per non sovrapporli: la seconda resta 3,3 km fuori posto finché non si decide.
  **Proposta:** unirle in una sola voce.

### Identificazione incerta

- `xian_white_pyramid`: la voce rimanda alla pagina generica [Chinese pyramids](https://en.wikipedia.org/wiki/Chinese_pyramids), le cui coordinate (34.336, 108.570) sono quelle di Maoling, non le nostre (34.338, 108.934: circa 33 km di differenza). Le misure (60 m, base 300 m) non hanno fonte.
- `china_zangkunchong`: non ho trovato una fonte aperta per il nome, le coordinate o le misure. Il link è la stessa pagina generica.
- `cambodia_koh_ker`: Wikipedia e Wikidata danno coordinate diverse per il sito di Koh Ker (13.775 e 13.750 di latitudine). Il dataset (13.7833, 104.5333) è plausibile per Prasat Thom, ma non l'ho potuto confermare.
- `hellinikon`: base 14 m e altezza 9 m non hanno fonte. Wikipedia indica un edificio di 7,03 × 9,07 m con muri alti 3,5 m. Non ho cambiato i numeri perché manca un'altezza totale citabile.

### Fonti in disaccordo

- `mexico_uxmal`: 35 m nel dataset e su Wikidata, 40 m nell'infobox di Wikipedia. Lasciato 35.
- `teotihuacan_sun`: la stessa pagina Wikipedia segnala tre altezze diverse, tutte citate. Lasciato 65 m.

### Affermazioni nelle note non verificate

- Cholula, "volume di circa 4,45 milioni di m³".
- Huaca del Sol, "circa 130 milioni di mattoni" e la leggenda dei "250.000 uomini in tre giorni".
- Langi di Tonga, "blocchi fino a 40 tonnellate".
- Brihadisvara, "pietra sommitale di 80 tonnellate".
- Meroe, "il più grande numero di piramidi in un unico luogo".
- Tutte le **leggende locali** (`leggende_locali`): nessuna ha una fonte. Una è sicuramente attribuita male: la Ziggurat di Ur porta la leggenda "Torre di Babele nella tradizione biblica", che di solito si riferisce a Etemenanki (voce separata).

### Campo `osmanagich_focus`

31 voci hanno `osmanagich_focus: true` e diverse note dicono "Osmanagich lo include nella sua mappa…". Nessuna di queste affermazioni ha una fonte nel dataset (`riferimenti_non_ufficiali` è testo libero, senza link).
**Proposta:** citare il libro o la pagina per ogni voce, oppure rinominare il filtro in qualcosa di verificabile.

### Altitudini sul livello del mare

Non le ho verificate in modo sistematico: due controlli a campione corrispondono (Gunung Padang 885 m, Caral 350 m). Huaca del Sol a 30 m è da controllare.

### Foto

15 foto sono collegate direttamente da Wikimedia Commons (`src/data/pyramidImages.ts`) senza autore né licenza. Le licenze di Commons (CC BY-SA e simili) richiedono l'attribuzione.
**Proposta:** salvare per ogni foto autore, licenza e link alla pagina Commons, e mostrarli sotto l'immagine. È anche un buon segnale di cura per il portfolio.

## 4. Traduzioni

Nomi e descrizioni ora esistono in 6 lingue: l'italiano è la sorgente (`pyramids.json`) e le altre lingue stanno in `src/data/locales/{en,es,fr,de,pt}.json`. Ho usato i nomi in uso in ogni lingua (Khufu/Cheops, Chephren, Mykérinos, Zoser, Dahchour, Gizeh…), non traduzioni letterali.

Nella base italiana ho anche:
- sostituito "Come sopra" e "Come ufficiale" con "Come la versione ufficiale";
- aggiunto "(Bosnia)" a "Piramide del Sole" e "Piramide della Luna", per distinguerle da quelle di Teotihuacan.

I test (`src/test/locales.test.ts`) controllano che ogni lingua copra ogni voce e ogni campo.
