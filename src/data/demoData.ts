import {
  Artist,
  BudgetLine,
  CalendarEvent,
  CareerPhaseHistoryEntry,
  DemandMetrics,
  FinanceEntry,
  IndustryContact,
  Milestone,
  Pillar,
  Project,
  QuarterlyReview,
  SpotifyProfile,
} from '@/types';

// Segundo conjunto de dados mock, usado apenas na rota /demo — um caso de sucesso
// fictício, mais avançado e "bonito" que o seed padrão (RAY EL VOX), para prospects
// explorarem o produto já populado. Nunca é misturado com o dataset padrão.

export const demoArtist: Artist = {
  id: 'a-demo',
  name: 'NOVA LUNA',
  genre: 'Pop Urbano / R&B Alternativo',
  bio: 'Projeto autoral que consolidou identidade própria, tração de público e as primeiras receitas relevantes de carreira em pouco mais de um ano de trabalho estruturado.',
  whatsapp: '+55 21 98888-4321',
  createdAt: '2024-06-01',
};

export const demoProject: Project = {
  id: 'p-demo',
  artistId: 'a-demo',
  name: 'Projeto NOVA LUNA — Era 2',
  description: 'Consolidação da segunda era artística: expansão de público, monetização e primeiras parcerias comerciais.',
  currentQuarter: 2,
  currentYear: 2026,
  stage: 'Tração de Mercado',
  overallProgress: 87,
  createdAt: '2024-06-01',
  careerPhase: 'tracao',
  projectType: 'campanha',
  bigGoal: 'Consolidar NOVA LUNA como referência de nicho no pop urbano nacional e viabilizar a primeira turnê própria em 18 meses.',
  quarterGoal: 'Fechar a segunda parceria com marca, manter crescimento de público em todas as plataformas e estruturar a turnê da Era 2.',
  dna: {
    artisticConcept: 'Pop urbano com groove de R&B e letras diretas sobre desejo, cidade e autoconfiança — som feito para tocar alto e dançar sozinha em frente ao espelho.',
    artisticNarrative: 'Uma artista que virou a própria lua cheia da cena — da timidez ao palco lotado, sem perder a crueza da voz.',
    culturalUniverse: 'R&B contemporâneo, pop urbano brasileiro, cultura de dança e moda streetwear, estética noturna e glamourosa.',
    references: ['SZA', 'Anitta', 'Ludmilla', 'Doja Cat', 'Iza'],
    artisticHypothesis: 'Existe um público jovem que busca pop urbano em português com produção de altíssima qualidade e narrativa de autoestima.',
    hypothesisStatus: 'validada',
  },
  positioning: {
    mainGenre: 'Pop Urbano / R&B Alternativo',
    subGenre: 'R&B Pop / Groove Brasileiro',
    culturalTerritory: 'Cena urbana nacional com apelo de rádio e playlists de nicho de R&B/Pop',
    valueProposition: 'A voz que transformou autoestima em hit — pop urbano brasileiro com groove, atitude e produção de primeira linha.',
  },
  audience: {
    ageRange: '18–29 anos',
    culturalScene: 'Cena urbana de festas, baladas e cultura de dança, forte presença em playlists de academia e "get ready with me"',
    predominantAesthetic: 'Glamour noturno, streetwear, cores vibrantes, estética de clipe de alta produção',
    behavior: 'Consomem em playlists de humor, replicam coreografias em vídeos curtos, compram ingresso rápido para shows pequenos',
    mainPlatforms: ['Spotify', 'TikTok', 'Instagram', 'YouTube'],
  },
};

export const demoPillars: Pillar[] = [
  { id: 'dpl1', projectId: 'p-demo', type: 'administrativo', progress: 75, level: 'Avançado', observations: 'Estrutura financeira e contratos consolidados. Revisão de parcerias em andamento.' },
  { id: 'dpl2', projectId: 'p-demo', type: 'artistico', progress: 75, level: 'Avançado', observations: 'Repertório da Era 2 finalizado. Produção da Era 3 já iniciada.' },
  { id: 'dpl3', projectId: 'p-demo', type: 'marketing', progress: 100, level: 'Consolidado', observations: 'Campanha de lançamento da Era 2 concluída com forte resposta de público.' },
  { id: 'dpl4', projectId: 'p-demo', type: 'comercial', progress: 100, level: 'Consolidado', observations: 'Monetização estruturada e primeira parceria de marca fechada.' },
];

