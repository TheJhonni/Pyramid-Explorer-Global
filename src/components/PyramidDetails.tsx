import { motion, AnimatePresence } from 'framer-motion';
import { Pyramid } from '@/types/pyramid';
import { X, MapPin, Mountain, Ruler, Star, ExternalLink, BookOpen, Lightbulb, BadgeCheck, CircleAlert, CircleHelp, Share2, Scale, Check, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import PyramidPhotoCarousel from './PyramidPhotoCarousel';

interface PyramidDetailsProps {
  pyramid: Pyramid | null;
  onClose: () => void;
  inCompare: boolean;
  onToggleCompare: (id: string) => void;
}

const FIELD_LABELS: Record<string, 'height' | 'base' | 'area' | 'altitude' | 'dating' | 'function_' | 'civilization' | 'type'> = {
  altezza_struttura_m: 'height',
  base_m: 'base',
  area_mq: 'area',
  altitudine_sul_livello_del_mare_m: 'altitude',
  datazione_ufficiale: 'dating',
  funzione_ufficiale: 'function_',
  popolazione_ufficiale_associata: 'civilization',
  tipo: 'type',
};

const PyramidDetails = ({ pyramid, onClose, inCompare, onToggleCompare }: PyramidDetailsProps) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pyramid) return;
    setCopied(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pyramid, onClose]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ title: pyramid?.nome, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
  };

  const sources = pyramid?.fonti?.length
    ? pyramid.fonti
    : (pyramid?.link_approfondimento_ufficiale ?? []).map((url) => ({ url, title: url.replace(/^https?:\/\/(www\.)?/, '') }));
  const status = pyramid?.stato_verifica ?? 'unverified';
  const StatusIcon = status === 'verified' ? BadgeCheck : status === 'partial' ? CircleAlert : CircleHelp;
  const statusLabel = status === 'verified' ? t.statusVerified : status === 'partial' ? t.statusPartial : t.statusUnverified;
  const statusHelp = status === 'verified' ? t.statusVerifiedHelp : status === 'partial' ? t.statusPartialHelp : t.statusUnverifiedHelp;
  const statusColor = status === 'verified' ? 'text-primary' : status === 'partial' ? 'text-pyramid-gold' : 'text-destructive';
  const missing = (pyramid?.campi_senza_fonte ?? []).map((f) => FIELD_LABELS[f]).filter(Boolean).map((k) => t[k]);
  const hasAlternative = !!pyramid && !!(pyramid.datazione_non_ufficiale || pyramid.funzione_non_ufficiale || pyramid.popolazione_non_ufficiale_associata);

  return (
    <AnimatePresence>
      {pyramid && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          role="complementary"
          aria-label={pyramid.nome}
          className="fixed right-0 top-0 h-full w-[480px] max-w-[92vw] bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl z-30 flex flex-col"
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
                aria-label={t.close}
                className="p-1.5 rounded-md hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground font-mono">
              <MapPin size={11} />
              {pyramid.paese}, {pyramid.regione} · {pyramid.coordinate.lat.toFixed(4)}°, {pyramid.coordinate.lon.toFixed(4)}°
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button type="button" onClick={share} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-secondary/40 hover:bg-secondary text-[11px]">
                {copied ? <Check size={11} /> : <Share2 size={11} />} {copied ? t.linkCopied : t.share}
              </button>
              {pyramid.altezza_struttura_m > 0 && (
                <button type="button" aria-pressed={inCompare} onClick={() => onToggleCompare(pyramid.id)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] ${inCompare ? 'border-primary/40 bg-primary/15 text-primary' : 'border-border bg-secondary/40 hover:bg-secondary'}`}>
                  <Scale size={11} /> {inCompare ? t.inCompare : t.addToCompare}
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <section className="rounded-lg border border-border bg-secondary/20 p-3">
              <p className={`flex items-center gap-1.5 text-xs font-medium ${statusColor}`}>
                <StatusIcon size={13} /> {statusLabel}
              </p>
              <p className="text-[11px] text-foreground/70 leading-relaxed mt-1">{statusHelp}</p>
              {missing.length > 0 && (
                <p className="text-[11px] text-muted-foreground mt-1">{t.noSourceFields} {missing.join(', ')}</p>
              )}
            </section>

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
                    {pyramid.area_mq > 0 && !pyramid.campi_senza_fonte?.includes('area_mq') && (
                      <Row label={t.area} value={`${pyramid.area_mq.toLocaleString()} m²`} />
                    )}
                    {!pyramid.campi_senza_fonte?.includes('altitudine_sul_livello_del_mare_m') && pyramid.altitudine_sul_livello_del_mare_m !== 0 && (
                      <Row label={t.altitude} value={`${pyramid.altitudine_sul_livello_del_mare_m} m`} />
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Comparison table */}
            <section>
              <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
                <Ruler size={10} /> {t.comparativeInterpretations}
              </h3>
              <div className="bg-secondary/30 border border-border rounded-lg p-3 space-y-3">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono border-b border-border pb-1.5 flex items-center gap-1">
                  <BookOpen size={9} />
                  {t.officialScience}
                </div>
                <ComparisonItem label={t.dating} value={pyramid.datazione_ufficiale} />
                <ComparisonItem label={t.function_} value={pyramid.funzione_ufficiale} />
                <ComparisonItem label={t.civilization} value={pyramid.popolazione_ufficiale_associata} />
              </div>
              {hasAlternative && (
                <details key={pyramid.id} className="group mt-2 bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-2 text-[9px] uppercase tracking-wider text-primary font-mono">
                    <span className="flex items-center gap-1"><Lightbulb size={9} /> {t.alternativeScience}</span>
                    <ChevronDown size={12} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-[11px] text-foreground/70 mt-2">{t.altWarning}</p>
                  <div className="space-y-3 mt-3">
                    <ComparisonItem label={t.dating} value={pyramid.datazione_non_ufficiale} accent />
                    <ComparisonItem label={t.function_} value={pyramid.funzione_non_ufficiale} accent />
                    <ComparisonItem label={t.civilization} value={pyramid.popolazione_non_ufficiale_associata} accent />
                  </div>
                </details>
              )}
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
              {sources.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1.5">{t.officialSources}</h4>
                  {sources.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-foreground/70 hover:text-primary transition-colors py-0.5">
                      <ExternalLink size={10} className="shrink-0" /> <span className="truncate">{source.title}</span>
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

const ComparisonItem = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => !value ? null : (
  <div>
    <div className="text-[9px] text-muted-foreground font-mono uppercase">{label}</div>
    <div className={`text-[11px] mt-0.5 leading-snug ${accent ? 'text-primary/90' : 'text-foreground/80'}`}>{value}</div>
  </div>
);

export default PyramidDetails;
