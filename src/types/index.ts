export type PillarType = 'administrativo' | 'artistico' | 'marketing' | 'comercial';

export type MilestoneStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'atrasado';

export type Priority = 'baixa' | 'media' | 'alta' | 'critica';

export type HypothesisStatus = 'nao_testada' | 'em_validacao' | 'validada';

export type CareerPhase = 'definicao_mda' | 'experimentacao' | 'validacao_sva' | 'organizacao' | 'execucao' | 'consolidacao' | 'tracao' | 'escala';

export type ProjectType = 'single' | 'ep' | 'album' | 'turne' | 'videoclipe' | 'campanha' | 'rebranding' | 'edital' | 'captacao' | 'show_evento';

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
  whatsapp?: string;
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
  projectType: ProjectType;
  bigGoal?: string;
  quarterGoal?: string;
  dna?: ProjectDNA;
  positioning?: ProjectPositioning;
  audience?: ProjectAudience;
}

export interface CareerPhaseHistoryEntry {
  id: string;
  projectId: string;
  phase: CareerPhase;
  startedAt: string; // ISO date
  note?: string; // anotação curta e factual, preenchida manualmente
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
  sourceEventId?: string;
}

export interface QuarterlyReview {
  id: string;
  projectId: string;
  quarter: number;
  year: number;
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

// Social media metrics (Tarefa 4) — shape mirrors the aggregator API response
// (`{ values, trend?: { data }, comparison?: {...} }`) so a future real integration
// only needs to replace the adapter in src/data/socialMetrics.ts, not the components.
export interface SocialMetricValue {
  values: number;
  trend?: { data: number[] };
  comparison?: { values: number | null; difference: number | null; absoluteDifference: number | null };
}

export interface SocialMetricsSnapshot {
  period: { start: string; end: string };
  facebook: {
    pageReach?: SocialMetricValue;
    postEngagements?: SocialMetricValue;
    postEngagementRate?: SocialMetricValue;
    videoViews?: SocialMetricValue;
  };
  instagram: {
    profileViews?: SocialMetricValue;
    views?: SocialMetricValue;
    storiesViews?: SocialMetricValue;
    reachOverTime?: SocialMetricValue;
  };
  tiktok: {
    views?: SocialMetricValue;
    likes?: SocialMetricValue;
    comments?: SocialMetricValue;
    shares?: SocialMetricValue;
    follows?: SocialMetricValue;
  };
  youtube: {
    views?: SocialMetricValue;
    likes?: SocialMetricValue;
    comments?: SocialMetricValue;
    shares?: SocialMetricValue;
    subscribersVariation?: SocialMetricValue;
  };
}

// Agenda de contatos da indústria — mini-CRM por projeto.
export type ContactCategory = 'produtor' | 'booker' | 'imprensa' | 'marca' | 'outro';

export interface IndustryContact {
  id: string;
  projectId: string;
  name: string;
  category: ContactCategory;
  company?: string;
  role?: string;
  whatsapp?: string;
  email?: string;
  notes?: string;
  lastContactDate?: string;
}

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  produtor: 'Produtor',
  booker: 'Booker',
  imprensa: 'Imprensa',
  marca: 'Marca',
  outro: 'Outro',
};

export const CONTACT_CATEGORY_ORDER: ContactCategory[] = ['produtor', 'booker', 'imprensa', 'marca', 'outro'];

// Integração com perfil profissional (Spotify) — dados mockados; sem API real conectada.
export interface SpotifyTrack {
  id: string;
  title: string;
  streams: number;
  releaseDate?: string;
}

export interface SpotifyPlaylistFeature {
  id: string;
  playlistName: string;
  curator?: string;
  followers?: number;
}

export interface SpotifyProfile {
  artistId: string;
  profileUrl: string;
  verified: boolean;
  monthlyListeners: number;
  followers: number;
  topTracks: SpotifyTrack[];
  playlists: SpotifyPlaylistFeature[];
}

// Agenda (Tarefa 5)
export type CalendarEventType = 'show' | 'lancamento' | 'prazo_marco' | 'reuniao' | 'avaliacao_trimestral' | 'lembrete';

export interface EventChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface EventComment {
  id: string;
  eventId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  projectId: string;
  type: CalendarEventType;
  title: string;
  date: string;
  notes?: string;
  sourceMilestoneId?: string;
  sourceFinanceEntryId?: string;
  participants?: string[];
  attachmentNames?: string[];
  decisions?: string;
  checklist?: EventChecklistItem[];
  nextActions?: string[];
}

export const CALENDAR_EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  show: 'Show',
  lancamento: 'Lançamento',
  prazo_marco: 'Prazo de Marco',
  reuniao: 'Reunião',
  avaliacao_trimestral: 'Avaliação Trimestral',
  lembrete: 'Lembrete',
};

// Financeiro
export type FinanceEntryType = 'receita' | 'despesa';

export type FinanceCategory = 'producao' | 'marketing' | 'shows' | 'equipe' | 'distribuicao' | 'juridico' | 'outros';

export type FinanceStatus = 'previsto' | 'pago' | 'recebido' | 'atrasado';

export interface FinanceEntry {
  id: string;
  projectId: string;
  type: FinanceEntryType;
  category: FinanceCategory;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: FinanceStatus;
  attachmentName?: string;
  sourceMilestoneId?: string;
  notes?: string;
}

export interface BudgetLine {
  id: string;
  projectId: string;
  category: FinanceCategory;
  plannedAmount: number;
}

export const FINANCE_ENTRY_TYPE_LABELS: Record<FinanceEntryType, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
};

export const FINANCE_CATEGORY_LABELS: Record<FinanceCategory, string> = {
  producao: 'Produção',
  marketing: 'Marketing',
  shows: 'Shows',
  equipe: 'Equipe',
  distribuicao: 'Distribuição',
  juridico: 'Jurídico',
  outros: 'Outros',
};

export const FINANCE_CATEGORY_ORDER: FinanceCategory[] = ['producao', 'marketing', 'shows', 'equipe', 'distribuicao', 'juridico', 'outros'];

export const FINANCE_STATUS_LABELS: Record<FinanceStatus, string> = {
  previsto: 'Previsto',
  pago: 'Pago',
  recebido: 'Recebido',
  atrasado: 'Atrasado',
};

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

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  single: 'Single',
  ep: 'EP',
  album: 'Álbum',
  turne: 'Turnê',
  videoclipe: 'Videoclipe',
  campanha: 'Campanha',
  rebranding: 'Rebranding',
  edital: 'Edital',
  captacao: 'Captação',
  show_evento: 'Show/Evento',
};

export const PROJECT_TYPE_ORDER: ProjectType[] = ['single', 'ep', 'album', 'turne', 'videoclipe', 'campanha', 'rebranding', 'edital', 'captacao', 'show_evento'];
