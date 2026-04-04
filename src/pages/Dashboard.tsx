import { AppLayout } from '@/components/AppLayout';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import { PillarTag } from '@/components/PillarTag';
import { mockProject, mockArtist, mockMilestones } from '@/data/mockData';
import { calculatePillarProgress, calculateOverallProgress } from '@/data/mockData';
import { PILLAR_LABELS, PILLAR_ORDER, CAREER_PHASE_LABELS, CAREER_PHASE_ORDER, HYPOTHESIS_STATUS_LABELS } from '@/types';
import { formatDate, formatQuarter, getNextCareerPhase } from '@/lib/helpers';
import { AlertTriangle, TrendingUp, CheckCircle2, Dna, Target, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function PillarCard({ pillarType }: { pillarType: typeof PILLAR_ORDER[number] }) {
  const milestones = mockMilestones.filter(m => m.pillarType === pillarType);
  const completed = milestones.filter(m => m.status === 'concluido').length;
  const progress = calculatePillarProgress(pillarType, mockMilestones);
  const variant = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'default';

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-foreground">
          {PILLAR_LABELS[pillarType]}
        </h3>
        <span className="text-xs text-muted-foreground">{completed}/{milestones.length} concluídos</span>
      </div>
      <ProgressBar value={progress} variant={variant} showLabel size="lg" className="mb-3" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{milestones.filter(m => m.status === 'em_andamento').length} em andamento</span>
        <span>{milestones.filter(m => m.status === 'nao_iniciado').length} pendentes</span>
      </div>
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: typeof mockMilestones[0] }) {
  const subtaskProgress = milestone.subtasks && milestone.subtasks.length > 0
    ? Math.round((milestone.subtasks.filter(s => s.completed).length / milestone.subtasks.length) * 100)
    : milestone.status === 'concluido' ? 100 : 0;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground truncate">{milestone.title}</span>
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

function CareerPhaseIndicator() {
  const phase = mockProject.careerPhase;
  const phaseIdx = CAREER_PHASE_ORDER.indexOf(phase);
  const nextPhase = getNextCareerPhase(phase);

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
        Evolução do Projeto
      </h2>
      <div className="flex items-center gap-1 mb-4">
        {CAREER_PHASE_ORDER.map((p, i) => (
          <div key={p} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'h-1.5 w-full rounded-full transition-colors',
                i < phaseIdx ? 'bg-status-completed' :
                i === phaseIdx ? 'bg-status-in-progress' :
                'bg-muted'
              )}
            />
            <span className={cn(
              'text-[10px] truncate',
              i === phaseIdx ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}>
              {CAREER_PHASE_LABELS[p]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground font-medium">Fase atual: {CAREER_PHASE_LABELS[phase]}</span>
        {nextPhase && (
          <span className="text-muted-foreground flex items-center gap-1">
            Próxima: {CAREER_PHASE_LABELS[nextPhase]}
            <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
}

function DNABlock() {
  const dna = mockProject.dna;
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

function PositioningBlock() {
  const pos = mockProject.positioning;
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

function AudienceBlock() {
  const aud = mockProject.audience;
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

export default function Dashboard() {
  const overallProgress = calculateOverallProgress(mockMilestones);
  const inProgress = mockMilestones.filter(m => m.status === 'em_andamento');
  const recentlyCompleted = mockMilestones.filter(m => m.status === 'concluido').slice(0, 3);
  const delayed = mockMilestones.filter(m => m.status === 'atrasado');
  const upcoming = mockMilestones.filter(m => m.status === 'nao_iniciado').slice(0, 3);

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        {/* Header */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-lg text-foreground">
              {mockArtist.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl text-foreground mb-1">
              {mockArtist.name}
            </h1>
            <p className="text-sm text-muted-foreground mb-1">{mockProject.name}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{mockProject.stage}</span>
              <span>•</span>
              <span>{formatQuarter(mockProject.currentQuarter, mockProject.currentYear)}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display font-bold text-4xl text-foreground tabular-nums">
              {overallProgress}%
            </div>
            <span className="text-xs text-muted-foreground">Progresso geral</span>
          </div>
        </div>

        {/* Career Phase */}
        <section className="mb-10">
          <CareerPhaseIndicator />
        </section>

        {/* Pillar Grid */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Pilares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLAR_ORDER.map((type) => (
              <PillarCard key={type} pillarType={type} />
            ))}
          </div>
        </section>

        {/* Strategic Blocks: DNA, Positioning, Audience */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Estratégia
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DNABlock />
            <PositioningBlock />
            <AudienceBlock />
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
                <p className="text-xs text-muted-foreground py-4">Nenhum milestone em andamento.</p>
              )}
            </div>
          </section>

          {/* Upcoming */}
          <section className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-display font-semibold text-sm text-foreground">Próximos</h2>
              <span className="text-xs text-muted-foreground ml-auto">{upcoming.length}</span>
            </div>
            <div>
              {upcoming.map(m => <MilestoneRow key={m.id} milestone={m} />)}
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
      </div>
    </AppLayout>
  );
}
