import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import { PillarTag } from '@/components/PillarTag';
import { mockMilestones } from '@/data/mockData';
import { PillarType, MilestoneStatus, PILLAR_LABELS, PILLAR_ORDER, Milestone } from '@/types';
import { formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { LayoutList, Columns3, Search, Filter, CheckCircle2, Circle } from 'lucide-react';

type ViewMode = 'list' | 'kanban';

function SubtaskList({ subtasks }: { subtasks: NonNullable<Milestone['subtasks']> }) {
  return (
    <div className="mt-2 space-y-1">
      {subtasks.map(st => (
        <div key={st.id} className="flex items-center gap-2">
          {st.completed
            ? <CheckCircle2 className="w-3 h-3 text-status-completed shrink-0" />
            : <Circle className="w-3 h-3 text-muted-foreground shrink-0" />
          }
          <span className={cn('text-xs', st.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>
            {st.title}
          </span>
        </div>
      ))}
    </div>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const subtaskProgress = milestone.subtasks && milestone.subtasks.length > 0
    ? Math.round((milestone.subtasks.filter(s => s.completed).length / milestone.subtasks.length) * 100)
    : milestone.status === 'concluido' ? 100 : 0;

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-muted-foreground/30 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <PillarTag pillar={milestone.pillarType} />
        <StatusBadge status={milestone.status} />
      </div>
      <h3 className="font-display font-semibold text-sm text-foreground mb-2">{milestone.title}</h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{milestone.description}</p>
      <ProgressBar
        value={subtaskProgress}
        size="sm"
        variant={milestone.status === 'concluido' ? 'completed' : milestone.status === 'atrasado' ? 'delayed' : 'in-progress'}
        showLabel
      />
      {milestone.subtasks && milestone.subtasks.length > 0 && (
        <SubtaskList subtasks={milestone.subtasks} />
      )}
      <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
        {milestone.deadline && <span>Prazo: {formatDate(milestone.deadline)}</span>}
        {milestone.responsible && <span>{milestone.responsible}</span>}
      </div>
    </div>
  );
}

function KanbanColumn({ status, milestones }: { status: MilestoneStatus; milestones: Milestone[] }) {
  const statusColors: Record<MilestoneStatus, string> = {
    nao_iniciado: 'border-muted-foreground/20',
    em_andamento: 'border-status-in-progress/30',
    concluido: 'border-status-completed/30',
    atrasado: 'border-status-delayed/30',
  };

  return (
    <div className={cn('flex-1 min-w-[260px] rounded-lg border p-3', statusColors[status])}>
      <div className="flex items-center gap-2 mb-4 px-1">
        <StatusBadge status={status} />
        <span className="text-xs text-muted-foreground ml-auto">{milestones.length}</span>
      </div>
      <div className="space-y-3">
        {milestones.map(m => <MilestoneCard key={m.id} milestone={m} />)}
      </div>
    </div>
  );
}

export default function MilestonesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterPillar, setFilterPillar] = useState<PillarType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockMilestones.filter(m => {
    if (filterPillar !== 'all' && m.pillarType !== filterPillar) return false;
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusOrder: MilestoneStatus[] = ['em_andamento', 'nao_iniciado', 'atrasado', 'concluido'];

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground">Milestones</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'kanban' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Columns3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <button
              onClick={() => setFilterPillar('all')}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                filterPillar === 'all' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Todos
            </button>
            {PILLAR_ORDER.map(p => (
              <button
                key={p}
                onClick={() => setFilterPillar(p)}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                  filterPillar === p ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {PILLAR_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-3">
            {filtered.map(m => <MilestoneCard key={m.id} milestone={m} />)}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">Nenhum milestone encontrado.</p>
            )}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4">
            {statusOrder.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                milestones={filtered.filter(m => m.status === status)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