export const demoMilestones: Milestone[] = [
  // Administrativo
  { id: 'dm1', projectId: 'p-demo', pillarType: 'administrativo', title: 'Diagnóstico Estratégico do Projeto', description: 'Análise completa do cenário de carreira e oportunidades.', status: 'concluido', progress: 100, startDate: '2024-06-01', deadline: '2024-06-20', responsible: 'Consultor', priority: 'alta', order: 1 },
  { id: 'dm2', projectId: 'p-demo', pillarType: 'administrativo', title: 'Definição da Grande Meta da Carreira', description: 'Objetivo macro para os próximos 18-24 meses.', status: 'concluido', progress: 100, startDate: '2024-06-20', deadline: '2024-07-10', responsible: 'Consultor + Artista', priority: 'critica', order: 2 },
  { id: 'dm3', projectId: 'p-demo', pillarType: 'administrativo', title: 'Estrutura Financeira e Empresarial', description: 'Formalização de empresa, contratos e fluxo financeiro.', status: 'concluido', progress: 100, startDate: '2024-11-01', deadline: '2025-01-15', responsible: 'Consultor', priority: 'alta', order: 3 },
  { id: 'dm4', projectId: 'p-demo', pillarType: 'administrativo', title: 'Revisão de Contratos e Parcerias', description: 'Atualização de contratos vigentes com selo, produtores e agenciamento.', status: 'em_andamento', progress: 60, startDate: '2026-05-01', deadline: '2026-07-30', responsible: 'Consultor', priority: 'media', order: 4 },

  // Artístico
  { id: 'dm5', projectId: 'p-demo', pillarType: 'artistico', title: 'Pesquisa Profunda do Universo Cultural', description: 'Mapeamento de referências e território estético.', status: 'concluido', progress: 100, startDate: '2024-06-05', deadline: '2024-07-01', responsible: 'Consultor + Artista', priority: 'alta', order: 1 },
  { id: 'dm6', projectId: 'p-demo', pillarType: 'artistico', title: 'Conceito Artístico Consolidado', description: 'Identidade, narrativa e direção sonora definidas.', status: 'concluido', progress: 100, startDate: '2024-07-01', deadline: '2024-09-15', responsible: 'Artista', priority: 'critica', order: 2 },
  { id: 'dm7', projectId: 'p-demo', pillarType: 'artistico', title: 'Repertório da Era 2 Finalizado', description: 'Composição, produção e masterização do repertório.', status: 'concluido', progress: 100, startDate: '2025-03-01', deadline: '2025-08-01', responsible: 'Artista', priority: 'alta', order: 3 },
  { id: 'dm8', projectId: 'p-demo', pillarType: 'artistico', title: 'Novo Repertório (Era 3) em Produção', description: 'Composição e pré-produção da próxima era.', status: 'em_andamento', progress: 35, startDate: '2026-04-01', deadline: '2026-09-30', responsible: 'Artista', priority: 'media', order: 4 },

  // Marketing
  { id: 'dm9', projectId: 'p-demo', pillarType: 'marketing', title: 'Narrativa Pública Lançada', description: 'História pública do artista comunicada ao mercado.', status: 'concluido', progress: 100, startDate: '2025-01-15', deadline: '2025-03-01', responsible: 'Consultor', priority: 'critica', order: 1 },
  { id: 'dm10', projectId: 'p-demo', pillarType: 'marketing', title: 'Estratégia de Conteúdo Multiplataforma', description: 'Calendário editorial e produção recorrente de conteúdo.', status: 'concluido', progress: 100, startDate: '2025-04-01', deadline: '2025-06-01', responsible: 'Consultor', priority: 'alta', order: 2 },
  { id: 'dm11', projectId: 'p-demo', pillarType: 'marketing', title: 'Campanha de Lançamento Era 2', description: 'Campanha 360º de lançamento com forte resposta de público.', status: 'concluido', progress: 100, startDate: '2025-12-01', deadline: '2026-02-20', responsible: 'Consultor', priority: 'critica', order: 3 },

  // Comercial
  { id: 'dm12', projectId: 'p-demo', pillarType: 'comercial', title: 'Validação de Público em Shows', description: 'Testes de receptividade em shows de médio porte.', status: 'concluido', progress: 100, startDate: '2025-03-01', deadline: '2025-05-01', responsible: 'Consultor + Artista', priority: 'critica', order: 1 },
  { id: 'dm13', projectId: 'p-demo', pillarType: 'comercial', title: 'Monetização via Streaming e Shows', description: 'Estruturação de fontes de receita recorrente.', status: 'concluido', progress: 100, startDate: '2025-08-01', deadline: '2025-11-01', responsible: 'Consultor', priority: 'alta', order: 2 },
  { id: 'dm14', projectId: 'p-demo', pillarType: 'comercial', title: 'Parceria com Marca Nacional Fechada', description: 'Primeiro contrato de brand deal relevante assinado.', status: 'concluido', progress: 100, startDate: '2026-01-05', deadline: '2026-03-10', responsible: 'Consultor', priority: 'critica', order: 3 },
  { id: 'dm15', projectId: 'p-demo', pillarType: 'comercial', title: 'Estruturação da Turnê Nacional', description: 'Roteiro, orçamento e casas fechadas para a primeira turnê própria.', status: 'concluido', progress: 100, startDate: '2026-02-01', deadline: '2026-04-30', responsible: 'Consultor', priority: 'alta', order: 4 },
];

