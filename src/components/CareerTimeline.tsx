import { CareerPhaseHistoryEntry, CAREER_PHASE_LABELS, CAREER_PHASE_ORDER, Milestone, Project } from '@/types';
import { formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';

export function CareerTimeline({ project, history, milestones }: {
  project: Project;
  history: CareerPhaseHistoryEntry[];
  milestones: Milestone[];
}) {
  const phaseIdx = CAREER_PHASE_ORDER.indexOf(project.careerPhase);
  const historyByPhase = new Map(history.map(h => [h.phase, h]));

  const currentEntry = historyByPhase.get(project.careerPhase);
  const nextPhase = CAREER_PHASE_ORDER[phaseIdx + 1];
  const nextEntry = nextPhase ? historyByPhase.get(nextPhase) : undefined;

  const criticalMarkers = currentEntry
    ? milestones.filter(m =>
        m.priority === 'critica' &&
        m.status === 'concluido' &&
        m.deadline &&
        m.deadline >= currentEntry.startedAt &&
        (!nextEntry || m.deadline < nextEntry.startedAt),
      )
    : [];

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">
        Linha do Tempo da Carreira
      </h2>
      <div className="flex items-start gap-1">
        {CAREER_PHASE_ORDER.map((phase, i) => {
          const entry = historyByPhase.get(phase);
          const isCurrent = i === phaseIdx;

          return (
            <div key={phase} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={cn(
                  'h-1.5 w-full rounded-full transition-colors',
                  i < phaseIdx ? 'bg-status-completed' :
                  isCurrent ? 'bg-status-in-progress' :
                  'bg-muted',
                )}
              />

              {isCurrent && criticalMarkers.length > 0 && (
                <div className="flex items-center gap-1">
                  {criticalMarkers.map(m => (
                    <span
                      key={m.id}
                      title={m.title}
                      className="w-1.5 h-1.5 rounded-full bg-status-completed ring-2 ring-card"
                    />
                  ))}
                </div>
              )}

              <span className={cn(
                'text-[10px] text-center truncate w-full',
                isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}>
                {CAREER_PHASE_LABELS[phase]}
              </span>

              {entry && (
                <div className="text-center">
                  <span className="block text-[10px] text-muted-foreground tabular-nums">
                    {formatDate(entry.startedAt)}
                  </span>
                  {entry.note && (
                    <span className="block text-[10px] text-muted-foreground/80 truncate max-w-[6.5rem]" title={entry.note}>
                      {entry.note}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
