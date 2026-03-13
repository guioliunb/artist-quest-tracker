import { PillarType, MilestoneStatus, CareerPhase, CAREER_PHASE_ORDER } from '@/types';

export function getPillarColor(pillar: PillarType): string {
  const colors: Record<PillarType, string> = {
    administrativo: 'text-foreground',
    artistico: 'text-foreground',
    marketing: 'text-foreground',
    comercial: 'text-foreground',
  };
  return colors[pillar];
}

export function getStatusColor(status: MilestoneStatus): string {
  const colors: Record<MilestoneStatus, string> = {
    nao_iniciado: 'bg-status-not-started',
    em_andamento: 'bg-status-in-progress',
    concluido: 'bg-status-completed',
    atrasado: 'bg-status-delayed',
  };
  return colors[status];
}

export function getStatusTextColor(status: MilestoneStatus): string {
  const colors: Record<MilestoneStatus, string> = {
    nao_iniciado: 'text-muted-foreground',
    em_andamento: 'text-status-in-progress',
    concluido: 'text-status-completed',
    atrasado: 'text-status-delayed',
  };
  return colors[status];
}

export function getStatusDotColor(status: MilestoneStatus): string {
  const colors: Record<MilestoneStatus, string> = {
    nao_iniciado: 'bg-muted-foreground',
    em_andamento: 'bg-status-in-progress',
    concluido: 'bg-status-completed',
    atrasado: 'bg-status-delayed',
  };
  return colors[status];
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatQuarter(quarter: number, year: number): string {
  return `Q${quarter} ${year}`;
}

export function getCareerPhaseIndex(phase: CareerPhase): number {
  return CAREER_PHASE_ORDER.indexOf(phase);
}

export function getCareerPhaseProgress(phase: CareerPhase): number {
  const idx = getCareerPhaseIndex(phase);
  // Each phase is ~16.7% of total journey
  return Math.round(((idx + 0.5) / CAREER_PHASE_ORDER.length) * 100);
}

export function getNextCareerPhase(phase: CareerPhase): CareerPhase | null {
  const idx = getCareerPhaseIndex(phase);
  if (idx < CAREER_PHASE_ORDER.length - 1) return CAREER_PHASE_ORDER[idx + 1];
  return null;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}