export const demoIndustryContacts: IndustryContact[] = [
  {
    id: 'dic1', projectId: 'p-demo', name: 'Rafael Nunes', category: 'produtor',
    company: 'Estúdio Aurora', role: 'Produtor musical',
    whatsapp: '+55 21 97654-3210', email: 'rafael@estudioaurora.com.br',
    notes: 'Produziu o repertório completo da Era 2 e já está no pré-produção da Era 3.',
    lastContactDate: '2026-06-10',
  },
  {
    id: 'dic2', projectId: 'p-demo', name: 'Camila Torres', category: 'booker',
    company: 'Booking Nacional', role: 'Bookera de turnê',
    whatsapp: '+55 11 96543-2109', email: 'camila@bookingnacional.com.br',
    notes: 'Estruturando o roteiro e as datas da turnê nacional.',
    lastContactDate: '2026-07-05',
  },
  {
    id: 'dic3', projectId: 'p-demo', name: 'Bianca Ferreira', category: 'imprensa',
    company: 'Revista Ritmo', role: 'Editora-chefe',
    email: 'bianca@revistaritmo.com.br',
    notes: 'Cobriu a campanha de lançamento da Era 2 com destaque de capa.',
    lastContactDate: '2026-02-15',
  },
  {
    id: 'dic4', projectId: 'p-demo', name: 'Thiago Prado', category: 'marca',
    company: 'Marca Nacional de Bebidas', role: 'Gerente de Marketing',
    whatsapp: '+55 11 95432-1098', email: 'thiago.prado@marcanacional.com.br',
    notes: 'Contato responsável pela parceria de marca fechada em março.',
    lastContactDate: '2026-03-12',
  },
];

export const demoCareerPhaseHistory: CareerPhaseHistoryEntry[] = [
  { id: 'dch1', projectId: 'p-demo', phase: 'definicao_mda', startedAt: '2024-06-01', note: 'Diagnóstico estratégico e grande meta definidos.' },
  { id: 'dch2', projectId: 'p-demo', phase: 'experimentacao', startedAt: '2024-08-15', note: 'Conceito artístico e universo cultural consolidados.' },
  { id: 'dch3', projectId: 'p-demo', phase: 'validacao_sva', startedAt: '2024-11-15', note: 'Estrutura financeira formalizada.' },
  { id: 'dch4', projectId: 'p-demo', phase: 'organizacao', startedAt: '2025-02-01', note: 'Narrativa pública e conteúdo estruturados.' },
  { id: 'dch5', projectId: 'p-demo', phase: 'execucao', startedAt: '2025-06-01', note: 'Repertório da Era 2 finalizado e validação de público em shows.' },
  { id: 'dch6', projectId: 'p-demo', phase: 'consolidacao', startedAt: '2025-10-01', note: 'Monetização recorrente estruturada.' },
  { id: 'dch7', projectId: 'p-demo', phase: 'tracao', startedAt: '2026-02-01', note: 'Campanha da Era 2 e primeira parceria de marca fechadas.' },
];

