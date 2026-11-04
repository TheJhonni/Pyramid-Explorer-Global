import { useI18n, langNames, Lang } from '@/i18n/I18nContext';
import { Globe2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={langNames[lang]}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-all font-mono"
      >
        <Globe2 size={12} />
        {lang.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-xl overflow-hidden min-w-[140px]">
          {(Object.keys(langNames) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                l === lang
                  ? 'bg-primary/15 text-primary'
                  : 'text-foreground/70 hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <span className="font-mono mr-2">{l.toUpperCase()}</span>
              {langNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
