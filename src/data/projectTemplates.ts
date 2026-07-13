import { Milestone, PillarType, Priority, ProjectType } from '@/types';

export interface MilestoneTemplateItem {
  pillarType: PillarType;
  title: string;
  description: string;
  priority: Priority;
  order: number;
}

export interface ProjectTemplate {
  type: ProjectType;
  milestones: MilestoneTemplateItem[];
}

export const PROJECT_TEMPLATES: Record<ProjectType, ProjectTemplate> = {
  single: {
    type: 'single',
    milestones: [
      { pillarType: 'artistico', title: 'Conceito e Referências da Faixa', description: 'Definição do conceito artístico e referências sonoras do single.', priority: 'alta', order: 1 },
      { pillarType: 'artistico', title: 'Produção e Masterização', description: 'Composição, produção e masterização da faixa.', priority: 'critica', order: 2 },
      { pillarType: 'marketing', title: 'Arte de Capa e Identidade Visual', description: 'Capa, paleta e materiais visuais do lançamento.', priority: 'alta', order: 1 },
      { pillarType: 'marketing', title: 'Estratégia de Lançamento', description: 'Calendário editorial e plano de divulgação pré e pós-lançamento.', priority: 'critica', order: 2 },
      { pillarType: 'administrativo', title: 'Registro e Distribuição Digital', description: 'Registro autoral e envio às plataformas de streaming.', priority: 'alta', order: 1 },
      { pillarType: 'comercial', title: 'Campanha de Lançamento', description: 'Execução da campanha comercial de lançamento do single.', priority: 'media', order: 1 },
    ],
  },
  ep: {
    type: 'ep',
    milestones: [
      { pillarType: 'artistico', title: 'Repertório do EP Definido', description: 'Seleção e sequenciamento das faixas do EP.', priority: 'critica', order: 1 },
      { pillarType: 'artistico', title: 'Produção e Masterização das Faixas', description: 'Produção completa e masterização de todas as faixas.', priority: 'critica', order: 2 },
      { pillarType: 'marketing', title: 'Identidade Visual do EP', description: 'Capa, arte e materiais gráficos do projeto.', priority: 'alta', order: 1 },
      { pillarType: 'marketing', title: 'Calendário de Lançamento de Singles', description: 'Planejamento dos singles de divulgação antes do EP completo.', priority: 'alta', order: 2 },
      { pillarType: 'administrativo', title: 'Registro e Publishing', description: 'Registro autoral e publishing de todas as faixas do EP.', priority: 'alta', order: 1 },
      { pillarType: 'comercial', title: 'Estratégia de Monetização do EP', description: 'Plano de receita via streaming, shows e licenciamento.', priority: 'media', order: 1 },
    ],
  },
  album: {
    type: 'album',
    milestones: [
      { pillarType: 'artistico', title: 'Repertório do Álbum Finalizado', description: 'Composição e curadoria final do repertório do álbum.', priority: 'critica', order: 1 },
      { pillarType: 'artistico', title: 'Produção, Mixagem e Masterização', description: 'Produção completa, mixagem e masterização de todas as faixas.', priority: 'critica', order: 2 },
      { pillarType: 'marketing', title: 'Narrativa e Identidade Visual do Álbum', description: 'Conceito visual, capa e narrativa pública do álbum.', priority: 'alta', order: 1 },
      { pillarType: 'marketing', title: 'Plano de Lançamento e Mídia', description: 'Cronograma de mídia, imprensa e conteúdo do lançamento.', priority: 'critica', order: 2 },
      { pillarType: 'administrativo', title: 'Registro, Publishing e Distribuição', description: 'Registro autoral, publishing e distribuição digital do álbum.', priority: 'alta', order: 1 },
      { pillarType: 'comercial', title: 'Estratégia Comercial Pós-Lançamento', description: 'Plano de shows, parcerias e monetização após o lançamento.', priority: 'media', order: 1 },
    ],
  },
  turne: {
    type: 'turne',
    milestones: [
      { pillarType: 'administrativo', title: 'Orçamento e Viabilidade da Turnê', description: 'Levantamento de custos e viabilidade financeira da turnê.', priority: 'critica', order: 1 },
      { pillarType: 'administrativo', title: 'Contratação de Equipe e Fornecedores', description: 'Contratação de equipe técnica, produção e fornecedores.', priority: 'alta', order: 2 },
      { pillarType: 'artistico', title: 'Roteiro e Setlist da Turnê', description: 'Definição do roteiro de show e repertório da turnê.', priority: 'alta', order: 1 },
      { pillarType: 'marketing', title: 'Divulgação e Venda de Ingressos', description: 'Campanha de divulgação e abertura de vendas de ingressos.', priority: 'critica', order: 1 },
      { pillarType: 'comercial', title: 'Fechamento de Casas e Datas', description: 'Negociação e fechamento de contratos com casas e produtores locais.', priority: 'critica', order: 1 },
      { pillarType: 'comercial', title: 'Logística de Viagem e Produção', description: 'Organização de deslocamento, hospedagem e produção local.', priority: 'media', order: 2 },
    ],
  },
  videoclipe: {
    type: 'videoclipe',
    milestones: [
      { pillarType: 'artistico', title: 'Roteiro e Conceito Visual', description: 'Roteiro, referências visuais e conceito criativo do clipe.', priority: 'critica', order: 1 },
      { pillarType: 'artistico', title: 'Produção e Filmagem', description: 'Diária(s) de filmagem e direção de arte.', priority: 'critica', order: 2 },
      { pillarType: 'artistico', title: 'Edição e Pós-Produção', description: 'Edição, cor e finalização do vídeo.', priority: 'alta', order: 3 },
      { pillarType: 'marketing', title: 'Estratégia de Lançamento do Clipe', description: 'Plano de divulgação e teaser do videoclipe.', priority: 'alta', order: 1 },
      { pillarType: 'comercial', title: 'Distribuição em Plataformas', description: 'Publicação e otimização nas plataformas de vídeo.', priority: 'media', order: 1 },
    ],
  },
  campanha: {
    type: 'campanha',
    milestones: [
      { pillarType: 'marketing', title: 'Objetivo e Briefing da Campanha', description: 'Definição de objetivo, público-alvo e briefing criativo.', priority: 'critica', order: 1 },
      { pillarType: 'marketing', title: 'Cronograma de Conteúdo', description: 'Calendário editorial e peças planejadas da campanha.', priority: 'alta', order: 2 },
      { pillarType: 'artistico', title: 'Produção das Peças Criativas', description: 'Produção de fotos, vídeos e materiais criativos da campanha.', priority: 'alta', order: 1 },
      { pillarType: 'comercial', title: 'Veiculação e Mídia Paga', description: 'Execução da veiculação orgânica e paga da campanha.', priority: 'critica', order: 1 },
      { pillarType: 'comercial', title: 'Análise de Resultados', description: 'Consolidação de métricas e aprendizados da campanha.', priority: 'media', order: 2 },
    ],
  },
  rebranding: {
    type: 'rebranding',
    milestones: [
      { pillarType: 'artistico', title: 'Diagnóstico da Marca Atual', description: 'Avaliação do posicionamento e identidade atuais.', priority: 'critica', order: 1 },
      { pillarType: 'artistico', title: 'Novo Conceito Visual e Verbal', description: 'Definição da nova identidade visual e narrativa.', priority: 'critica', order: 2 },
      { pillarType: 'marketing', title: 'Aplicação em Materiais e Redes', description: 'Atualização de materiais gráficos e perfis nas redes sociais.', priority: 'alta', order: 1 },
      { pillarType: 'marketing', title: 'Comunicação da Mudança ao Público', description: 'Plano de comunicação da transição para o público.', priority: 'alta', order: 2 },
      { pillarType: 'administrativo', title: 'Atualização de Contratos e Materiais Oficiais', description: 'Atualização de documentos, contratos e materiais institucionais.', priority: 'media', order: 1 },
    ],
  },
  edital: {
    type: 'edital',
    milestones: [
      { pillarType: 'administrativo', title: 'Pesquisa de Editais Compatíveis', description: 'Levantamento de editais e chamadas públicas compatíveis com o projeto.', priority: 'alta', order: 1 },
      { pillarType: 'administrativo', title: 'Elaboração da Proposta', description: 'Redação do projeto e da proposta a ser submetida.', priority: 'critica', order: 2 },
      { pillarType: 'administrativo', title: 'Documentação e Orçamento', description: 'Reunião de documentos e elaboração do orçamento detalhado.', priority: 'critica', order: 3 },
      { pillarType: 'comercial', title: 'Submissão do Edital', description: 'Envio da proposta dentro do prazo estabelecido.', priority: 'critica', order: 1 },
      { pillarType: 'administrativo', title: 'Prestação de Contas', description: 'Prestação de contas do edital, caso aprovado.', priority: 'media', order: 4 },
    ],
  },
  captacao: {
    type: 'captacao',
    milestones: [
      { pillarType: 'administrativo', title: 'Definição da Meta de Captação', description: 'Definição do valor e finalidade da captação de recursos.', priority: 'critica', order: 1 },
      { pillarType: 'marketing', title: 'Material de Apresentação (Pitch Deck)', description: 'Elaboração do material de apresentação para investidores/patrocinadores.', priority: 'critica', order: 1 },
      { pillarType: 'comercial', title: 'Prospecção de Investidores/Patrocinadores', description: 'Mapeamento e abordagem de potenciais investidores ou marcas.', priority: 'alta', order: 1 },
      { pillarType: 'comercial', title: 'Negociação de Propostas', description: 'Negociação de termos e condições com interessados.', priority: 'alta', order: 2 },
      { pillarType: 'administrativo', title: 'Fechamento e Formalização', description: 'Formalização contratual da captação.', priority: 'critica', order: 2 },
    ],
  },
  show_evento: {
    type: 'show_evento',
    milestones: [
      { pillarType: 'administrativo', title: 'Definição de Local e Data', description: 'Escolha e reserva do local e data do evento.', priority: 'critica', order: 1 },
      { pillarType: 'administrativo', title: 'Produção Técnica (Som, Palco, Luz)', description: 'Contratação da estrutura técnica do evento.', priority: 'alta', order: 2 },
      { pillarType: 'marketing', title: 'Divulgação e Venda de Ingressos', description: 'Campanha de divulgação e abertura de vendas.', priority: 'critica', order: 1 },
      { pillarType: 'comercial', title: 'Execução do Evento', description: 'Realização do show/evento no dia planejado.', priority: 'critica', order: 1 },
      { pillarType: 'administrativo', title: 'Prestação de Contas Pós-Evento', description: 'Fechamento financeiro e relatório pós-evento.', priority: 'media', order: 3 },
    ],
  },
};

export function generateMilestonesFromTemplate(projectType: ProjectType, projectId: string): Milestone[] {
  const template = PROJECT_TEMPLATES[projectType];
  return template.milestones.map((item, index) => ({
    id: `m-${projectId}-${index}-${Date.now()}`,
    projectId,
    pillarType: item.pillarType,
    title: item.title,
    description: item.description,
    status: 'nao_iniciado',
    progress: 0,
    priority: item.priority,
    order: item.order,
  }));
}
