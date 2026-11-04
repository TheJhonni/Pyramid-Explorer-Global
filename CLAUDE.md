# CLAUDE.md — Pyramid Explorer

Progetto portfolio di Davide J. Spiga (GitHub TheJhonni). È il pezzo che deve mostrare meglio 3D, dati e cura del prodotto. Lavoro e risposte in italiano, concise, con condizioni di stop chiare.

## Regole

- **Nessun merge, deploy in produzione, force push o cambio di visibilità del repo** senza un ok esplicito di Davide per quella singola azione. Si lavora su branch + preview Vercel (le preview si creano da sole a ogni push).
- Branch di lavoro: `improve/portfolio-ready`, PR #1 (bozza). `main` = produzione su Vercel.
- Lavora solo su questo repo. Non toccare il sito portfolio (`the-algorithm-guy`, `mio portfolio`) né altri repo. Se cambiano il nome o l'URL della demo, avvisa Davide: il sito portfolio la linka da /developer.
- Niente dati, numeri o fonti inventati. I dati del dataset si cambiano solo con una fonte aperta e citata, e ogni correzione va registrata in `docs/DATASET_AUDIT.md`. Il resto si segnala, non si corregge.
- Dichiara solo quello che hai eseguito davvero (test, misure, verifiche nel browser).
- Riservatezza: non citare fondi, incentivi o il repo fvg-plus, e non collegare il progetto a nomi d'arte o attività musicali.
- Nessun segreto nel repo: l'app è statica, senza backend né variabili d'ambiente.

## Nome

Il nome visibile è **Pyramid Explorer**: "Aetherius Project" è stato eliminato. Il repo e il dominio Vercel restano `pyramid-explorer-global`.

## Stack e comandi

React 18 + TypeScript + Vite 7 + Tailwind + shadcn/ui, three.js via react-globe.gl, Vitest + Testing Library.

```bash
# Node >= 20 (Vite 7). Con nvm: ~/.nvm/versions/node/v24.22.0/bin
npm install --package-lock=false   # il lockfile del repo è bun.lock: non committare package-lock.json
npx tsc -p tsconfig.app.json --noEmit
npx vitest run
npx eslint .                       # 0 errori; i warning react-refresh nei file shadcn/i18n sono noti
npx vite build
npx vite preview --port 4391 --strictPort   # la 4173 può essere occupata da un'altra preview su questa macchina
```

## Dati e lingue

- `src/data/pyramids.json`: 57 voci, testo **in italiano** (sorgente). Numeri, coordinate, flag e link stanno solo qui.
- `src/data/locales/{en,es,fr,de,pt}.json`: un overlay per lingua, con chiave l'id. Contiene solo i campi testuali (`LOCALIZED_FIELDS` in `src/i18n/pyramidLocale.ts`).
  L'inglese è nel bundle principale; le altre lingue sono chunk caricati alla prima selezione.
- Se aggiungi o modifichi una voce, aggiorna **tutte e 6 le lingue**: `src/test/locales.test.ts` fallisce se manca un id o un campo.
- Traduzioni: nomi in uso in ciascuna lingua, niente calchi dall'italiano.
- Etichette dell'interfaccia: `src/i18n/I18nContext.tsx`. La lingua iniziale segue quella del browser e `<html lang>` si aggiorna.
- La selezione in `Index.tsx` è per id, così la scheda segue il cambio lingua.

## Documenti

- `docs/DATASET_AUDIT.md`: verifica di coordinate, misure e datazioni (Wikipedia/Wikidata), con le correzioni fatte e i dati dubbi ancora aperti.
- `docs/ROADMAP.md`: funzioni proposte con priorità, effort e impatto, più il piano per Lighthouse mobile.
  Davide sceglie da lì cosa costruire: **non costruire funzioni della roadmap senza la sua scelta.**

## Stato (4 nov 2026)

- Fatti: rinomina, traduzione del dataset in 6 lingue, audit, roadmap.
- Lighthouse locale, mobile: 55-71 (mediana 63). Il TBT è dominato dal chunk del globo. Desktop: 74.
- Decisioni aperte (audit, sezione 3): voci senza fonte, doppione di Güímar, misure bosniache, attribuzione delle foto Commons.
