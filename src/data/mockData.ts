import { Artist, BudgetLine, CalendarEvent, CareerPhaseHistoryEntry, FinanceEntry, IndustryContact, Milestone, Pillar, Project, QuarterlyReview, Comment, User, DemandMetrics, SpotifyProfile } from '@/types';

export const mockUser: User = {
  id: 'u1',
  name: 'Rulio Dantas',
  email: 'rulio@consultoria.com',
  role: 'consultor',
};

export const mockArtist: Artist = {
  id: 'a1',
  name: 'RAY EL VOX',
  genre: 'Pop Alternativo / Eletrônico',
  bio: 'Artista emergente com proposta autoral que une influências da música eletrônica com poesia contemporânea.',
  whatsapp: '+55 11 91234-5678',
  createdAt: '2025-01-15',
};

export const mockProject: Project = {
  id: 'p1',
  artistId: 'a1',
  name: 'Projeto RAY EL VOX — Era 1',
  description: 'Desenvolvimento estratégico da primeira era artística, do conceito à monetização.',
  currentQuarter: 1,
  currentYear: 2025,
  stage: 'Definição de Conceito',
  overallProgress: 34,
  createdAt: '2025-01-15',
  careerPhase: 'experimentacao',
  projectType: 'album',
  bigGoal: 'Consolidar identidade artística e validar conceito com público real em 12 meses.',
  quarterGoal: 'Finalizar conceito artístico, definir público e iniciar narrativa pública.',
  dna: {
    artisticConcept: 'Fusão de eletrônica orgânica com poesia urbana contemporânea. Som que habita entre o digital e o humano.',
    artisticNarrative: 'Uma voz que emerge da cidade digital — traduzindo solidão conectada em frequências que fazem sentir.',
    culturalUniverse: 'Música eletrônica experimental, poesia urbana, arte digital, estética cyberpunk humanista.',
    references: ['James Blake', 'Arca', 'FKA twigs', 'Björk', 'Criolo', 'Liniker'],
    artisticHypothesis: 'Existe um público jovem urbano que busca música eletrônica com profundidade lírica e emocional em português.',
    hypothesisStatus: 'em_validacao',
  },
  positioning: {
    mainGenre: 'Pop Alternativo / Eletrônico',
    subGenre: 'Electro-poesia / Art Pop',
    culturalTerritory: 'Música urbana experimental brasileira com influência global',
    valueProposition: 'O artista que transforma a experiência digital em poesia sonora — para quem sente demais no mundo conectado.',
  },
  audience: {
    ageRange: '20–35 anos',
    culturalScene: 'Cena urbana alternativa, festivais independentes, cultura digital',
    predominantAesthetic: 'Visual futurista humanista, paleta escura com acentos neon, minimalismo expressivo',
    behavior: 'Consumem música via playlists de nicho, valorizam autenticidade, compartilham descobertas',
    mainPlatforms: ['Spotify', 'Instagram', 'TikTok', 'YouTube'],
  },
};

export const mockPillars: Pillar[] = [
  { id: 'pl1', projectId: 'p1', type: 'administrativo', progress: 65, level: 'Avançado', observations: 'Planejamento e estrutura financeira definidos. Falta revisão final do cronograma.' },
  { id: 'pl2', projectId: 'p1', type: 'artistico', progress: 40, level: 'Intermediário', observations: 'Conceito artístico em fase de refinamento. Pesquisa de nicho concluída.' },
  { id: 'pl3', projectId: 'p1', type: 'marketing', progress: 15, level: 'Inicial', observations: 'Narrativa pública ainda não definida. Aguardando consolidação do conceito artístico.' },
  { id: 'pl4', projectId: 'p1', type: 'comercial', progress: 5, level: 'Planejamento', observations: 'Fase de análise de mercado. Estratégia comercial dependente da validação artística.' },
];

