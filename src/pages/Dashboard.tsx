import { AppLayout } from '@/components/AppLayout';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import { PillarTag } from '@/components/PillarTag';
import { mockProject, mockArtist, mockPillars, mockMilestones } from '@/data/mockData';
import { PILLAR_LABELS, PILLAR_ORDER, PillarType } from '@/types';
import { formatDate, formatQuarter } from '@/lib/helpers';
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';

function PillarCard({ pillar }: { pillar: typeof mockPillars[0] }) {
  const milestones = mockMilestones.filter(m => m.pillarType === pillar.type);
  const completed = milestones.filter(m => m.status === 'concluido').length;
  const variant = pillar.progress === 100 ? 'completed' : pillar.progress > 0 ? 'in-progress' : 'default';

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-foreground">
          {PILLAR_LABELS[pillar.type]}
        </h3>
        <span className="text-xs text-muted-foreground">{pillar.level}</span>
      </div>
      <ProgressBar value={pillar.progress} variant={variant} showLabel size="lg" className="mb-3" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{completed}/{milestones.length} milestones</span>
      </div>
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: typeof mockMilestones[0] }) {
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
        </div>
      </div>
      <div className="w-24 shrink-0">
        <ProgressBar
          value={milestone.progress}
          size="sm"
          variant={milestone.status === 'concluido' ? 'completed' : milestone.status === 'atrasado' ? 'delayed' : 'in-progress'}
          showLabel
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
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
              {mockProject.overallProgress}%
            </div>
            <span className="text-xs text-muted-foreground">Progresso geral</span>
          </div>
        </div>

        {/* Pillar Grid */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Pilares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLAR_ORDER.map((type) => {
              const pillar = mockPillars.find(p => p.type === type)!;
              return <PillarCard key={type} pillar={pillar} />;
            })}
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
