import { BrowserRouter, Route, Routes } from "react-router-dom";
import { I18nProvider } from "@/i18n/I18nContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = () => (
  <I18nProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/site/:siteId" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </I18nProvider>
);

export default App;
