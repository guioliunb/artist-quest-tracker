import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  variant?: 'default' | 'completed' | 'in-progress' | 'delayed';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantColors: Record<string, string> = {
  default: 'bg-primary',
  completed: 'bg-status-completed',
  'in-progress': 'bg-status-in-progress',
  delayed: 'bg-status-delayed',
};

const sizeClasses: Record<string, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

export function ProgressBar({
  value,
  className,
  variant = 'default',
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const [displayValue, setDisplayValue] = useState(0);
  const isFirstRender = useRef(true);

  // Animate the fill from 0% to the real value on mount, unless the user prefers reduced motion.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(clampedValue);
      return;
    }
    const timeout = setTimeout(() => setDisplayValue(clampedValue), 30);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the value changes later (e.g. progress recalculated), animate from the current fill to the new one.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setDisplayValue(clampedValue);
  }, [clampedValue]);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 rounded-full bg-accent overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            variantColors[variant]
          )}
          style={{ width: `${displayValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground tabular-nums w-10 text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