export const mockMilestones: Milestone[] = [
  // Administrativo
  {
    id: 'm1', projectId: 'p1', pillarType: 'administrativo', title: 'Diagnóstico Estratégico do Projeto',
    description: 'Análise completa do cenário atual da carreira, pontos fortes, fragilidades e oportunidades.',
    status: 'concluido', progress: 100, startDate: '2025-01-15', deadline: '2025-02-01',
    deliverables: ['Relatório de diagnóstico', 'Mapa de oportunidades'],
    measurableGoal: 'Documento de diagnóstico aprovado pelo artista',
    responsible: 'Consultor', priority: 'alta', tags: ['estratégia', 'análise'], order: 1,
    subtasks: [
      { id: 's1', title: 'Diagnóstico estratégico concluído', completed: true },
      { id: 's2', title: 'Mapa de oportunidades elaborado', completed: true },
      { id: 's3', title: 'Relatório aprovado pelo artista', completed: true },
    ],
  },
  {
    id: 'm2', projectId: 'p1', pillarType: 'administrativo', title: 'Definição da Grande Meta da Carreira',
    description: 'Definir o objetivo macro da carreira nos próximos 12-24 meses.',
    status: 'concluido', progress: 100, startDate: '2025-02-01', deadline: '2025-02-15',
    deliverables: ['Documento de meta principal', 'KPIs de acompanhamento'],
    measurableGoal: 'Meta e KPIs validados',
    responsible: 'Consultor + Artista', priority: 'critica', tags: ['meta', 'visão'], order: 2,
    subtasks: [
      { id: 's4', title: 'Grande meta definida', completed: true },
      { id: 's5', title: 'KPIs de acompanhamento criados', completed: true },
    ],
  },
  {
    id: 'm3', projectId: 'p1', pillarType: 'administrativo', title: 'Planejamento Estratégico',
    description: 'Cronograma macro com fases, marcos e entregas por trimestre.',
    status: 'em_andamento', progress: 60, startDate: '2025-02-15', deadline: '2025-03-15',
    deliverables: ['Cronograma trimestral', 'Plano de ação'],
    measurableGoal: 'Plano aprovado e iniciado',
    responsible: 'Consultor', priority: 'alta', tags: ['planejamento'], order: 3,
    subtasks: [
      { id: 's6', title: 'Planejamento anual estruturado', completed: true },
      { id: 's7', title: 'Cronograma trimestral definido', completed: true },
      { id: 's8', title: 'Plano de ação detalhado', completed: false },
    ],
  },
  {
    id: 'm4', projectId: 'p1', pillarType: 'administrativo', title: 'Estrutura Financeira do Projeto',
    description: 'Definição de orçamento, fontes de receita e investimento necessário.',
    status: 'nao_iniciado', progress: 0, startDate: '2025-03-15', deadline: '2025-04-01',
    deliverables: ['Planilha financeira', 'Projeção de custos'],
    measurableGoal: 'Budget aprovado',
    responsible: 'Consultor', priority: 'media', tags: ['finanças'], order: 4,
    subtasks: [
      { id: 's9', title: 'Orçamento de lançamentos definido', completed: false },
      { id: 's10', title: 'Projeção de custos elaborada', completed: false },
    ],
  },

  // Artístico
  {
    id: 'm5', projectId: 'p1', pillarType: 'artistico', title: 'Pesquisa Profunda do Universo Cultural',
    description: 'Mapeamento de referências, influências, estética e universo cultural do artista.',
    status: 'concluido', progress: 100, startDate: '2025-01-20', deadline: '2025-02-20',
    deliverables: ['Moodboard', 'Mapa de referências', 'Análise de mercado'],
    measurableGoal: 'Relatório de pesquisa completo',
    responsible: 'Consultor + Artista', priority: 'alta', tags: ['pesquisa', 'conceito'], order: 1,
    subtasks: [
      { id: 's11', title: 'Pesquisa profunda do universo cultural', completed: true },
      { id: 's12', title: 'Entrevistas presenciais com público do nicho', completed: true },
      { id: 's13', title: 'Mapeamento de referências culturais', completed: true },
    ],
  },
  {
    id: 'm6', projectId: 'p1', pillarType: 'artistico', title: 'Definição Precisa do Conceito Artístico',
    description: 'Consolidação da identidade artística: narrativa, estética, sonoridade e posicionamento.',
    status: 'em_andamento', progress: 45, startDate: '2025-02-20', deadline: '2025-03-20',
    deliverables: ['Manifesto artístico', 'Guia de identidade visual', 'Direção sonora'],
    measurableGoal: 'Conceito artístico documentado e validado',
    responsible: 'Artista', priority: 'critica', tags: ['conceito', 'identidade'], order: 2,
    subtasks: [
      { id: 's14', title: 'Conceito artístico definido', completed: true },
      { id: 's15', title: 'Narrativa artística definida', completed: false },
      { id: 's16', title: 'Manifesto artístico escrito', completed: false },
      { id: 's17', title: 'Direção sonora consolidada', completed: false },
    ],
  },
  {
    id: 'm7', projectId: 'p1', pillarType: 'artistico', title: 'Definição do Público do Projeto',
    description: 'Mapeamento detalhado do público-alvo: demografia, comportamento, interesses.',
    status: 'nao_iniciado', progress: 0, startDate: '2025-03-20', deadline: '2025-04-10',
    deliverables: ['Persona do público', 'Mapa de comportamento'],
    measurableGoal: 'Personas definidas e validadas',
    responsible: 'Consultor', priority: 'alta', tags: ['público', 'estratégia'], order: 3,
    subtasks: [
      { id: 's18', title: 'Público definido', completed: false },
      { id: 's19', title: 'Personas elaboradas', completed: false },
    ],
  },
  {
    id: 'm8', projectId: 'p1', pillarType: 'artistico', title: 'Repertório e Obra Musical Finalizada',
    description: 'Composição, produção e masterização do repertório da primeira era.',
    status: 'nao_iniciado', progress: 0, deadline: '2025-06-30',
    deliverables: ['Músicas finalizadas', 'Registro de faixas'],
    measurableGoal: 'Mínimo 5 faixas finalizadas',
    responsible: 'Artista', priority: 'alta', tags: ['produção', 'música'], order: 4,
    subtasks: [
      { id: 's20', title: 'Repertório estruturado', completed: false },
      { id: 's21', title: 'Produção musical iniciada', completed: false },
      { id: 's22', title: 'Produção finalizada', completed: false },
    ],
  },

  // Marketing
  {
    id: 'm9', projectId: 'p1', pillarType: 'marketing', title: 'Narrativa Pública do Projeto',
    description: 'Definição da história pública do artista e como será comunicada.',
    status: 'em_andamento', progress: 25, startDate: '2025-03-01', deadline: '2025-04-15',
    deliverables: ['Documento de narrativa', 'Guia de tom de voz'],
    measurableGoal: 'Narrativa aprovada',
    responsible: 'Consultor', priority: 'alta', tags: ['narrativa', 'comunicação'], order: 1,
    subtasks: [
      { id: 's23', title: 'Narrativa pública definida', completed: false },
      { id: 's24', title: 'Guia de tom de voz criado', completed: false },
      { id: 's25', title: 'Estratégia de retenção definida', completed: false },
      { id: 's26', title: 'Construção de superfãs planejada', completed: false },
    ],
  },
  {
    id: 'm10', projectId: 'p1', pillarType: 'marketing', title: 'Estratégia de Conteúdo e Lançamento',
    description: 'Plano de conteúdo para redes, estratégia de lançamento de singles e projeto.',
    status: 'nao_iniciado', progress: 0, deadline: '2025-05-30',
    deliverables: ['Calendário editorial', 'Plano de lançamento'],
    measurableGoal: 'Plano aprovado com datas definidas',
    responsible: 'Consultor', priority: 'media', tags: ['conteúdo', 'lançamento'], order: 2,
    subtasks: [
      { id: 's27', title: 'Estratégia de conteúdo estruturada', completed: false },
      { id: 's28', title: 'Planejamento de lançamento definido', completed: false },
    ],
  },

  // Comercial
  {
    id: 'm11', projectId: 'p1', pillarType: 'comercial', title: 'Validação de Público',
    description: 'Testar receptividade do público através de lançamentos estratégicos e eventos.',
    status: 'nao_iniciado', progress: 0, deadline: '2025-07-31',
    deliverables: ['Relatório de métricas', 'Análise de engajamento'],
    measurableGoal: 'Mínimo 1000 ouvintes orgânicos',
    responsible: 'Consultor + Artista', priority: 'media', tags: ['validação', 'métricas'], order: 1,
    subtasks: [
      { id: 's29', title: 'Primeiro show validado', completed: false },
      { id: 's30', title: 'Primeiro público pagante', completed: false },
      { id: 's31', title: 'Primeira venda relevante de ingressos', completed: false },
    ],
  },
  {
    id: 'm12', projectId: 'p1', pillarType: 'comercial', title: 'Monetização da Carreira',
    description: 'Estruturar fontes de receita: shows, streaming, marcas, licenciamento.',
    status: 'nao_iniciado', progress: 0, deadline: '2025-09-30',
    deliverables: ['Plano de monetização', 'Propostas comerciais'],
    measurableGoal: 'Primeira receita gerada',
    responsible: 'Consultor', priority: 'media', tags: ['monetização', 'receita'], order: 2,
    subtasks: [
      { id: 's32', title: 'Primeira parceria com marca', completed: false },
      { id: 's33', title: 'Primeiro licenciamento ou sincronização', completed: false },
    ],
  },
];

