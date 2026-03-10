export type PillarType = 'administrativo' | 'artistico' | 'marketing' | 'comercial';

export type MilestoneStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'atrasado';

export type Priority = 'baixa' | 'media' | 'alta' | 'critica';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'consultor' | 'artista';
  avatar?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar?: string;
  genre?: string;
  bio?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  artistId: string;
  name: string;
  description?: string;
  currentQuarter: number;
  currentYear: number;
  stage: string;
  overallProgress: number;
  createdAt: string;
}

export interface Pillar {
  id: string;
  projectId: string;
  type: PillarType;
  progress: number;
  level: string;
  observations?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  pillarType: PillarType;
  title: string;
  description: string;
  status: MilestoneStatus;
  progress: number;
  startDate?: string;
  deadline?: string;
  deliverables?: string[];
  measurableGoal?: string;
  observations?: string;
  responsible?: string;
  priority: Priority;
  tags?: string[];
  order: number;
}

export interface QuarterlyReview {
  id: string;
  projectId: string;
  quarter: number;
  year: number;
  summary: string;
  evolved: string;
  blocked: string;
  validated: string;
  nextSteps: string;
  newGoal: string;
  pillarReviews: PillarReview[];
}

export interface PillarReview {
  pillarType: PillarType;
  summary: string;
  progress: number;
  previousProgress: number;
}

export interface Comment {
  id: string;
  milestoneId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export const PILLAR_LABELS: Record<PillarType, string> = {
  administrativo: 'Administrativo',
  artistico: 'Artístico',
  marketing: 'Marketing',
  comercial: 'Comercial',
};

export const PILLAR_ORDER: PillarType[] = ['administrativo', 'artistico', 'marketing', 'comercial'];

export const STATUS_LABELS: Record<MilestoneStatus, string> = {
  nao_iniciado: 'Não Iniciado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  atrasado: 'Atrasado',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
};
