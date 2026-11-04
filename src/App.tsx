import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobePoster from "@/components/GlobePoster";
import { I18nProvider } from "@/i18n/I18nContext";

const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const App = () => (
  <I18nProvider>
    <BrowserRouter>
      <Suspense fallback={<div className="globe-stage"><GlobePoster /></div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/site/:siteId" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </I18nProvider>
);

export default App;