export const mockQuarterlyReview: QuarterlyReview = {
  id: 'qr1',
  projectId: 'p1',
  quarter: 1,
  year: 2025,
  pillarReviews: [
    { pillarType: 'administrativo', summary: 'Base sólida. Falta estrutura financeira.', progress: 65, previousProgress: 0 },
    { pillarType: 'artistico', summary: 'Em progresso. Conceito precisa de finalização.', progress: 40, previousProgress: 0 },
    { pillarType: 'marketing', summary: 'Início tímido. Narrativa em construção.', progress: 15, previousProgress: 0 },
    { pillarType: 'comercial', summary: 'Ainda em planejamento. Dependente dos demais pilares.', progress: 5, previousProgress: 0 },
  ],
};

export const mockComments: Comment[] = [
  { id: 'c1', milestoneId: 'm6', userId: 'u1', userName: 'Rulio Dantas', content: 'O conceito precisa ser mais afiado. Sugiro revisitar as referências do moodboard e focar em 3 palavras-chave que definam a essência.', createdAt: '2025-03-05T14:30:00' },
  { id: 'c2', milestoneId: 'm6', userId: 'u1', userName: 'Rulio Dantas', content: 'Artista trouxe novas referências visuais excelentes. Direção sonora ficando mais clara.', createdAt: '2025-03-10T10:15:00' },
  { id: 'c3', milestoneId: 'm3', userId: 'u1', userName: 'Rulio Dantas', content: 'Cronograma precisa ser revisado para acomodar o atraso na definição do conceito artístico.', createdAt: '2025-03-08T16:00:00' },
];

