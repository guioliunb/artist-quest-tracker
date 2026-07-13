import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import { useProject, useBasePath } from '@/contexts/ProjectContext';
import { CAREER_PHASE_LABELS } from '@/types';

const SECTION_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard de',
  '/milestones': 'Milestones de',
  '/indicadores': 'Indicadores de',
  '/agenda': 'Agenda de',
};

export function ActiveProjectContextBar() {
  const location = useLocation();
  const { activeProject, activeArtist } = useProject();
  const basePath = useBasePath();
  const sectionPath = basePath && location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length) || '/'
    : location.pathname;
  const sectionLabel = SECTION_LABELS[sectionPath];

  if (!sectionLabel) return null;

  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-accent/40 backdrop-blur px-6 lg:px-10 py-2.5">
      <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
        <span className="font-display font-bold text-xs text-primary">{activeArtist.name.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex items-baseline gap-1.5 text-xs">
        <span className="text-muted-foreground shrink-0">{sectionLabel}</span>
        <span className="font-medium text-foreground truncate">{activeArtist.name}</span>
        <span className="text-muted-foreground shrink-0">·</span>
        <span className="text-muted-foreground truncate">{activeProject.name}</span>
        <span className="hidden sm:inline text-muted-foreground shrink-0">·</span>
        <span className="hidden sm:inline text-muted-foreground truncate">{CAREER_PHASE_LABELS[activeProject.careerPhase]}</span>
      </div>
      <Link
        to={`${basePath}/projetos`}
        className="link-editorial ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0 transition-colors"
      >
        <ArrowLeftRight className="w-3 h-3" /> Trocar cliente
      </Link>
    </div>
  );
}
