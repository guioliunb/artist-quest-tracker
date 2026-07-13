import { AppLayout } from '@/components/AppLayout';
import { useProject, useBasePath } from '@/contexts/ProjectContext';
import { CAREER_PHASE_LABELS, PROJECT_TYPE_LABELS } from '@/types';
import { ProgressBar } from '@/components/ProgressBar';
import { EmptyState } from '@/components/EmptyState';
import { Plus, CheckCircle2, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buildWhatsAppLink } from '@/lib/helpers';

export default function ProjetosPage() {
  const { projects, activeProjectId, setActiveProjectId } = useProject();
  const basePath = useBasePath();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setActiveProjectId(id);
    toast.success('Projeto ativo atualizado');
    navigate(`${basePath}/dashboard`);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-foreground">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Clientes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selecione um cliente para abrir o painel exclusivo dele — Dashboard, Milestones, Indicadores e Agenda passam a refletir apenas os dados dele.
            </p>
          </div>
          <button
            onClick={() => navigate(`${basePath}/cadastro-artistico`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Novo Projeto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-card rounded-lg border border-border">
            <EmptyState
              illustration="projetos"
              title="Nenhum cliente cadastrado"
              description="Cadastre o primeiro cliente para começar a acompanhar a carreira dele — DNA artístico, marcos, indicadores e agenda."
              action={{ label: 'Novo Projeto', onClick: () => navigate(`${basePath}/cadastro-artistico`) }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map(({ project, artist }) => {
              const isActive = project.id === activeProjectId;
              return (
                <div
                  key={project.id}
                  className={cn(
                    'bg-card rounded-xl border p-5 transition-all cursor-pointer group flex flex-col',
                    isActive ? 'border-primary/60 ring-1 ring-primary/20' : 'border-border hover:border-muted-foreground/40 hover:-translate-y-0.5',
                  )}
                  onClick={() => handleSelect(project.id)}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-base',
                        isActive ? 'bg-primary/20 text-primary' : 'bg-accent text-foreground',
                      )}
                    >
                      {artist.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="link-editorial font-display font-semibold text-sm text-foreground truncate">{artist.name}</h3>
                        {isActive && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary shrink-0">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{artist.genre || 'Gênero não definido'}</p>
                    </div>
                    {artist.whatsapp && (
                      <a
                        href={buildWhatsAppLink(artist.whatsapp, `Olá ${artist.name}, tudo bem?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Contatar via WhatsApp"
                        className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-status-completed hover:bg-status-completed/10 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{project.name}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1">
                      <ProgressBar value={project.overallProgress} size="sm" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-9 text-right">{project.overallProgress}%</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">{PROJECT_TYPE_LABELS[project.projectType]}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground">Q{project.currentQuarter} {project.currentYear}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground">{project.stage}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground">{CAREER_PHASE_LABELS[project.careerPhase]}</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    {project.overallProgress >= 100 ? (
                      <span className="flex items-center gap-1 text-xs text-status-completed"><CheckCircle2 className="w-3.5 h-3.5" /> Finalizado</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5" /> Em andamento</span>
                    )}
                    <span className="flex items-center gap-1 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      Abrir painel <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
