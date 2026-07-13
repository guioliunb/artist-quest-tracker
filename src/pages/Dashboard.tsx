import { AppLayout } from '@/components/AppLayout';
import { ProgressBar } from '@/components/ProgressBar';
import { ProgressRing } from '@/components/ProgressRing';
import { ArtistCoverHeader } from '@/components/ArtistCoverHeader';
import { CareerTimeline } from '@/components/CareerTimeline';
import { SectionDivider } from '@/components/SectionDivider';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { PillarTag } from '@/components/PillarTag';
import { EPKExportDialog } from '@/components/epk/EPKExportDialog';
import { FinanceTab } from '@/components/finance/FinanceTab';
import { SpotifyTab } from '@/components/spotify/SpotifyTab';
import { ContactsTab } from '@/components/contacts/ContactsTab';
import { CareerWrapped } from '@/components/wrapped/CareerWrapped';
import { buildWrappedCards } from '@/components/wrapped/wrappedCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProject, useBasePath } from '@/contexts/ProjectContext';
import { mockUser, calculatePillarProgress, calculateOverallProgress } from '@/data/mockData';
import { computeQuarterlyInsights } from '@/lib/quarterlyReview';
import {
  DemandMetrics,
  Milestone,
  PILLAR_LABELS,
  PILLAR_ORDER,
  HYPOTHESIS_STATUS_LABELS,
  PillarReview,
  Project,
  SocialMetricsSnapshot,
} from '@/types';
import { buildWhatsAppLink, formatDate, formatQuarter } from '@/lib/helpers';
import { AlertTriangle, TrendingUp, CheckCircle2, Dna, Target, Users, ArrowRight, Pencil, HelpCircle, ListChecks, FileOutput, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const STAT_TILE_ACCENT: Record<string, string> = {
  'in-progress': 'text-status-in-progress',
  completed: 'text-status-completed',
  delayed: 'text-status-delayed',
  muted: 'text-muted-foreground',
};

function StatTile({ label, value, icon: Icon, accent }: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: keyof typeof STAT_TILE_ACCENT;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
      <div className={cn('w-9 h-9 rounded-md bg-accent flex items-center justify-center shrink-0', STAT_TILE_ACCENT[accent])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="font-display font-bold text-xl text-foreground tabular-nums leading-none">{value}</div>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

function PillarCard({ pillarType, milestones }: { pillarType: typeof PILLAR_ORDER[number]; milestones: Milestone[] }) {
  const pillarMilestones = milestones.filter(m => m.pillarType === pillarType);
  const completed = pillarMilestones.filter(m => m.status === 'concluido').length;
  const progress = calculatePillarProgress(pillarType, milestones);
  const variant = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'default';

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-foreground">
          {PILLAR_LABELS[pillarType]}
        </h3>
        <span className="text-xs text-muted-foreground">{completed}/{pillarMilestones.length} concluídos</span>
      </div>
      <ProgressBar value={progress} variant={variant} showLabel size="lg" className="mb-3" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{pillarMilestones.filter(m => m.status === 'em_andamento').length} em andamento</span>
        <span>{pillarMilestones.filter(m => m.status === 'nao_iniciado').length} pendentes</span>
      </div>
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: Milestone }) {
  const subtaskProgress = milestone.subtasks && milestone.subtasks.length > 0
    ? Math.round((milestone.subtasks.filter(s => s.completed).length / milestone.subtasks.length) * 100)
    : milestone.status === 'concluido' ? 100 : 0;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="link-editorial text-sm font-medium text-foreground truncate">{milestone.title}</span>
          <PillarTag pillar={milestone.pillarType} />
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={milestone.status} />
          {milestone.deadline && (
            <span className="text-[11px] text-muted-foreground">Prazo: {formatDate(milestone.deadline)}</span>
          )}
          {milestone.subtasks && milestone.subtasks.length > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {milestone.subtasks.filter(s => s.completed).length}/{milestone.subtasks.length} tarefas
            </span>
          )}
        </div>
      </div>
      <div className="w-24 shrink-0">
        <ProgressBar
          value={subtaskProgress}
          size="sm"
          variant={milestone.status === 'concluido' ? 'completed' : milestone.status === 'atrasado' ? 'delayed' : 'in-progress'}
          showLabel
        />
      </div>
    </div>
  );
}

