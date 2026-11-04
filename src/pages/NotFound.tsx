import { useI18n } from "@/i18n/I18nContext";

const NotFound = () => {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t.notFound}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {t.backToGlobe}
        </a>
      </div>
    </main>
  );
};

export default NotFound;