export const demoQuarterlyReview: QuarterlyReview = {
  id: 'dqr1',
  projectId: 'p-demo',
  quarter: 2,
  year: 2026,
  pillarReviews: [
    { pillarType: 'administrativo', summary: 'Estrutura consolidada. Revisão de contratos em andamento.', progress: 75, previousProgress: 50 },
    { pillarType: 'artistico', summary: 'Era 2 finalizada. Produção da Era 3 iniciada.', progress: 75, previousProgress: 55 },
    { pillarType: 'marketing', summary: 'Campanha de lançamento concluída com forte resposta de público.', progress: 100, previousProgress: 70 },
    { pillarType: 'comercial', summary: 'Monetização estruturada e primeira marca fechada.', progress: 100, previousProgress: 65 },
  ],
};

export const demoDemandMetrics: DemandMetrics[] = [
  {
    month: '2026-01',
    shows: { requested: 4, confirmed: 2, ticketsSold: 150, vipGuests: 10 },
    streaming: { monthlyListeners: 15200, followers: 8100, saves: 1200, playlistAdds: 80, preSaves: 200 },
    community: { superFansActive: 320, closedGroup: 150, shares: 420, campaignParticipation: 60 },
    monetization: { streamingRoyalties: 320, publicPerformance: 0, publishing: 0, sync: 0, brands: 0, licensing: 0 },
  },
  {
    month: '2026-02',
    shows: { requested: 6, confirmed: 4, ticketsSold: 480, vipGuests: 18 },
    streaming: { monthlyListeners: 21400, followers: 11200, saves: 1900, playlistAdds: 140, preSaves: 340 },
    community: { superFansActive: 560, closedGroup: 280, shares: 780, campaignParticipation: 130 },
    monetization: { streamingRoyalties: 680, publicPerformance: 150, publishing: 0, sync: 0, brands: 0, licensing: 0 },
  },
  {
    month: '2026-03',
    shows: { requested: 8, confirmed: 6, ticketsSold: 920, vipGuests: 30 },
    streaming: { monthlyListeners: 27800, followers: 14600, saves: 2600, playlistAdds: 190, preSaves: 480 },
    community: { superFansActive: 880, closedGroup: 460, shares: 1240, campaignParticipation: 210 },
    monetization: { streamingRoyalties: 1180, publicPerformance: 420, publishing: 180, sync: 0, brands: 4200, licensing: 0 },
  },
  {
    month: '2026-04',
    shows: { requested: 10, confirmed: 7, ticketsSold: 1380, vipGuests: 46 },
    streaming: { monthlyListeners: 33500, followers: 17800, saves: 3200, playlistAdds: 250, preSaves: 610 },
    community: { superFansActive: 1200, closedGroup: 620, shares: 1780, campaignParticipation: 290 },
    monetization: { streamingRoyalties: 1720, publicPerformance: 720, publishing: 340, sync: 600, brands: 4200, licensing: 200 },
  },
  {
    month: '2026-05',
    shows: { requested: 12, confirmed: 9, ticketsSold: 1920, vipGuests: 64 },
    streaming: { monthlyListeners: 38100, followers: 20100, saves: 3700, playlistAdds: 300, preSaves: 760 },
    community: { superFansActive: 1520, closedGroup: 760, shares: 2200, campaignParticipation: 360 },
    monetization: { streamingRoyalties: 2280, publicPerformance: 960, publishing: 480, sync: 1100, brands: 8000, licensing: 500 },
  },
  {
    month: '2026-06',
    shows: { requested: 14, confirmed: 10, ticketsSold: 2400, vipGuests: 80 },
    streaming: { monthlyListeners: 42300, followers: 22400, saves: 4200, playlistAdds: 340, preSaves: 900 },
    community: { superFansActive: 1800, closedGroup: 900, shares: 2600, campaignParticipation: 420 },
    monetization: { streamingRoyalties: 2810, publicPerformance: 1200, publishing: 600, sync: 1500, brands: 8000, licensing: 900 },
  },
];

export const demoCalendarEvents: CalendarEvent[] = [
  {
    id: 'dce1', projectId: 'p-demo', type: 'reuniao', title: 'Alinhamento estratégico Q2', date: '2026-04-10',
    notes: 'Revisão da campanha da Era 2 e planejamento da turnê.',
    participants: ['Rulio Dantas', 'NOVA LUNA', 'Produtor Executivo'],
    decisions: 'Aprovado orçamento da turnê nacional e definida janela de shows para o segundo semestre.',
    checklist: [
      { id: 'dcl1', label: 'Revisar orçamento da turnê', completed: true },
      { id: 'dcl2', label: 'Validar datas com casas parceiras', completed: true },
      { id: 'dcl3', label: 'Confirmar equipe técnica', completed: false },
    ],
    nextActions: ['Fechar contrato com equipe técnica da turnê', 'Enviar proposta revisada para 3 casas de show'],
  },
  { id: 'dce2', projectId: 'p-demo', type: 'show', title: 'Show de encerramento da Era 2 — Casa Grande', date: '2026-05-22', notes: 'Show com casa cheia e transmissão ao vivo.', participants: ['NOVA LUNA', 'Equipe técnica'] },
  { id: 'dce3', projectId: 'p-demo', type: 'lancamento', title: 'Lançamento do single "Lua Cheia"', date: '2026-06-05' },
  { id: 'dce4', projectId: 'p-demo', type: 'avaliacao_trimestral', title: 'Avaliação do Q2 2026', date: '2026-06-30' },
];