function DNABlock({ project }: { project: Project }) {
  const dna = project.dna;
  if (!dna) return null;

  const hypothesisColors: Record<string, string> = {
    nao_testada: 'text-muted-foreground',
    em_validacao: 'text-status-in-progress',
    validada: 'text-status-completed',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Dna className="w-4 h-4 text-primary" />
        <h2 className="font-display font-semibold text-sm text-foreground">DNA do Projeto</h2>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Conceito Artístico</span>
          <p className="text-sm text-foreground mt-1">{dna.artisticConcept}</p>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Narrativa</span>
          <p className="text-sm text-foreground mt-1">{dna.artisticNarrative}</p>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Universo Cultural</span>
          <p className="text-sm text-foreground mt-1">{dna.culturalUniverse}</p>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Referências</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {dna.references.map(ref => (
              <span key={ref} className="text-xs bg-accent px-2 py-0.5 rounded text-foreground">{ref}</span>
            ))}
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Hipótese Artística</span>
          <p className="text-sm text-foreground mt-1">{dna.artisticHypothesis}</p>
          <span className={cn('text-xs font-medium mt-1 inline-block', hypothesisColors[dna.hypothesisStatus])}>
            {HYPOTHESIS_STATUS_LABELS[dna.hypothesisStatus]}
          </span>
        </div>
      </div>
    </div>
  );
}

function PositioningBlock({ project }: { project: Project }) {
  const pos = project.positioning;
  if (!pos) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-status-in-progress" />
        <h2 className="font-display font-semibold text-sm text-foreground">Posicionamento</h2>
      </div>
      <div className="space-y-3">
        <InfoRow label="Gênero Principal" value={pos.mainGenre} />
        <InfoRow label="Subgênero" value={pos.subGenre} />
        <InfoRow label="Território Cultural" value={pos.culturalTerritory} />
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Proposta de Valor</span>
          <p className="text-sm text-foreground mt-1">{pos.valueProposition}</p>
        </div>
      </div>
    </div>
  );
}

