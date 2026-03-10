import { PillarType, MilestoneStatus } from '@/types';

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
