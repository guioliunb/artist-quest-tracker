import { ReactNode } from 'react';
import { ProgressRing } from '@/components/ProgressRing';
import { CAREER_PHASE_LABELS, CAREER_PHASE_ORDER, DemandMetrics, Milestone, Project, Artist, CareerPhaseHistoryEntry } from '@/types';
import { calculateOverallProgress } from '@/data/mockData';
import { formatDate, formatNumber } from '@/lib/helpers';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WrappedBackground = 'primary' | 'card' | 'background';

export interface WrappedCard {
  key: string;
  background: WrappedBackground;
  durationMs: number;
  content: ReactNode;
}

function CoverCard({ artistName, projectName, since }: { artistName: string; projectName: string; since: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 px-8">
      <span className="text-[11px] uppercase tracking-[0.3em] opacity-70">A jornada de</span>
      <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight">{artistName}</h1>
      <p className="text-sm opacity-70 max-w-xs">{projectName} · desde {since}</p>
      <div className="mt-10 flex items-center gap-2 text-xs uppercase tracking-widest opacity-50 animate-progress-pulse">
        <Sparkles className="w-3.5 h-3.5" /> Toque para começar
      </div>
    </div>
  );
}

function OriginCard({ note, phaseLabel, date }: { note?: string; phaseLabel: string; date: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 px-8 max-w-lg mx-auto">
      <span aria-hidden className="font-display text-7xl text-muted-foreground/30 leading-none">"</span>
      <p className="font-display italic text-2xl md:text-3xl text-foreground leading-snug -mt-6">{note || phaseLabel}</p>
      <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-4">Como tudo começou · {date}</span>
    </div>
  );
}

function PhasesCard({ phaseCount, currentPhaseIndex, currentPhaseLabel }: { phaseCount: number; currentPhaseIndex: number; currentPhaseLabel: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 px-8">
      <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Fases percorridas</span>
      <span className="font-display font-bold text-7xl text-foreground tabular-nums">{phaseCount}</span>
      <div className="flex items-center gap-1.5">
        {CAREER_PHASE_ORDER.map((p, i) => (
          <span key={p} className={cn('h-1.5 rounded-full transition-all', i <= currentPhaseIndex ? 'bg-primary w-8' : 'bg-muted w-3')} />
        ))}
      </div>
      <span className="text-sm text-muted-foreground max-w-xs">até chegar em <strong className="text-foreground font-medium">{currentPhaseLabel}</strong></span>
    </div>
  );
}

function QuoteCard({ quote, label }: { quote: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 px-8 max-w-xl mx-auto">
      <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <p className="font-display italic text-2xl md:text-3xl text-foreground leading-snug">"{quote}"</p>
    </div>
  );
}

function MilestonesCard({ count, highlights }: { count: number; highlights: string[] }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 px-8 max-w-md mx-auto w-full">
      <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Marcos conquistados</span>
      <span className="font-display font-bold text-7xl text-foreground tabular-nums">{count}</span>
      {highlights.length > 0 && (
        <div className="space-y-2 w-full">
          {highlights.map(h => (
            <div key={h} className="flex items-center gap-2 text-sm text-foreground bg-accent/60 rounded-md px-3 py-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-status-completed shrink-0" /> {h}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GrowthCard({ label, fromValue, toValue, pct }: { label: string; fromValue: number; toValue: number; pct: number }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 px-8">
      <span className="text-[11px] uppercase tracking-[0.25em] opacity-70">{label}</span>
      <span className="font-display font-bold text-7xl tabular-nums">{pct > 0 ? '+' : ''}{pct}%</span>
      <span className="text-sm opacity-80">{formatNumber(fromValue)} → {formatNumber(toValue)}</span>
    </div>
  );
}

function ClosingCard({ phaseLabel, progress, artistName }: { phaseLabel: string; progress: number; artistName: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 px-8">
      <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Hoje</span>
      <ProgressRing value={progress} size={96} />
      <h2 className="font-display font-bold text-2xl text-foreground">{phaseLabel}</h2>
      <p className="text-sm text-muted-foreground max-w-xs">A jornada de {artistName} continua. Obrigado por acompanhar.</p>
    </div>
  );
}

export function buildWrappedCards(
  artist: Artist,
  project: Project,
  history: CareerPhaseHistoryEntry[],
  milestones: Milestone[],
  demandMetrics: DemandMetrics[],
): WrappedCard[] {
  const cards: WrappedCard[] = [];

  cards.push({
    key: 'cover',
    background: 'primary',
    durationMs: 5000,
    content: <CoverCard artistName={artist.name} projectName={project.name} since={formatDate(project.createdAt)} />,
  });

  const sortedHistory = [...history].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  if (sortedHistory.length > 0) {
    const first = sortedHistory[0];
    cards.push({
      key: 'origin',
      background: 'card',
      durationMs: 7000,
      content: <OriginCard note={first.note} phaseLabel={CAREER_PHASE_LABELS[first.phase]} date={formatDate(first.startedAt)} />,
    });

    const currentPhaseIndex = CAREER_PHASE_ORDER.indexOf(project.careerPhase);
    cards.push({
      key: 'phases',
      background: 'background',
      durationMs: 5000,
      content: <PhasesCard phaseCount={sortedHistory.length} currentPhaseIndex={currentPhaseIndex} currentPhaseLabel={CAREER_PHASE_LABELS[project.careerPhase]} />,
    });
  }

  const quote = project.positioning?.valueProposition || project.dna?.artisticConcept;
  if (quote) {
    cards.push({
      key: 'quote',
      background: 'card',
      durationMs: 7500,
      content: <QuoteCard quote={quote} label="O conceito" />,
    });
  }

  const completed = milestones.filter(m => m.status === 'concluido');
  if (completed.length > 0) {
    const critical = completed.filter(m => m.priority === 'critica').slice(0, 3).map(m => m.title);
    const highlights = critical.length > 0 ? critical : completed.slice(0, 3).map(m => m.title);
    cards.push({
      key: 'milestones',
      background: 'background',
      durationMs: 7000,
      content: <MilestonesCard count={completed.length} highlights={highlights} />,
    });
  }

  if (demandMetrics.length >= 2) {
    const first = demandMetrics[0];
    const last = demandMetrics[demandMetrics.length - 1];
    const fromValue = first.streaming.monthlyListeners;
    const toValue = last.streaming.monthlyListeners;
    if (fromValue > 0 || toValue > 0) {
      const pct = fromValue > 0 ? Math.round(((toValue - fromValue) / fromValue) * 100) : 100;
      cards.push({
        key: 'growth',
        background: 'primary',
        durationMs: 5500,
        content: <GrowthCard label="Crescimento de ouvintes mensais" fromValue={fromValue} toValue={toValue} pct={pct} />,
      });
    }
  }

  cards.push({
    key: 'closing',
    background: 'card',
    durationMs: 7000,
    content: <ClosingCard phaseLabel={CAREER_PHASE_LABELS[project.careerPhase]} progress={calculateOverallProgress(milestones)} artistName={artist.name} />,
  });

  return cards;
}