function AudienceBlock({ project }: { project: Project }) {
  const aud = project.audience;
  if (!aud) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-status-delayed" />
        <h2 className="font-display font-semibold text-sm text-foreground">Público do Projeto</h2>
      </div>
      <div className="space-y-3">
        <InfoRow label="Faixa Etária" value={aud.ageRange} />
        <InfoRow label="Cena Cultural" value={aud.culturalScene} />
        <InfoRow label="Estética Predominante" value={aud.predominantAesthetic} />
        <InfoRow label="Comportamento" value={aud.behavior} />
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Plataformas Principais</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {aud.mainPlatforms.map(p => (
              <span key={p} className="text-xs bg-accent px-2 py-0.5 rounded text-foreground">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

function InsightSection({ icon: Icon, title, iconColor, children, empty }: {
  icon: React.ElementType;
  title: string;
  iconColor: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
      </div>
      {empty ? <p className="text-xs text-muted-foreground">Sem registros neste período.</p> : children}
    </div>
  );
}

function PillarReviewCard({ pr, projectId }: { pr: PillarReview; projectId: string }) {
  const { overrides, setOverride, clearOverride } = useProject();
  const summaryKey = `${projectId}::pillar-summary::${pr.pillarType}`;
  const progressKey = `${projectId}::pillar-progress::${pr.pillarType}`;
  const isOverridden = summaryKey in overrides || progressKey in overrides;

  const [editing, setEditing] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(pr.summary);
  const [progressDraft, setProgressDraft] = useState(String(pr.progress));

  const startEdit = () => {
    setSummaryDraft(pr.summary);
    setProgressDraft(String(pr.progress));
    setEditing(true);
  };

  const save = () => {
    const parsedProgress = Math.min(100, Math.max(0, Math.round(Number(progressDraft) || 0)));
    setOverride(summaryKey, summaryDraft.trim());
    setOverride(progressKey, parsedProgress);
    toast.success('Revisão do pilar atualizada manualmente');
    setEditing(false);
  };

  const restoreAutomatic = () => {
    clearOverride(summaryKey);
    clearOverride(progressKey);
    toast.success('Revisão do pilar voltou ao cálculo automático');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-sm text-foreground">
            {PILLAR_LABELS[pr.pillarType]}
          </h3>
          {isOverridden && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              Editado manualmente
            </span>
          )}
        </div>
        {!editing && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Anterior: {pr.previousProgress}%</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{pr.progress}%</span>
            </div>
            {isOverridden && (
              <button onClick={restoreAutomatic} className="text-[11px] text-muted-foreground hover:text-foreground underline transition-colors">
                Restaurar automático
              </button>
            )}
            <button onClick={startEdit} title="Editar revisão do pilar" className="text-muted-foreground hover:text-primary transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Progresso (%)</label>
            <Input type="number" min="0" max="100" value={progressDraft} onChange={e => setProgressDraft(e.target.value)} className="bg-background border-border text-foreground w-24" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Resumo</label>
            <Textarea value={summaryDraft} onChange={e => setSummaryDraft(e.target.value)} className="bg-background border-border text-foreground" rows={2} />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={save} className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar</Button>
            <Button size="sm" variant="outline" className="border-border" onClick={() => setEditing(false)}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <>
          <ProgressBar
            value={pr.progress}
            variant={pr.progress >= 60 ? 'completed' : 'in-progress'}
            showLabel
            size="lg"
            className="mb-3"
          />
          <p className="text-xs text-muted-foreground">{pr.summary || 'Sem resumo registrado — clique no lápis para adicionar.'}</p>
        </>
      )}
    </div>
  );
}

function AvaliacaoTrimestralSection({ project, milestones, pillarReviews, demandMetrics, socialSnapshot }: {
  project: Project;
  milestones: Milestone[];
  pillarReviews: PillarReview[];
  demandMetrics: DemandMetrics[];
  socialSnapshot: SocialMetricsSnapshot;
}) {
  const insights = computeQuarterlyInsights(project, milestones, pillarReviews, demandMetrics, socialSnapshot);

  return (
    <div className="space-y-8">
      <SectionDivider />
      <div>
        <h2 className="font-display font-bold text-lg text-foreground mb-1">Avaliação Trimestral</h2>
        <p className="text-sm text-muted-foreground">
          {formatQuarter(project.currentQuarter, project.currentYear)} — {project.name}. O conteúdo abaixo é
          calculado a partir de Milestones e Indicadores; a revisão por pilar pode ser ajustada manualmente.
        </p>
      </div>

      {/* Grid sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightSection icon={TrendingUp} title="O que Evoluiu" iconColor="text-status-completed" empty={insights.evolvedMilestones.length === 0 && insights.evolvedPillars.length === 0}>
          {insights.evolvedPillars.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {insights.evolvedPillars.map(pr => (
                <span key={pr.pillarType} className="text-xs bg-accent px-2 py-0.5 rounded text-foreground">
                  {PILLAR_LABELS[pr.pillarType]}: {pr.previousProgress}% → {pr.progress}%
                </span>
              ))}
            </div>
          )}
          {insights.evolvedMilestones.map(m => (
            <div key={m.id} className="text-xs text-muted-foreground py-1">• {m.title}</div>
          ))}
        </InsightSection>

        <InsightSection icon={AlertTriangle} title="O que Travou" iconColor="text-status-delayed" empty={insights.blockedMilestones.length === 0}>
          {insights.blockedMilestones.map(m => (
            <div key={m.id} className="text-xs text-muted-foreground py-1 flex items-center gap-2">
              <StatusBadge status={m.status} /> {m.title}
            </div>
          ))}
        </InsightSection>

        <InsightSection icon={CheckCircle2} title="Candidatos a Validado" iconColor="text-status-in-progress" empty={insights.validatedCandidates.length === 0}>
          <p className="text-[11px] text-muted-foreground mb-2">
            Marcos concluídos listados como candidatos — verificação automática de meta atingida ainda requer refinamento.
          </p>
          {insights.validatedCandidates.map(m => (
            <div key={m.id} className="text-xs text-muted-foreground py-1">• {m.title}{m.measurableGoal ? ` — ${m.measurableGoal}` : ''}</div>
          ))}
        </InsightSection>

        <InsightSection icon={ArrowRight} title="Próximos Marcos" iconColor="text-foreground" empty={milestones.filter(m => m.status !== 'concluido').length === 0}>
          {milestones
            .filter(m => m.status !== 'concluido')
            .sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''))
            .slice(0, 5)
            .map(m => (
              <div key={m.id} className="text-xs text-muted-foreground py-1 flex items-center justify-between">
                <span>{m.title}</span>
                {m.deadline && <span className="text-[11px]">{formatDate(m.deadline)}</span>}
              </div>
            ))}
        </InsightSection>
      </div>

      <SectionDivider />

      {/* Indicadores objetivos (substituem as perguntas estratégicas) */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-status-in-progress" />
          <h2 className="font-display font-semibold text-sm text-foreground">Indicadores Objetivos</h2>
        </div>
        <div className="py-3 border-b border-border">
          <span className="text-xs font-medium text-foreground">Resposta do público (variação de alcance)</span>
          <p className="text-sm text-muted-foreground mt-1">
            {insights.audienceResponseChangePct !== null
              ? `${insights.audienceResponseChangePct > 0 ? '+' : ''}${insights.audienceResponseChangePct}% no período (${socialSnapshot.period.start} a ${socialSnapshot.period.end})`
              : 'Sem dados de alcance suficientes no período.'}
          </p>
        </div>
        <div className="py-3 border-b border-border">
          <span className="text-xs font-medium text-foreground">Demanda real (shows e superfãs)</span>
          <p className="text-sm text-muted-foreground mt-1">
            Shows solicitados: {insights.realDemand.showsRequestedDelta >= 0 ? '+' : ''}{insights.realDemand.showsRequestedDelta} ·
            {' '}Shows confirmados: {insights.realDemand.showsConfirmedDelta >= 0 ? '+' : ''}{insights.realDemand.showsConfirmedDelta} ·
            {' '}Superfãs ativos: {insights.realDemand.superFansDelta >= 0 ? '+' : ''}{insights.realDemand.superFansDelta}
          </p>
        </div>
        <div className="py-3">
          <span className="text-xs font-medium text-foreground">Gargalo (pilar com menor progresso relativo)</span>
          <p className="text-sm text-muted-foreground mt-1">
            {insights.bottleneckPillar ? PILLAR_LABELS[insights.bottleneckPillar] : '—'}
          </p>
        </div>
      </div>

      {/* Pillar Comparison — editável, override manual sobrescreve o cálculo automático */}
      <section>
        <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Revisão por Pilar
        </h2>
        <div className="space-y-4">
          {pillarReviews.map((pr) => (
            <PillarReviewCard key={pr.pillarType} pr={pr} projectId={project.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Dashboard() {
  const { activeProject, activeArtist, milestones: allMilestones, quarterlyReview, demandMetrics, careerPhaseHistory, socialSnapshot, overrides } = useProject();
  const basePath = useBasePath();
  const milestones = allMilestones.filter(m => m.projectId === activeProject.id);
  const [epkDialogOpen, setEpkDialogOpen] = useState(false);
  const [wrappedOpen, setWrappedOpen] = useState(false);

  const review = quarterlyReview.projectId === activeProject.id
    ? quarterlyReview
    : {
        id: `auto-${activeProject.id}`,
        projectId: activeProject.id,
        quarter: activeProject.currentQuarter,
        year: activeProject.currentYear,
        pillarReviews: PILLAR_ORDER.map(pillarType => ({
          pillarType,
          summary: '',
          progress: calculatePillarProgress(pillarType, milestones),
          previousProgress: 0,
        })),
      };

  const mergedPillarReviews: PillarReview[] = review.pillarReviews.map(pr => {
    const summaryOverride = overrides[`${activeProject.id}::pillar-summary::${pr.pillarType}`];
    const progressOverride = overrides[`${activeProject.id}::pillar-progress::${pr.pillarType}`];
    return {
      ...pr,
      summary: summaryOverride !== undefined ? String(summaryOverride) : pr.summary,
      progress: progressOverride !== undefined ? Number(progressOverride) : pr.progress,
    };
  });

  const overallProgress = calculateOverallProgress(milestones);
  const inProgress = milestones.filter(m => m.status === 'em_andamento');
  const recentlyCompleted = milestones.filter(m => m.status === 'concluido').slice(0, 3);
  const delayed = milestones.filter(m => m.status === 'atrasado');
  const upcoming = milestones.filter(m => m.status === 'nao_iniciado').slice(0, 3);

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        {/* Header */}
        <ArtistCoverHeader
          artist={activeArtist}
          project={activeProject}
          aside={
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-7 px-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setWrappedOpen(true)}>
                  <Sparkles className="w-3 h-3 mr-1" /> Ver Jornada
                </Button>
                {activeArtist.whatsapp && (
                  <Button asChild variant="outline" size="sm" className="border-status-completed/40 text-status-completed hover:bg-status-completed/10 h-7 px-2">
                    <a
                      href={buildWhatsAppLink(activeArtist.whatsapp, `Olá ${activeArtist.name}, tudo bem? Aqui é ${mockUser.name}, da consultoria.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm" className="border-border text-muted-foreground h-7 px-2">
                  <Link to={`${basePath}/cadastro-artistico?mode=edit`}>
                    <Pencil className="w-3 h-3 mr-1" /> Editar perfil artístico
                  </Link>
                </Button>
                <Button size="sm" className="h-7 px-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setEpkDialogOpen(true)}>
                  <FileOutput className="w-3 h-3 mr-1" /> Exportar Apresentação
                </Button>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ProgressRing value={overallProgress} size={72} />
                <span className="text-xs text-muted-foreground">Progresso geral</span>
              </div>
            </div>
          }
        />

        <EPKExportDialog
          open={epkDialogOpen}
          onOpenChange={setEpkDialogOpen}
          artist={activeArtist}
          project={activeProject}
          demandMetrics={demandMetrics}
          socialSnapshot={socialSnapshot}
          managerName={mockUser.name}
        />

        {wrappedOpen && (
          <CareerWrapped
            cards={buildWrappedCards(
              activeArtist,
              activeProject,
              careerPhaseHistory.filter(h => h.projectId === activeProject.id),
              milestones,
              demandMetrics,
            )}
            onClose={() => setWrappedOpen(false)}
          />
        )}

        <Tabs defaultValue="visao-geral">
          <TabsList className="mb-8">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="avaliacao">Avaliação Trimestral</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="spotify">Spotify</TabsTrigger>
            <TabsTrigger value="contatos">Contatos</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral">
            {/* KPI row */}
            <section className="mb-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatTile label="Em andamento" value={inProgress.length} icon={TrendingUp} accent="in-progress" />
              <StatTile label="Concluídos" value={milestones.filter(m => m.status === 'concluido').length} icon={CheckCircle2} accent="completed" />
              <StatTile label="Atrasados" value={delayed.length} icon={AlertTriangle} accent="delayed" />
              <StatTile label="Não iniciados" value={milestones.filter(m => m.status === 'nao_iniciado').length} icon={ListChecks} accent="muted" />
            </section>

            {/* Career Phase */}
            <section className="mb-10">
              <CareerTimeline
                project={activeProject}
                history={careerPhaseHistory.filter(h => h.projectId === activeProject.id)}
                milestones={milestones}
              />
            </section>

            {/* Pillar Grid */}
            <section className="mb-10">
              <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Pilares
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PILLAR_ORDER.map((type) => (
                  <PillarCard key={type} pillarType={type} milestones={milestones} />
                ))}
              </div>
            </section>

            {/* Strategic Blocks: DNA, Positioning, Audience */}
            <section className="mb-10">
              <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Definição Artística (MDA)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <DNABlock project={activeProject} />
                <PositioningBlock project={activeProject} />
                <AudienceBlock project={activeProject} />
              </div>
            </section>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* In Progress */}
              <section className="bg-card rounded-lg border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-status-in-progress" />
                  <h2 className="font-display font-semibold text-sm text-foreground">Em Andamento</h2>
                  <span className="text-xs text-muted-foreground ml-auto">{inProgress.length}</span>
                </div>
                <div>
                  {inProgress.map(m => <MilestoneRow key={m.id} milestone={m} />)}
                  {inProgress.length === 0 && (
                    <EmptyState
                      illustration="milestones"
                      title="Nada em andamento"
                      description="Assim que um marco for iniciado, ele aparece aqui automaticamente."
                    />
                  )}
                </div>
              </section>

              {/* Upcoming */}
              <section className="bg-card rounded-lg border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-display font-semibold text-sm text-foreground">Próximos Passos</h2>
                  <span className="text-xs text-muted-foreground ml-auto">{upcoming.length}</span>
                </div>
                <div>
                  {upcoming.map(m => <MilestoneRow key={m.id} milestone={m} />)}
                  {upcoming.length === 0 && (
                    <EmptyState
                      illustration="milestones"
                      title="Sem próximos passos"
                      description="Marcos ainda não iniciados deste projeto vão aparecer aqui."
                    />
                  )}
                </div>
              </section>

              {/* Recently Completed */}
              <section className="bg-card rounded-lg border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-status-completed" />
                  <h2 className="font-display font-semibold text-sm text-foreground">Concluídos Recentemente</h2>
                </div>
                <div>
                  {recentlyCompleted.map(m => <MilestoneRow key={m.id} milestone={m} />)}
                </div>
              </section>

              {/* Alerts */}
              {delayed.length > 0 && (
                <section className="bg-card rounded-lg border border-status-delayed/20 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-status-delayed" />
                    <h2 className="font-display font-semibold text-sm text-foreground">Atenção</h2>
                  </div>
                  <div>
                    {delayed.map(m => <MilestoneRow key={m.id} milestone={m} />)}
                  </div>
                </section>
              )}
            </div>
          </TabsContent>

          <TabsContent value="avaliacao">
            <AvaliacaoTrimestralSection
              project={activeProject}
              milestones={milestones}
              pillarReviews={mergedPillarReviews}
              demandMetrics={demandMetrics}
              socialSnapshot={socialSnapshot}
            />
          </TabsContent>

          <TabsContent value="financeiro">
            <FinanceTab projectId={activeProject.id} />
          </TabsContent>

          <TabsContent value="spotify">
            <SpotifyTab artistId={activeArtist.id} artistName={activeArtist.name} />
          </TabsContent>

          <TabsContent value="contatos">
            <ContactsTab projectId={activeProject.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
