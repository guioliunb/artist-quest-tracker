import { MilestoneStatus, STATUS_LABELS } from '@/types';
import { getStatusDotColor } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: MilestoneStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('w-1.5 h-1.5 rounded-full', getStatusDotColor(status))} />
      <span className="text-xs font-medium text-muted-foreground">
        {STATUS_LABELS[status]}
      </span>
    </div>
  );
}
