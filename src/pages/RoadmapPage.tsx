import { AppLayout } from '@/components/AppLayout';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import { mockMilestones, mockProject } from '@/data/mockData';
import { PILLAR_LABELS, PILLAR_ORDER, PillarType, Milestone } from '@/types';
import { formatQuarter } from '@/lib/helpers';
import { cn } from '@/lib/utils';

const months = ['Jan', 'Fev', 'Mar'];

function getMonthIndex(milestone: Milestone): number {
  if (!milestone.deadline) return 2;
  const month = new Date(milestone.deadline).getMonth();
  return Math.min(2, Math.max(0, month));
}

function TimelineBlock({ milestone }: { milestone: Milestone }) {
  const statusBg: Record<string, string> = {
    nao_iniciado: 'border-muted-foreground/20 bg-card',
    em_andamento: 'border-status-in-progress/30 bg-card',
    concluido: 'border-status-completed/20 bg-card',
    atrasado: 'border-status-delayed/20 bg-card',
  };

  return (
    <div className={cn('rounded-md border p-3 mb-2', statusBg[milestone.status])}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-foreground truncate">{milestone.title}</span>
        <StatusBadge status={milestone.status} />
      </div>
      <ProgressBar
        value={milestone.progress}
        size="sm"
        variant={milestone.status === 'concluido' ? 'completed' : milestone.status === 'atrasado' ? 'delayed' : 'in-progress'}
      />
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Roadmap Trimestral</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {formatQuarter(mockProject.currentQuarter, mockProject.currentYear)} — Visão geral do trimestre
            </p>
          </div>
        </div>

        {/* Horizontal timeline */}
        <div className="overflow-x-auto scrollbar-thin pb-4">
          <div className="min-w-[900px]">
            {/* Month headers */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {months.map((month) => (
                <div key={month} className="text-center">
                  <span className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                    {month}
                  </span>
                </div>
              ))}
            </div>

            {/* Pillar rows */}
            {PILLAR_ORDER.map((pillarType) => {
              const pillarMilestones = mockMilestones.filter(m => m.pillarType === pillarType);

              return (
                <div key={pillarType} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      {PILLAR_LABELS[pillarType]}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {months.map((_, monthIdx) => {
                      const monthMilestones = pillarMilestones.filter(
                        m => getMonthIndex(m) === monthIdx
                      );
                      return (
                        <div key={monthIdx} className="min-h-[60px]">
                          {monthMilestones.map(m => (
                            <TimelineBlock key={m.id} milestone={m} />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
