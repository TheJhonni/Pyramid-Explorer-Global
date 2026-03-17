import { motion, AnimatePresence } from 'framer-motion';
import { Pyramid } from '@/types/pyramid';
import { X, MapPin, Mountain, Ruler, Star, ExternalLink, BookOpen, Lightbulb } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import PyramidPhotoCarousel from './PyramidPhotoCarousel';

interface PyramidDetailsProps {
  pyramid: Pyramid | null;
  onClose: () => void;
}

const PyramidDetails = ({ pyramid, onClose }: PyramidDetailsProps) => {
  const { t } = useI18n();

  return (
    <AnimatePresence>
      {pyramid && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-[480px] max-w-[90vw] bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl z-30 flex flex-col"
        >
          {/* Header - no badges */}
          <header className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{pyramid.nome}</h2>
                {pyramid.nome_locale !== pyramid.nome && (
                  <p className="text-xs text-muted-foreground italic">{pyramid.nome_locale}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground font-mono">
              <MapPin size={11} />
              {pyramid.paese}, {pyramid.regione} · {pyramid.coordinate.lat.toFixed(4)}°, {pyramid.coordinate.lon.toFixed(4)}°
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Physical data */}
            <section>
              <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
                <Mountain size={10} /> {t.physicalData}
              </h3>
              <div className="bg-secondary/30 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    <Row label={t.type} value={pyramid.tipo} />
                    {pyramid.altezza_struttura_m > 0 && (
                      <Row label={t.height} value={`${pyramid.altezza_struttura_m} m`} />
                    )}
                    {pyramid.base_m > 0 && (
                      <Row label={t.base} value={`${pyramid.base_m} m`} />
                    )}
                    {pyramid.area_mq > 0 && (
                      <Row label={t.area} value={`${pyramid.area_mq.toLocaleString()} m²`} />
                    )}
                    <Row label={t.altitude} value={`${pyramid.altitudine_sul_livello_del_mare_m} m`} />
                  </tbody>
                </table>
              </div>
            </section>

            {/* Comparison table */}
            <section>
              <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
                <Ruler size={10} /> {t.comparativeInterpretations}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/30 border border-border rounded-lg p-3 space-y-3">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono border-b border-border pb-1.5 flex items-center gap-1">
                    <BookOpen size={9} />
                    {t.officialScience}
                  </div>
                  <ComparisonItem label={t.dating} value={pyramid.datazione_ufficiale} />
                  <ComparisonItem label={t.function_} value={pyramid.funzione_ufficiale} />
                  <ComparisonItem label={t.civilization} value={pyramid.popolazione_ufficiale_associata} />
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-3 shadow-[0_0_15px_-5px] shadow-primary/10">
                  <div className="text-[9px] uppercase tracking-wider text-primary font-mono border-b border-primary/20 pb-1.5 flex items-center gap-1">
                    <Lightbulb size={9} />
                    {t.alternativeScience}
                  </div>
                  <ComparisonItem label={t.dating} value={pyramid.datazione_non_ufficiale} accent />
                  <ComparisonItem label={t.function_} value={pyramid.funzione_non_ufficiale} accent />
                  <ComparisonItem label={t.civilization} value={pyramid.popolazione_non_ufficiale_associata} accent />
                </div>
              </div>
            </section>

            {/* Photo carousel */}
            {(pyramid.immagini?.length || pyramid.google_images_url) && (
              <PyramidPhotoCarousel
                images={pyramid.immagini || []}
                googleUrl={pyramid.google_images_url}
                name={pyramid.nome}
              />
            )}

            {/* Always show search link even without images */}
            {!pyramid.immagini?.length && !pyramid.google_images_url && (
              <PyramidPhotoCarousel
                images={[]}
                googleUrl={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(pyramid.nome + ' pyramid')}`}
                name={pyramid.nome}
              />
            )}

            {pyramid.leggende_locali.length > 0 && (
              <section>
                <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
                  <Star size={10} /> {t.localLegends}
                </h3>
                <ul className="space-y-1.5">
                  {pyramid.leggende_locali.map((l, i) => (
                    <li key={i} className="text-xs text-foreground/80 pl-3 border-l-2 border-pyramid-gold/30">{l}</li>
                  ))}
                </ul>
              </section>
            )}

            {pyramid.note && (
              <section>
                <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-2">{t.notes}</h3>
                <p className="text-xs text-foreground/70 leading-relaxed">{pyramid.note}</p>
              </section>
            )}

            <section className="space-y-3">
              {pyramid.link_approfondimento_ufficiale.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1.5">{t.officialSources}</h4>
                  {pyramid.link_approfondimento_ufficiale.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors truncate">
                      <ExternalLink size={10} /> {url}
                    </a>
                  ))}
                </div>
              )}
              {pyramid.link_approfondimento_non_ufficiale.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1.5">{t.alternativeSources}</h4>
                  {pyramid.link_approfondimento_non_ufficiale.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors truncate">
                      <ExternalLink size={10} /> {url}
                    </a>
                  ))}
                </div>
              )}
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <tr className="border-b border-border/50 last:border-0">
    <td className="px-3 py-2 text-muted-foreground font-mono">{label}</td>
    <td className="px-3 py-2 text-foreground text-right">{value}</td>
  </tr>
);

const ComparisonItem = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div>
    <div className="text-[9px] text-muted-foreground font-mono uppercase">{label}</div>
    <div className={`text-[11px] mt-0.5 leading-snug ${accent ? 'text-primary/90' : 'text-foreground/80'}`}>{value}</div>
  </div>
);

export default PyramidDetails;
