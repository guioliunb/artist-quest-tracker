import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectProvider } from "@/contexts/ProjectContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MilestonesPage from "./pages/MilestonesPage";
import RoadmapPage from "./pages/RoadmapPage";
import AvaliacaoPage from "./pages/AvaliacaoPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import IndicadoresPage from "./pages/IndicadoresPage";
import ProjetosPage from "./pages/ProjetosPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projetos" element={<ProjetosPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/indicadores" element={<IndicadoresPage />} />
            <Route path="/avaliacao" element={<AvaliacaoPage />} />
            <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProjectProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
