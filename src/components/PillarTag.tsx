import { cn } from '@/lib/utils';
import { PillarType, PILLAR_LABELS } from '@/types';

interface PillarTagProps {
  pillar: PillarType;
  className?: string;
}

const pillarBorderColors: Record<PillarType, string> = {
  administrativo: 'border-muted-foreground/40 text-muted-foreground',
  artistico: 'border-blue-500/40 text-blue-400',
  marketing: 'border-orange-500/40 text-orange-400',
  comercial: 'border-emerald-500/40 text-emerald-400',
};

export function PillarTag({ pillar, className }: PillarTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded',
        pillarBorderColors[pillar],
        className
      )}
    >
      {PILLAR_LABELS[pillar]}
    </span>
  );
}
