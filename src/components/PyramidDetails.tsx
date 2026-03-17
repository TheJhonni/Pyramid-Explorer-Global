import { motion, AnimatePresence } from 'framer-motion';
import { Pyramid } from '@/types/pyramid';
import { X, MapPin, Mountain, Ruler, Star, ExternalLink, BookOpen, Lightbulb } from 'lucide-react';

interface PyramidDetailsProps {
  pyramid: Pyramid | null;
  onClose: () => void;
}

const PyramidDetails = ({ pyramid, onClose }: PyramidDetailsProps) => {
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
          {/* Header */}
          <header className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {pyramid.osmanagich_focus && (
                    <span className="px-2 py-0.5 bg-pyramid-gold/20 border border-pyramid-gold/30 rounded text-[9px] font-mono text-pyramid-gold uppercase tracking-wider">
                      Osmanagich
                    </span>
                  )}
                  {pyramid.controversa && (
                    <span className="px-2 py-0.5 bg-accent/20 border border-accent/30 rounded text-[9px] font-mono text-accent uppercase tracking-wider">
                      Controversa
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-2">{pyramid.nome}</h2>
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Physical data */}
            <section>
              <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
                <Mountain size={10} /> Dati fisici
              </h3>
              <div className="bg-secondary/30 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    <Row label="Tipo" value={pyramid.tipo} />
                    {pyramid.altezza_struttura_m > 0 && (
                      <Row label="Altezza" value={`${pyramid.altezza_struttura_m} m`} />
                    )}
                    {pyramid.base_m > 0 && (
                      <Row label="Base" value={`${pyramid.base_m} m`} />
                    )}
                    {pyramid.area_mq > 0 && (
                      <Row label="Area" value={`${pyramid.area_mq.toLocaleString()} m²`} />
                    )}
                    <Row label="Altitudine s.l.m." value={`${pyramid.altitudine_sul_livello_del_mare_m} m`} />
                  </tbody>
                </table>
              </div>
            </section>

            {/* Comparison table */}
            <section>
              <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
                <Ruler size={10} /> Interpretazioni a confronto
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Official */}
                <div className="bg-secondary/30 border border-border rounded-lg p-3 space-y-3">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono border-b border-border pb-1.5 flex items-center gap-1">
                    <BookOpen size={9} />
                    Scienza ufficiale
                  </div>
                  <ComparisonItem label="Datazione" value={pyramid.datazione_ufficiale} />
                  <ComparisonItem label="Funzione" value={pyramid.funzione_ufficiale} />
                  <ComparisonItem label="Civiltà" value={pyramid.popolazione_ufficiale_associata} />
                </div>

                {/* Alternative */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-3 shadow-[0_0_15px_-5px] shadow-primary/10">
                  <div className="text-[9px] uppercase tracking-wider text-primary font-mono border-b border-primary/20 pb-1.5 flex items-center gap-1">
                    <Lightbulb size={9} />
                    Scienza alternativa
                  </div>
                  <ComparisonItem label="Datazione" value={pyramid.datazione_non_ufficiale} accent />
                  <ComparisonItem label="Funzione" value={pyramid.funzione_non_ufficiale} accent />
                  <ComparisonItem label="Civiltà" value={pyramid.popolazione_non_ufficiale_associata} accent />
                </div>
              </div>
            </section>

            {/* Legends */}
            {pyramid.leggende_locali.length > 0 && (
              <section>
                <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
                  <Star size={10} /> Leggende locali
                </h3>
                <ul className="space-y-1.5">
                  {pyramid.leggende_locali.map((l, i) => (
                    <li key={i} className="text-xs text-foreground/80 pl-3 border-l-2 border-pyramid-gold/30">
                      {l}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Notes */}
            {pyramid.note && (
              <section>
                <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-2">Note</h3>
                <p className="text-xs text-foreground/70 leading-relaxed">{pyramid.note}</p>
              </section>
            )}

            {/* Links */}
            <section className="space-y-3">
              {pyramid.link_approfondimento_ufficiale.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1.5">Fonti ufficiali</h4>
                  {pyramid.link_approfondimento_ufficiale.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors truncate"
                    >
                      <ExternalLink size={10} /> {url}
                    </a>
                  ))}
                </div>
              )}
              {pyramid.link_approfondimento_non_ufficiale.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1.5">Fonti alternative</h4>
                  {pyramid.link_approfondimento_non_ufficiale.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors truncate"
                    >
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
    <div className={`text-[11px] mt-0.5 leading-snug ${accent ? 'text-primary/90' : 'text-foreground/80'}`}>
      {value}
    </div>
  </div>
);

export default PyramidDetails;
