import { Artist, Milestone, Pillar, Project, QuarterlyReview, Comment, User } from '@/types';

export const mockUser: User = {
  id: 'u1',
  name: 'Lucas Ferreira',
  email: 'lucas@consultoria.com',
  role: 'consultor',
};

export const mockArtist: Artist = {
  id: 'a1',
  name: 'RAY EL VOX',
  genre: 'Pop Alternativo / Eletrônico',
  bio: 'Artista emergente com proposta autoral que une influências da música eletrônica com poesia contemporânea.',
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
};

export const mockPillars: Pillar[] = [
  { id: 'pl1', projectId: 'p1', type: 'administrativo', progress: 65, level: 'Avançado', observations: 'Planejamento e estrutura financeira definidos. Falta revisão final do cronograma.' },
  { id: 'pl2', projectId: 'p1', type: 'artistico', progress: 40, level: 'Intermediário', observations: 'Conceito artístico em fase de refinamento. Pesquisa de nicho concluída.' },
  { id: 'pl3', projectId: 'p1', type: 'marketing', progress: 15, level: 'Inicial', observations: 'Narrativa pública ainda não definida. Aguardando consolidação do conceito artístico.' },
  { id: 'pl4', projectId: 'p1', type: 'comercial', progress: 5, level: 'Planejamento', observations: 'Fase de análise de mercado. Estratégia comercial dependente da validação artística.' },
];

export const mockMilestones: Milestone[] = [
  // Administrativo
  { id: 'm1', projectId: 'p1', pillarType: 'administrativo', title: 'Diagnóstico Estratégico do Projeto', description: 'Análise completa do cenário atual da carreira, pontos fortes, fragilidades e oportunidades.', status: 'concluido', progress: 100, startDate: '2025-01-15', deadline: '2025-02-01', deliverables: ['Relatório de diagnóstico', 'Mapa de oportunidades'], measurableGoal: 'Documento de diagnóstico aprovado pelo artista', responsible: 'Consultor', priority: 'alta', tags: ['estratégia', 'análise'], order: 1 },
  { id: 'm2', projectId: 'p1', pillarType: 'administrativo', title: 'Definição da Grande Meta da Carreira', description: 'Definir o objetivo macro da carreira nos próximos 12-24 meses.', status: 'concluido', progress: 100, startDate: '2025-02-01', deadline: '2025-02-15', deliverables: ['Documento de meta principal', 'KPIs de acompanhamento'], measurableGoal: 'Meta e KPIs validados', responsible: 'Consultor + Artista', priority: 'critica', tags: ['meta', 'visão'], order: 2 },
  { id: 'm3', projectId: 'p1', pillarType: 'administrativo', title: 'Planejamento Estratégico', description: 'Cronograma macro com fases, marcos e entregas por trimestre.', status: 'em_andamento', progress: 60, startDate: '2025-02-15', deadline: '2025-03-15', deliverables: ['Cronograma trimestral', 'Plano de ação'], measurableGoal: 'Plano aprovado e iniciado', responsible: 'Consultor', priority: 'alta', tags: ['planejamento'], order: 3 },
  { id: 'm4', projectId: 'p1', pillarType: 'administrativo', title: 'Estrutura Financeira do Projeto', description: 'Definição de orçamento, fontes de receita e investimento necessário.', status: 'nao_iniciado', progress: 0, startDate: '2025-03-15', deadline: '2025-04-01', deliverables: ['Planilha financeira', 'Projeção de custos'], measurableGoal: 'Budget aprovado', responsible: 'Consultor', priority: 'media', tags: ['finanças'], order: 4 },

  // Artístico
  { id: 'm5', projectId: 'p1', pillarType: 'artistico', title: 'Pesquisa Profunda do Universo Cultural', description: 'Mapeamento de referências, influências, estética e universo cultural do artista.', status: 'concluido', progress: 100, startDate: '2025-01-20', deadline: '2025-02-20', deliverables: ['Moodboard', 'Mapa de referências', 'Análise de mercado'], measurableGoal: 'Relatório de pesquisa completo', responsible: 'Consultor + Artista', priority: 'alta', tags: ['pesquisa', 'conceito'], order: 1 },
  { id: 'm6', projectId: 'p1', pillarType: 'artistico', title: 'Definição Precisa do Conceito Artístico', description: 'Consolidação da identidade artística: narrativa, estética, sonoridade e posicionamento.', status: 'em_andamento', progress: 45, startDate: '2025-02-20', deadline: '2025-03-20', deliverables: ['Manifesto artístico', 'Guia de identidade visual', 'Direção sonora'], measurableGoal: 'Conceito artístico documentado e validado', responsible: 'Artista', priority: 'critica', tags: ['conceito', 'identidade'], order: 2 },
  { id: 'm7', projectId: 'p1', pillarType: 'artistico', title: 'Definição do Público do Projeto', description: 'Mapeamento detalhado do público-alvo: demografia, comportamento, interesses.', status: 'nao_iniciado', progress: 0, startDate: '2025-03-20', deadline: '2025-04-10', deliverables: ['Persona do público', 'Mapa de comportamento'], measurableGoal: 'Personas definidas e validadas', responsible: 'Consultor', priority: 'alta', tags: ['público', 'estratégia'], order: 3 },
  { id: 'm8', projectId: 'p1', pillarType: 'artistico', title: 'Repertório e Obra Musical Finalizada', description: 'Composição, produção e masterização do repertório da primeira era.', status: 'nao_iniciado', progress: 0, deadline: '2025-06-30', deliverables: ['Músicas finalizadas', 'Registro de faixas'], measurableGoal: 'Mínimo 5 faixas finalizadas', responsible: 'Artista', priority: 'alta', tags: ['produção', 'música'], order: 4 },

  // Marketing
  { id: 'm9', projectId: 'p1', pillarType: 'marketing', title: 'Narrativa Pública do Projeto', description: 'Definição da história pública do artista e como será comunicada.', status: 'em_andamento', progress: 25, startDate: '2025-03-01', deadline: '2025-04-15', deliverables: ['Documento de narrativa', 'Guia de tom de voz'], measurableGoal: 'Narrativa aprovada', responsible: 'Consultor', priority: 'alta', tags: ['narrativa', 'comunicação'], order: 1 },
  { id: 'm10', projectId: 'p1', pillarType: 'marketing', title: 'Estratégia de Conteúdo e Lançamento', description: 'Plano de conteúdo para redes, estratégia de lançamento de singles e projeto.', status: 'nao_iniciado', progress: 0, deadline: '2025-05-30', deliverables: ['Calendário editorial', 'Plano de lançamento'], measurableGoal: 'Plano aprovado com datas definidas', responsible: 'Consultor', priority: 'media', tags: ['conteúdo', 'lançamento'], order: 2 },

  // Comercial
  { id: 'm11', projectId: 'p1', pillarType: 'comercial', title: 'Validação de Público', description: 'Testar receptividade do público através de lançamentos estratégicos e eventos.', status: 'nao_iniciado', progress: 0, deadline: '2025-07-31', deliverables: ['Relatório de métricas', 'Análise de engajamento'], measurableGoal: 'Mínimo 1000 ouvintes orgânicos', responsible: 'Consultor + Artista', priority: 'media', tags: ['validação', 'métricas'], order: 1 },
  { id: 'm12', projectId: 'p1', pillarType: 'comercial', title: 'Monetização da Carreira', description: 'Estruturar fontes de receita: shows, streaming, marcas, licenciamento.', status: 'nao_iniciado', progress: 0, deadline: '2025-09-30', deliverables: ['Plano de monetização', 'Propostas comerciais'], measurableGoal: 'Primeira receita gerada', responsible: 'Consultor', priority: 'media', tags: ['monetização', 'receita'], order: 2 },
];