export const mockDemandMetrics: DemandMetrics[] = [
  {
    month: '2025-01',
    shows: { requested: 0, confirmed: 0, ticketsSold: 0, vipGuests: 0 },
    streaming: { monthlyListeners: 0, followers: 12, saves: 0, playlistAdds: 0, preSaves: 0 },
    community: { superFansActive: 0, closedGroup: 0, shares: 0, campaignParticipation: 0 },
    monetization: { streamingRoyalties: 0, publicPerformance: 0, publishing: 0, sync: 0, brands: 0, licensing: 0 },
  },
  {
    month: '2025-02',
    shows: { requested: 1, confirmed: 0, ticketsSold: 0, vipGuests: 0 },
    streaming: { monthlyListeners: 45, followers: 38, saves: 8, playlistAdds: 2, preSaves: 0 },
    community: { superFansActive: 3, closedGroup: 0, shares: 5, campaignParticipation: 0 },
    monetization: { streamingRoyalties: 0, publicPerformance: 0, publishing: 0, sync: 0, brands: 0, licensing: 0 },
  },
  {
    month: '2025-03',
    shows: { requested: 2, confirmed: 1, ticketsSold: 0, vipGuests: 5 },
    streaming: { monthlyListeners: 120, followers: 85, saves: 22, playlistAdds: 5, preSaves: 15 },
    community: { superFansActive: 8, closedGroup: 12, shares: 18, campaignParticipation: 4 },
    monetization: { streamingRoyalties: 12.50, publicPerformance: 0, publishing: 0, sync: 0, brands: 0, licensing: 0 },
  },
];

