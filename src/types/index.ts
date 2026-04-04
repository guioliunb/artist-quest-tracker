export type PillarType = 'administrativo' | 'artistico' | 'marketing' | 'comercial';

export type MilestoneStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'atrasado';

export type Priority = 'baixa' | 'media' | 'alta' | 'critica';

export type HypothesisStatus = 'nao_testada' | 'em_validacao' | 'validada';

export type CareerPhase = 'definicao_mda' | 'experimentacao' | 'validacao_sva' | 'organizacao' | 'execucao' | 'consolidacao' | 'tracao' | 'escala';

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

export interface ProjectDNA {
  artisticConcept: string;
  artisticNarrative: string;
  culturalUniverse: string;
  references: string[];
  artisticHypothesis: string;
  hypothesisStatus: HypothesisStatus;
}

export interface ProjectPositioning {
  mainGenre: string;
  subGenre: string;
  culturalTerritory: string;
  valueProposition: string;
}

export interface ProjectAudience {
  ageRange: string;
  culturalScene: string;
  predominantAesthetic: string;
  behavior: string;
  mainPlatforms: string[];
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
  careerPhase: CareerPhase;
  bigGoal?: string;
  quarterGoal?: string;
  dna?: ProjectDNA;
  positioning?: ProjectPositioning;
  audience?: ProjectAudience;
}

export interface Pillar {
  id: string;
  projectId: string;
  type: PillarType;
  progress: number;
  level: string;
  observations?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
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
  subtasks?: Subtask[];
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
  strategicQuestions?: StrategicQuestions;
}

export interface StrategicQuestions {
  artisticEvolution: string;
  audienceResponse: string;
  realDemand: string;
  bottleneck: string;
  hypothesisValidation: string;
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

export interface DemandMetrics {
  month: string;
  shows: {
    requested: number;
    confirmed: number;
    ticketsSold: number;
    vipGuests: number;
  };
  streaming: {
    monthlyListeners: number;
    followers: number;
    saves: number;
    playlistAdds: number;
    preSaves: number;
  };
  community: {
    superFansActive: number;
    closedGroup: number;
    shares: number;
    campaignParticipation: number;
  };
  monetization: {
    streamingRoyalties: number;
    publicPerformance: number;
    publishing: number;
    sync: number;
    brands: number;
    licensing: number;
  };
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

export const HYPOTHESIS_STATUS_LABELS: Record<HypothesisStatus, string> = {
  nao_testada: 'Não Testada',
  em_validacao: 'Em Validação',
  validada: 'Validada',
};

export const CAREER_PHASE_LABELS: Record<CareerPhase, string> = {
  definicao_mda: 'Definição (MDA)',
  experimentacao: 'Experimentação',
  validacao_sva: 'Validação (SVA)',
  organizacao: 'Organização',
  execucao: 'Execução',
  consolidacao: 'Consolidação',
  tracao: 'Tração',
  escala: 'Escala',
};

export const CAREER_PHASE_ORDER: CareerPhase[] = ['definicao_mda', 'experimentacao', 'validacao_sva', 'organizacao', 'execucao', 'consolidacao', 'tracao', 'escala'];
