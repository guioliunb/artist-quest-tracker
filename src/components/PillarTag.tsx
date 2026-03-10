import { cn } from '@/lib/utils';
import { PillarType, PILLAR_LABELS } from '@/types';

interface PillarTagProps {
  pillar: PillarType;
  className?: string;
}

const pillarBorderColors: Record<PillarType, string> = {
  administrativo: 'border-muted-foreground/30',
  artistico: 'border-status-in-progress/30',
  marketing: 'border-status-delayed/30',
  comercial: 'border-status-completed/30',
};

export function PillarTag({ pillar, className }: PillarTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded text-muted-foreground',
        pillarBorderColors[pillar],
        className
      )}
    >
      {PILLAR_LABELS[pillar]}
    </span>
  );
}
