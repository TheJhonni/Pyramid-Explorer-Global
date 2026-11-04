# Foto e vista immersiva: proposta

Stato: galleria in produzione; vista 360° in prova su 5 schede (3 immagini), vedi sotto. Obiettivo: dalla scheda di una piramide, entrare in una vista che dia l'impressione di essere sul posto.

## Esperienza proposta
1. Volo della camera dal globo fino al sito.
2. Vista a 360° a tutto schermo, se esiste un panorama del sito con licenza utilizzabile.
3. Galleria di foto a tutto schermo, con autore e licenza visibili su ogni immagine.
4. Punti cliccabili sul panorama solo dove abbiamo un dato con fonte da mostrare.

Non tutti i siti avranno un panorama. Il fallback onesto è galleria, poi solo mappa. La copertura va misurata prima di promettere l'esperienza su tutti i siti.

## Fonti di immagini
| Fonte | Cosa dà | Condizioni | Uso |
|---|---|---|---|
| Wikimedia Commons | Foto, alcuni panorami 360° | Licenza per file; autore e licenza dai metadati del file | Fonte principale della galleria |
| Mapillary | Immagini a livello strada, anche panoramiche | CC BY-SA con attribuzione nel formato indicato; per l'uso commerciale la pagina rimanda al loro supporto | Panorami open, se la copertura basta |
| Google Street View (Maps Embed API) | La copertura probabilmente migliore, in iframe | Serve una chiave API; da verificare che la modalità Street View rientri nell'uso gratuito | Alternativa se le fonti aperte non bastano |

Da evitare: foto prese da Google Immagini o siti di viaggio, salvo licenza esplicita. Il pulsante "cerca su Google" resta solo come link esterno.

## Tecnica
- Visore: Pannellum (licenza MIT, circa 21 kB gzip), caricato solo all'apertura della vista. La sua pagina npm non dichiara supporto ufficiale per il mobile: va provato su telefono prima di adottarlo. Alternativa: una sfera three.js, dato che three è già nell'app.
- Metadati in un file separato per sito: URL, autore, licenza, link al file, tipo (foto o panorama). Uno script li genera dalle API di Commons e Mapillary, così nulla è scritto a mano.
- Pagina della licenza con l'elenco dei crediti.

## Problema già presente
Le foto attuali sono collegate direttamente da Wikimedia senza autore né licenza. Questa revisione aggiunge il link alla pagina del file su Commons, ma non basta per le licenze che chiedono l'attribuzione: la fase foto deve mostrare autore e licenza.

## Fasi
1. Script di raccolta su Commons e report di copertura per sito.
2. Galleria a tutto schermo con crediti.
3. Prova su 5 siti (Giza, Teotihuacan, Chichén Itzá, Borobudur, Meroe) della vista 360°, su desktop e telefono.
4. Decisione su Street View e, se serve, chiave API (azione tua).

## Prova 360° (novembre 2026)
Visore: sfera o cilindro in three.js, caricato solo all'apertura, invece di Pannellum. Controllati a occhio:

| File Commons | Tipo | Licenza | Schede |
|---|---|---|---|
| Teotihuacan Mexico 20251126 panorama 360.jpg | Sfera completa | CC0 | Pyramid of the Moon |
| Giza pyramid complex - 360.jpg | Fascia a 360° | CC BY-SA 3.0 | Khufu, Khafre, Menkaure |
| 360° Panorama Tula seen from Pyramid B.jpg | Fascia a 360° | CC BY-SA 3.0 | Pyramid B |

Copertura misurata su Commons: ricerca per template Pano360, per testo e per coordinate entro 1,5 km su circa 40 siti principali. Per Chichén Itzá, Borobudur e Meroe non ho trovato panorami. Scartati: Teotihuacan-360degree-Panorama.jpg (solo 1920×249) e le immagini Mapillary caricate su Commons, non controllate. La ricerca non è esaustiva: un file senza template, parole chiave o coordinate può sfuggire.

## Decisioni da prendere
- Se usare Google Street View: migliora la copertura, ma aggiunge una chiave e una dipendenza. Prima misurerei le fonti aperte.

Fonti: [Mapillary, licenze](https://help.mapillary.com/hc/en-us/articles/115001770409-Licenses), [Maps Embed API, uso e costi](https://developers.google.com/maps/documentation/embed/usage-and-billing), [Pannellum su npm](https://npmjs.com/package/pannellum).
