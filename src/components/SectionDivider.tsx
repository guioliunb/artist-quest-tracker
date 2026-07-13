import { cn } from '@/lib/utils';

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative py-2', className)}>
      <div className="border-t border-border w-full" />
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
        ◆
      </span>
    </div>
  );
}
