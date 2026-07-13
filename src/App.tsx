import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ProjectProvider } from "@/contexts/ProjectContext";
import {
  demoArtist,
  demoProject,
  demoMilestones,
  demoQuarterlyReview,
  demoDemandMetrics,
  demoCareerPhaseHistory,
  demoCalendarEvents,
  demoFinanceEntries,
  demoBudgetLines,
  demoSpotifyProfile,
  demoIndustryContacts,
} from "@/data/demoData";
import demoSocialMetricsRaw from "@/data/social-metrics-demo.json";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MilestonesPage from "./pages/MilestonesPage";
import AgendaPage from "./pages/AgendaPage";
import IndicadoresPage from "./pages/IndicadoresPage";
import ProjetosPage from "./pages/ProjetosPage";
import CadastroArtisticoPage from "./pages/CadastroArtisticoPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function StandardProviderLayout() {
  return (
    <ProjectProvider>
      <Outlet />
    </ProjectProvider>
  );
}

function DemoProviderLayout() {
  return (
    <ProjectProvider
      initialProjects={[{ project: demoProject, artist: demoArtist }]}
      initialMilestones={demoMilestones}
      initialQuarterlyReview={demoQuarterlyReview}
      initialDemandMetrics={demoDemandMetrics}
      initialCareerPhaseHistory={demoCareerPhaseHistory}
      initialCalendarEvents={demoCalendarEvents}
      initialFinanceEntries={demoFinanceEntries}
      initialBudgetLines={demoBudgetLines}
      initialSpotifyProfiles={[demoSpotifyProfile]}
      initialIndustryContacts={demoIndustryContacts}
      socialMetricsRaw={demoSocialMetricsRaw}
      isDemo
    >
      <Outlet />
    </ProjectProvider>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<StandardProviderLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projetos" element={<ProjetosPage />} />
              <Route path="/milestones" element={<MilestonesPage />} />
              <Route path="/indicadores" element={<IndicadoresPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/cadastro-artistico" element={<CadastroArtisticoPage />} />
            </Route>

            <Route element={<DemoProviderLayout />}>
              <Route path="/demo" element={<Navigate to="/demo/dashboard" replace />} />
              <Route path="/demo/dashboard" element={<Dashboard />} />
              <Route path="/demo/projetos" element={<ProjetosPage />} />
              <Route path="/demo/milestones" element={<MilestonesPage />} />
              <Route path="/demo/indicadores" element={<IndicadoresPage />} />
              <Route path="/demo/agenda" element={<AgendaPage />} />
              <Route path="/demo/cadastro-artistico" element={<CadastroArtisticoPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
