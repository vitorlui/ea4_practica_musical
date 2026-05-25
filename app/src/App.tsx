import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LayoutProvider, Header, Sidebar } from "./components/layout";
import { StubPage } from "./pages/StubPage";

// Lazy-loaded real pages (will be replaced as tasks complete)
const HomePage = React.lazy(() => import("./pages/HomePage").catch(() => ({ default: () => <StubPage title="Inicio" description="Página de inicio" /> })));
const SyncopationPage = React.lazy(() => import("./pages/SyncopationPage").catch(() => ({ default: () => <StubPage title="1. Síncopas" description="Próximamente" /> })));
const IntervalsPage = React.lazy(() => import("./pages/IntervalsPage").catch(() => ({ default: () => <StubPage title="4. Intervalos" description="Próximamente" /> })));
const ScalesPage = React.lazy(() => import("./pages/ScalesPage").catch(() => ({ default: () => <StubPage title="6. Escalas" description="Próximamente" /> })));
const KeySignaturesPage = React.lazy(() => import("./pages/KeySignaturesPage").catch(() => ({ default: () => <StubPage title="7. Armadura" description="Próximamente" /> })));
const ExamPage = React.lazy(() => import("./pages/ExamPage").catch(() => ({ default: () => <StubPage title="Examen aleatorio" description="Próximamente" /> })));
const TheoryPage = React.lazy(() => import("./pages/TheoryPage").catch(() => ({ default: () => <StubPage title="Teoría" description="Próximamente" /> })));
const TransportePage = React.lazy(() => import("./pages/TransportePage").catch(() => ({ default: () => <StubPage title="2. Transporte" description="Error cargando" /> })));
const CompasTonalidadPage = React.lazy(() => import("./pages/CompasTonalidadPage").catch(() => ({ default: () => <StubPage title="3. Compás/Tonalidad" description="Error cargando" /> })));
const CompletarCompasPage = React.lazy(() => import("./pages/CompletarCompasPage").catch(() => ({ default: () => <StubPage title="5. Completar compás" description="Error cargando" /> })));
const NotasExtranyasPage = React.lazy(() => import("./pages/NotasExtranyasPage").catch(() => ({ default: () => <StubPage title="8. Notas extrañas" description="Error cargando" /> })));

function App() {
  return (
    <HashRouter>
      <LayoutProvider>
        <Header />
        <Sidebar />
        <React.Suspense fallback={<div className="pt-20 text-center text-gray-400">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sincopas" element={<SyncopationPage />} />
            <Route path="/transporte" element={<TransportePage />} />
            <Route path="/compas-tonalidad" element={<CompasTonalidadPage />} />
            <Route path="/intervalos" element={<IntervalsPage />} />
            <Route path="/completar-compas" element={<CompletarCompasPage />} />
            <Route path="/escalas" element={<ScalesPage />} />
            <Route path="/armadura" element={<KeySignaturesPage />} />
            <Route path="/notas-extranyas" element={<NotasExtranyasPage />} />
            <Route path="/examen" element={<ExamPage />} />
            <Route path="/teoria" element={<TheoryPage />} />
            <Route path="*" element={<StubPage title="404" description="Página no encontrada" />} />
          </Routes>
        </React.Suspense>
      </LayoutProvider>
    </HashRouter>
  );
}

export default App;