export const mockSpotifyProfile: SpotifyProfile = {
  artistId: 'a1',
  profileUrl: 'https://open.spotify.com/artist/rayelvox',
  verified: false,
  monthlyListeners: 120,
  followers: 85,
  topTracks: [
    { id: 'st1', title: 'Frequência Humana', streams: 18500, releaseDate: '2025-02-14' },
    { id: 'st2', title: 'Cidade Digital', streams: 9200, releaseDate: '2024-11-01' },
    { id: 'st3', title: 'Solidão Conectada', streams: 4100, releaseDate: '2024-08-20' },
  ],
  playlists: [
    { id: 'spl1', playlistName: 'Novidade Indie BR', curator: 'Editorial Spotify', followers: 84000 },
    { id: 'spl2', playlistName: 'Eletrônica Poética', curator: 'Nicho', followers: 6200 },
  ],
};

export const mockIndustryContacts: IndustryContact[] = [
  {
    id: 'ic1', projectId: 'p1', name: 'Marina Costa', category: 'produtor',
    company: 'Estúdio Voz Digital', role: 'Produtora musical',
    whatsapp: '+55 11 98765-4321', email: 'marina@vozdigital.com.br',
    notes: 'Produzindo as sessões de estúdio do repertório inicial.',
    lastContactDate: '2025-03-05',
  },
  {
    id: 'ic2', projectId: 'p1', name: 'Diego Almeida', category: 'booker',
    company: 'Agência ON Shows', role: 'Booker',
    email: 'diego@onshows.com.br',
    notes: 'Em prospecção — enviado press kit para avaliação de datas.',
    lastContactDate: '2025-02-20',
  },
  {
    id: 'ic3', projectId: 'p1', name: 'Fernanda Reis', category: 'imprensa',
    company: 'Blog Synth BR', role: 'Editora de música eletrônica',
    whatsapp: '+55 21 99887-6655',
    notes: 'Publicou uma resenha do primeiro single.',
    lastContactDate: '2025-03-10',
  },
];

export const mockCareerPhaseHistory: CareerPhaseHistoryEntry[] = [
  { id: 'ch1', projectId: 'p1', phase: 'definicao_mda', startedAt: '2025-01-15', note: 'Diagnóstico estratégico iniciado.' },
  { id: 'ch2', projectId: 'p1', phase: 'experimentacao', startedAt: '2025-02-01', note: 'Conceito artístico e pesquisa de nicho concluídos.' },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'ce1', projectId: 'p1', type: 'reuniao', title: 'Alinhamento estratégico trimestral', date: '2025-03-10', notes: 'Revisão de andamento dos pilares Administrativo e Artístico.' },
  { id: 'ce2', projectId: 'p1', type: 'show', title: 'Show de validação — casa pequena', date: '2025-04-20', notes: 'Primeiro teste de recepção do público ao repertório.' },
  { id: 'ce3', projectId: 'p1', type: 'lancamento', title: 'Lançamento do primeiro single', date: '2025-05-15' },
  { id: 'ce4', projectId: 'p1', type: 'avaliacao_trimestral', title: 'Avaliação do Q1 2025', date: '2025-03-31' },
];

