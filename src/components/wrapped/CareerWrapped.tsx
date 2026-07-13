import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WrappedBackground, WrappedCard } from './wrappedCards';

const BG_CLASS: Record<WrappedBackground, string> = {
  primary: 'bg-primary text-primary-foreground',
  card: 'bg-card text-foreground',
  background: 'bg-background text-foreground',
};

const CHROME_TEXT_CLASS: Record<WrappedBackground, string> = {
  primary: 'text-primary-foreground',
  card: 'text-foreground',
  background: 'text-foreground',
};

export function CareerWrapped({ cards, onClose }: { cards: WrappedCard[]; onClose: () => void }) {
  const [index, setIndex] = useState(0);

  const goNext = () => {
    if (index >= cards.length - 1) {
      onClose();
      return;
    }
    setIndex(i => i + 1);
  };

  const goPrev = () => setIndex(i => Math.max(0, i - 1));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const current = cards[index];
  const isLast = index === cards.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <div className={cn('absolute inset-0 transition-colors duration-500', BG_CLASS[current.background])} />

      {/* click zones */}
      <button aria-label="Card anterior" onClick={goPrev} className="absolute left-0 top-0 bottom-0 w-1/3 z-[5] cursor-w-resize" />
      <button aria-label="Próximo card" onClick={goNext} className="absolute right-0 top-0 bottom-0 w-2/3 z-[5] cursor-e-resize" />

      <div key={current.key} className={cn('relative z-[6] w-full max-w-xl animate-wrapped-card-in pointer-events-none', CHROME_TEXT_CLASS[current.background])}>
        {current.content}
      </div>

      <div className={cn('absolute inset-0 pointer-events-none z-10', CHROME_TEXT_CLASS[current.background])}>
        {/* progress segments */}
        <div className="flex gap-1.5 p-4">
          {cards.map((c, i) => (
            <div key={c.key} className="flex-1 h-1 rounded-full bg-current opacity-25 overflow-hidden">
              {i < index && <div className="h-full w-full bg-current" />}
              {i === index && (
                <div
                  className="h-full w-full bg-current origin-left animate-wrapped-fill"
                  style={{ animationDuration: `${current.durationMs}ms` }}
                  onAnimationEnd={() => { if (!isLast) goNext(); }}
                />
              )}
            </div>
          ))}
        </div>

        <button onClick={onClose} className="absolute top-8 right-4 pointer-events-auto opacity-80 hover:opacity-100 transition-opacity p-2">
          <X className="w-5 h-5" />
        </button>

        <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-current/10 hover:bg-current/20 pointer-events-auto transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-current/10 hover:bg-current/20 pointer-events-auto transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