export const mockQuarterlyReview: QuarterlyReview = {
  id: 'qr1',
  projectId: 'p1',
  quarter: 1,
  year: 2025,
  summary: 'Primeiro trimestre focado em diagnóstico e definição de conceito. Base estratégica sólida estabelecida.',
  evolved: 'Diagnóstico concluído com clareza. Pesquisa de nicho revelou posicionamento único. Meta de carreira definida com consenso.',
  blocked: 'Definição do conceito artístico demorou mais que o previsto. Artista passou por fase de indecisão criativa.',
  validated: 'Método sequencial (Administrativo → Artístico) provou eficácia. Artista reconhece valor do planejamento prévio.',
  nextSteps: 'Finalizar conceito artístico. Iniciar definição de público. Começar narrativa pública. Estruturar finanças.',
  newGoal: 'Consolidar identidade artística completa e iniciar presença pública estratégica.',
  pillarReviews: [
    { pillarType: 'administrativo', summary: 'Base sólida. Falta estrutura financeira.', progress: 65, previousProgress: 0 },
    { pillarType: 'artistico', summary: 'Em progresso. Conceito precisa de finalização.', progress: 40, previousProgress: 0 },
    { pillarType: 'marketing', summary: 'Início tímido. Narrativa em construção.', progress: 15, previousProgress: 0 },
    { pillarType: 'comercial', summary: 'Ainda em planejamento. Dependente dos demais pilares.', progress: 5, previousProgress: 0 },
  ],
};

export const mockComments: Comment[] = [
  { id: 'c1', milestoneId: 'm6', userId: 'u1', userName: 'Lucas Ferreira', content: 'O conceito precisa ser mais afiado. Sugiro revisitar as referências do moodboard e focar em 3 palavras-chave que definam a essência.', createdAt: '2025-03-05T14:30:00' },
  { id: 'c2', milestoneId: 'm6', userId: 'u1', userName: 'Lucas Ferreira', content: 'Artista trouxe novas referências visuais excelentes. Direção sonora ficando mais clara.', createdAt: '2025-03-10T10:15:00' },
  { id: 'c3', milestoneId: 'm3', userId: 'u1', userName: 'Lucas Ferreira', content: 'Cronograma precisa ser revisado para acomodar o atraso na definição do conceito artístico.', createdAt: '2025-03-08T16:00:00' },
];