export const mockBudgetLines: BudgetLine[] = [
  { id: 'bl1', projectId: 'p1', category: 'producao', plannedAmount: 8000 },
  { id: 'bl2', projectId: 'p1', category: 'marketing', plannedAmount: 4000 },
  { id: 'bl3', projectId: 'p1', category: 'shows', plannedAmount: 2000 },
  { id: 'bl4', projectId: 'p1', category: 'equipe', plannedAmount: 3000 },
  { id: 'bl5', projectId: 'p1', category: 'distribuicao', plannedAmount: 500 },
  { id: 'bl6', projectId: 'p1', category: 'juridico', plannedAmount: 1500 },
  { id: 'bl7', projectId: 'p1', category: 'outros', plannedAmount: 1000 },
];

export const mockFinanceEntries: FinanceEntry[] = [
  { id: 'fe1', projectId: 'p1', type: 'despesa', category: 'producao', description: 'Estúdio de gravação — sessões iniciais', amount: 3200, dueDate: '2025-02-10', paidDate: '2025-02-10', status: 'pago' },
  { id: 'fe2', projectId: 'p1', type: 'despesa', category: 'juridico', description: 'Registro de obra e contratos', amount: 1200, dueDate: '2025-02-20', paidDate: '2025-02-18', status: 'pago' },
  { id: 'fe3', projectId: 'p1', type: 'despesa', category: 'marketing', description: 'Identidade visual e moodboard', amount: 1800, dueDate: '2025-03-15', status: 'previsto' },
  { id: 'fe4', projectId: 'p1', type: 'despesa', category: 'equipe', description: 'Consultoria estratégica — Q1', amount: 2500, dueDate: '2025-03-31', status: 'atrasado' },
  { id: 'fe5', projectId: 'p1', type: 'receita', category: 'shows', description: 'Cachê — show de validação', amount: 800, dueDate: '2025-04-20', paidDate: '2025-04-22', status: 'recebido' },
  { id: 'fe6', projectId: 'p1', type: 'despesa', category: 'distribuicao', description: 'Distribuição digital — taxa anual', amount: 300, dueDate: '2025-05-01', status: 'previsto' },
];

// Helper: calculate pillar progress from milestones
export function calculatePillarProgress(pillarType: string, milestones: Milestone[]): number {
  const pillarMilestones = milestones.filter(m => m.pillarType === pillarType);
  if (pillarMilestones.length === 0) return 0;

  const totalSubtasks = pillarMilestones.reduce((sum, m) => {
    if (m.subtasks && m.subtasks.length > 0) return sum + m.subtasks.length;
    return sum + 1; // count milestone itself as 1 task
  }, 0);

  const completedSubtasks = pillarMilestones.reduce((sum, m) => {
    if (m.subtasks && m.subtasks.length > 0) return sum + m.subtasks.filter(s => s.completed).length;
    return sum + (m.status === 'concluido' ? 1 : 0);
  }, 0);

  return Math.round((completedSubtasks / totalSubtasks) * 100);
}

// Helper: calculate overall progress
export function calculateOverallProgress(milestones: Milestone[]): number {
  const allSubtasks = milestones.reduce((sum, m) => {
    if (m.subtasks && m.subtasks.length > 0) return sum + m.subtasks.length;
    return sum + 1;
  }, 0);

  const completed = milestones.reduce((sum, m) => {
    if (m.subtasks && m.subtasks.length > 0) return sum + m.subtasks.filter(s => s.completed).length;
    return sum + (m.status === 'concluido' ? 1 : 0);
  }, 0);

  return allSubtasks === 0 ? 0 : Math.round((completed / allSubtasks) * 100);
}