export const demoBudgetLines: BudgetLine[] = [
  { id: 'dbl1', projectId: 'p-demo', category: 'producao', plannedAmount: 40000 },
  { id: 'dbl2', projectId: 'p-demo', category: 'marketing', plannedAmount: 25000 },
  { id: 'dbl3', projectId: 'p-demo', category: 'shows', plannedAmount: 30000 },
  { id: 'dbl4', projectId: 'p-demo', category: 'equipe', plannedAmount: 20000 },
  { id: 'dbl5', projectId: 'p-demo', category: 'distribuicao', plannedAmount: 3000 },
  { id: 'dbl6', projectId: 'p-demo', category: 'juridico', plannedAmount: 8000 },
  { id: 'dbl7', projectId: 'p-demo', category: 'outros', plannedAmount: 5000 },
];

export const demoFinanceEntries: FinanceEntry[] = [
  { id: 'dfe1', projectId: 'p-demo', type: 'despesa', category: 'producao', description: 'Produção do repertório da Era 2', amount: 32000, dueDate: '2025-07-15', paidDate: '2025-07-10', status: 'pago' },
  { id: 'dfe2', projectId: 'p-demo', type: 'despesa', category: 'marketing', description: 'Campanha de lançamento Era 2', amount: 22000, dueDate: '2026-02-10', paidDate: '2026-02-05', status: 'pago' },
  { id: 'dfe3', projectId: 'p-demo', type: 'receita', category: 'shows', description: 'Cachês de shows — 1º semestre 2026', amount: 48000, dueDate: '2026-05-30', paidDate: '2026-05-28', status: 'recebido' },
  { id: 'dfe4', projectId: 'p-demo', type: 'receita', category: 'marketing', description: 'Parceria com marca nacional', amount: 80000, dueDate: '2026-03-10', paidDate: '2026-03-12', status: 'recebido', sourceMilestoneId: 'dm14' },
  { id: 'dfe5', projectId: 'p-demo', type: 'receita', category: 'distribuicao', description: 'Royalties de streaming acumulados', amount: 12500, dueDate: '2026-06-30', paidDate: '2026-06-30', status: 'recebido' },
  { id: 'dfe6', projectId: 'p-demo', type: 'despesa', category: 'equipe', description: 'Equipe técnica — turnê em planejamento', amount: 9000, dueDate: '2026-08-15', status: 'previsto' },
  { id: 'dfe7', projectId: 'p-demo', type: 'despesa', category: 'shows', description: 'Produção técnica — turnê nacional', amount: 18000, dueDate: '2026-09-01', status: 'previsto' },
];

export const demoSpotifyProfile: SpotifyProfile = {
  artistId: 'a-demo',
  profileUrl: 'https://open.spotify.com/artist/novaluna',
  verified: true,
  monthlyListeners: 42300,
  followers: 22400,
  topTracks: [
    { id: 'dst1', title: 'Lua Cheia', streams: 890000, releaseDate: '2026-06-05' },
    { id: 'dst2', title: 'Autoestima', streams: 620000, releaseDate: '2025-09-10' },
    { id: 'dst3', title: 'Groove da Cidade', streams: 410000, releaseDate: '2025-05-22' },
    { id: 'dst4', title: 'Espelho', streams: 275000, releaseDate: '2025-02-01' },
  ],
  playlists: [
    { id: 'dspl1', playlistName: 'Novidade Pop Brasil', curator: 'Editorial Spotify', followers: 1200000 },
    { id: 'dspl2', playlistName: 'R&B Nacional', curator: 'Editorial Spotify', followers: 340000 },
    { id: 'dspl3', playlistName: 'Get Ready With Me', curator: 'Nicho', followers: 98000 },
  ],
};
