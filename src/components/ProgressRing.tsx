import { cn } from '@/lib/utils';

const STROKE_COLOR: Record<string, string> = {
  primary: 'stroke-primary',
  completed: 'stroke-status-completed',
  'in-progress': 'stroke-status-in-progress',
  delayed: 'stroke-status-delayed',
};

export function ProgressRing({ value, size = 64, strokeWidth = 7, variant = 'primary', className }: {
  value: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'completed' | 'in-progress' | 'delayed';
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-muted" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-all duration-500', STROKE_COLOR[variant])}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-bold text-foreground tabular-nums" style={{ fontSize: size * 0.26 }}>
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}
