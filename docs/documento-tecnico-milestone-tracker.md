# Documento Técnico — Milestone Tracker (artist-quest-tracker)

**Objetivo do documento:** descrever formalmente a estrutura técnica da implementação atual do projeto, para servir de base ao debate sobre escopo, arquitetura e próximos passos do MVP.

**Fonte:** código-fonte do repositório `artist-quest-tracker` (front-end já implementado e disponível na base de conhecimento do projeto).

**Nota metodológica:** esta descrição foi construída a partir da leitura do código-fonte (componentes, contextos, tipos e dados). Itens de infraestrutura que não têm representação no código-fonte do front-end (CI/CD, ambiente de deploy, variáveis de ambiente, backend) não puderam ser inferidos e estão listados como pontos em aberto na seção 9.

**Revisão:** a seção 8 já incorpora as decisões de escopo do MVP validadas em reunião de debate; os pontos ainda sem definição estão isolados na seção 8.2.

---

## 1. Visão Geral do Produto

O **Milestone Tracker** é uma plataforma de gestão estratégica de carreiras musicais. O usuário principal é o **consultor/gestor de carreira** ("conselheiro"), que acompanha o desenvolvimento de um ou mais artistas ao longo de quatro pilares de trabalho:

| Pilar | Foco |
|---|---|
| Administrativo | Diagnóstico, planejamento, estrutura financeira |
| Artístico | Conceito, narrativa, posicionamento, repertório |
| Marketing | Narrativa pública, conteúdo, lançamento |
| Comercial | Validação de público, monetização |

O produto organiza o trabalho em **projetos** (um projeto = uma "era" ou ciclo estratégico de um artista), decompostos em **marcos (milestones)** com subtarefas, acompanhados por **indicadores de demanda real** (vs. métricas de vaidade) e formalizados em **avaliações trimestrais**.

O modelo de dados já reflete dois papéis de usuário (`consultor` e `artista`); apenas o fluxo do consultor está implementado na UI atual, e — conforme decisão de escopo registrada na seção 8.1 — **o MVP será exclusivo para o consultor**, sem tela ou acesso próprio para o papel `artista`.

---

## 2. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework UI | React 18 |
| Build tool | Vite 5 (`@vitejs/plugin-react-swc`) |
| Roteamento | React Router DOM 6 (`BrowserRouter`) |
| Estilização | Tailwind CSS 3 + `tailwindcss-animate` |
| Componentes base | shadcn/ui (Radix UI primitives + `class-variance-authority`) |
| Ícones | lucide-react |
| Gráficos | Recharts (dependência presente; uso efetivo restrito ao wrapper `chart.tsx`) |
| Formulários | react-hook-form + zod + `@hookform/resolvers` |
| Data fetching / cache | `@tanstack/react-query` (`QueryClient` instanciado, mas sem uso ativo — não há chamadas de API no código atual) |
| Notificações (toast) | sonner + Toaster (shadcn) |
| Testes unitários | Vitest + Testing Library (configurado em `package.json`; cobertura de testes não verificada nesta análise) |
| Testes E2E | Playwright (configurado em `package.json`; specs não localizadas na análise) |
| Lint | ESLint 9 + typescript-eslint |
| Origem do projeto | Gerado via **Lovable** (`lovable-tagger` como devDependency; metadados residuais no `index.html`) |

Não há dependências de backend, ORM, cliente HTTP customizado (axios/fetch wrapper) ou SDK de banco de dados (ex.: Supabase, Firebase) no `package.json`. **O projeto é hoje um front-end puro, sem camada de servidor.**

---

## 3. Arquitetura Atual

### 3.1 Padrão geral
Aplicação SPA (Single Page Application) client-side rendering, sem SSR/SSG. Todo o estado vive na memória do navegador.

```
main.tsx
 └── App.tsx
      ├── QueryClientProvider (react-query, sem uso funcional ainda)
      ├── TooltipProvider (shadcn)
      ├── Toaster / Sonner (notificações globais)
      └── BrowserRouter
           └── ProjectProvider (Context API)
                └── Routes → Páginas
```

### 3.2 Roteamento (`src/App.tsx`)

| Rota | Componente | Descrição funcional |
|---|---|---|
| `/` | `LandingPage` | Página institucional, CTA que navega para `/dashboard` |
| `/login` | `LoginPage` | Formulário de e-mail/senha **mock**: qualquer submit navega para `/dashboard`, sem chamada de autenticação |
| `/dashboard` | `Dashboard` | Visão geral: DNA artístico, posicionamento, público, progresso por pilar, marcos em andamento/atrasados/concluídos, indicador de fase de carreira |
| `/projetos` | `ProjetosPage` | Lista de projetos, criação de novo projeto (wizard de 2 passos), seleção do projeto ativo |
| `/milestones` | `MilestonesPage` | Lista de marcos em modo lista ou kanban, com filtro por pilar e busca textual |
| `/roadmap` | `RoadmapPage` | Timeline trimestral (3 meses) dos marcos, agrupados por pilar |
| `/indicadores` | `IndicadoresPage` | Métricas de demanda real vs. métricas de vaidade (shows, streaming, comunidade, monetização) |
| `/avaliacao` | `AvaliacaoPage` | Revisão trimestral estruturada: resumo, evoluções, bloqueios, validações, perguntas estratégicas, comparação por pilar |
| `/configuracoes` | `ConfiguracoesPage` | Edição dos campos do projeto ativo (DNA, posicionamento, público) |
| `*` | `NotFound` | Página 404 |

Não há rotas protegidas (route guards); qualquer rota é acessível diretamente por URL, inclusive sem login.

### 3.3 Gerenciamento de estado

- **`ProjectContext` (`src/contexts/ProjectContext.tsx`)**: único contexto de estado da aplicação. Mantém em memória uma lista de `{ project, artist }`, o id do projeto ativo, e expõe `updateProject`, `updateArtist`, `addProject`, `deleteProject`.
- O estado é inicializado a partir de `mockProject`/`mockArtist` (dados fixos) e **não há persistência**: um refresh de página zera qualquer alteração feita (novo projeto criado, edição de configurações, etc.).
- Não há uso de `localStorage`/`sessionStorage`, cache de query, nem sincronização com servidor.

### 3.4 Camada de dados

- Toda a base de dados da aplicação é um arquivo estático: `src/data/mockData.ts`, exportando arrays/objetos: `mockUser`, `mockArtist`, `mockProject`, `mockPillars`, `mockMilestones`, `mockQuarterlyReview`, `mockComments`, `mockDemandMetrics`, além de funções utilitárias de cálculo (`calculatePillarProgress`, `calculateOverallProgress`).
- Não existe API, cliente HTTP, nem contrato de integração com backend definido.

### 3.5 Autenticação
Não implementada. `LoginPage` coleta e-mail/senha em estado local de componente e apenas redireciona — não há verificação de credenciais, sessão, token ou guard de rota.

### 3.6 Design system / componentização
- Componentes de domínio em `src/components/` (`AppLayout`, `AppSidebar`, `ProgressBar`, `StatusBadge`, `PillarTag`) compõem a UI das páginas.
- Componentes de base shadcn/ui em `src/components/ui/` (sidebar, dialog, select, tabs, chart, etc.), seguindo o padrão Radix + CVA + Tailwind.
- Tema visual: dark-first, paleta de status por cor (`status-completed`, `status-in-progress`, `status-delayed`), tipografia com fonte de display para títulos.

---

## 4. Modelo de Domínio (`src/types/index.ts`)

| Entidade | Campos-chave | Observação |
|---|---|---|
| `User` | id, name, email, role (`consultor` \| `artista`) | Papel modelado no tipo, mas sem diferenciação de permissões/UI implementada |
| `Artist` | id, name, genre, bio, createdAt | — |
| `Project` | id, artistId, name, currentQuarter/Year, stage, overallProgress, careerPhase, bigGoal, quarterGoal, `dna`, `positioning`, `audience` | Entidade central; agrega os três blocos estratégicos abaixo |
| `ProjectDNA` | artisticConcept, artisticNarrative, culturalUniverse, references[], artisticHypothesis, hypothesisStatus | Hipótese artística com status de validação (`nao_testada`/`em_validacao`/`validada`) |
| `ProjectPositioning` | mainGenre, subGenre, culturalTerritory, valueProposition | — |
| `ProjectAudience` | ageRange, culturalScene, predominantAesthetic, behavior, mainPlatforms[] | — |
| `Pillar` | id, projectId, type (`administrativo`\|`artistico`\|`marketing`\|`comercial`), progress, level, observations | Representa o progresso agregado de cada pilar |
| `Milestone` | id, projectId, pillarType, title, description, status, progress, startDate, deadline, deliverables[], measurableGoal, responsible, priority, tags[], order, subtasks[] | Unidade de trabalho principal |
| `Subtask` | id, title, completed | — |
| `QuarterlyReview` | id, projectId, quarter, year, summary, evolved, blocked, validated, nextSteps, newGoal, pillarReviews[], strategicQuestions | Estrutura de avaliação trimestral |
| `StrategicQuestions` | artisticEvolution, audienceResponse, realDemand, bottleneck, hypothesisValidation | 5 perguntas fixas de reflexão estratégica |
| `Comment` | id, milestoneId, userId, userName, content, createdAt | Comentários por marco (sem UI de criação encontrada — apenas dados mock) |
| `DemandMetrics` | month, shows{}, streaming{}, community{}, monetization{} | Série temporal mensal de indicadores |

Também existe `CareerPhase`, um enum ordenado de 8 estágios (`definicao_mda → experimentacao → validacao_sva → organizacao → execucao → consolidacao → tracao → escala`) usado para posicionar visualmente a evolução do projeto no Dashboard.

---

## 5. Funcionalidades Implementadas por Módulo

- **Dashboard**: leitura consolidada do projeto ativo (mock) — DNA, posicionamento, público, progresso por pilar, marcos por status, indicador de fase de carreira.
- **Projetos**: única tela que de fato usa `ProjectContext` para múltiplos projetos — permite criar (wizard 2 passos), listar, selecionar como ativo e excluir projetos.
- **Milestones**: listagem com dois modos de visualização (lista / kanban por status), filtro por pilar e busca por título. Sem criação/edição/exclusão de marcos pela UI.
- **Roadmap**: visão de timeline trimestral (3 colunas fixas de mês) com os marcos distribuídos por pilar e por mês de `deadline`.
- **Indicadores**: comparação explícita entre "métricas de vaidade" (visualizações, alcance, likes, seguidores) e "demanda real" (ingressos vendidos, shows solicitados, superfãs, royalties), com cards de tendência (↑/↓) mês a mês.
- **Avaliação Trimestral**: relatório estruturado (resumo, evoluiu/travou/validado, próximos passos, 5 perguntas estratégicas fixas, comparação de progresso por pilar entre trimestres).
- **Configurações**: única tela de edição de dados do projeto ativo (campos de DNA, posicionamento, público) via `updateProject` do contexto.
- **Login/Landing**: telas de entrada sem lógica de negócio associada.

---

## 6. Qualidade de Software

- Infraestrutura de testes **configurada** (Vitest + Testing Library + jsdom; Playwright para E2E), mas a cobertura efetiva de testes não foi confirmada nesta análise — recomenda-se auditoria específica antes do MVP.
- Lint configurado (ESLint 9 + typescript-eslint), com `noImplicitAny`, `strictNullChecks` e `noUnusedLocals` **desabilitados** no `tsconfig` — ou seja, o projeto roda com TypeScript em modo permissivo, o que reduz a garantia de tipagem estrita.
- `index.html` mantém metadados residuais do gerador Lovable (título duplicado `"Milestone Tracker..."` / `"Lovable App"`, comentários `TODO`, imagens de preview do Lovable em `og:image`) — pendência de limpeza antes de qualquer lançamento público.

---

## 7. Lacunas Técnicas Relevantes para o Debate do MVP

Esta seção reúne os pontos que mais impactam a decisão de escopo do MVP:

1. **Ausência total de backend/persistência.** Todos os dados são estáticos (`mockData.ts`) ou vivem apenas em memória via Context. Qualquer refresh de página descarta alterações. Não há banco de dados, API nem autenticação real.
2. **Inconsistência entre `ProjectContext` e as páginas de conteúdo.** `ProjetosPage` já opera sobre o estado dinâmico do contexto (`useProject()`), mas `Dashboard`, `MilestonesPage`, `RoadmapPage`, `IndicadoresPage` e `AvaliacaoPage` importam diretamente `mockProject`/`mockMilestones`/`mockDemandMetrics`/`mockQuarterlyReview` de `mockData.ts`, **ignorando o projeto ativo selecionado**. Ou seja: hoje, trocar de projeto em "Projetos" não reflete nas demais telas. **[Confirmado como requisito do MVP — ver seção 8.1, item 3]**: o consultor deve selecionar um cliente e navegar por um painel exclusivo daquele cliente; esta é, portanto, a lacuna de maior prioridade a corrigir.
3. **Milestones sem filtragem por `projectId`.** O campo existe no modelo, mas a UI atual não filtra os marcos pelo projeto ativo.
4. **Nenhum CRUD de Milestones/Pillars/Comments pela UI** — apenas leitura de dados mock. `Comment` sequer possui uma tela associada. **[Confirmado como requisito de alta prioridade do MVP — ver seção 8.1, item 4]**: não haverá ingestão prévia de dados, então o CRUD é o mecanismo pelo qual o consultor vai popular tanto clientes já existentes em sua carteira quanto novos clientes.
5. **Autenticação e autorização inexistentes.** `LoginPage` é decorativa; não há sessão, guard de rota, nem diferenciação de acesso entre os papéis `consultor` e `artista` já previstos no tipo `User`.
6. **Sem multi-tenancy real.** Não há isolamento de dados entre diferentes consultores/contas. **[Confirmado: fora do MVP — ver seção 8.1, item 3]**: multi-tenancy (múltiplos consultores com carteiras isoladas) fica para uma fase 2; o MVP assume um único consultor com acesso a todos os seus clientes.
7. **TypeScript em modo permissivo**, reduzindo garantias de tipo em tempo de build.
8. **Metadados de projeto (`index.html`) não finalizados** (nome, descrição, OG image).

---

## 8. Decisões de Escopo do MVP

### 8.1 Decisões confirmadas

1. **Acesso exclusivo do consultor.** O papel `artista` não terá acesso à plataforma no MVP. O tipo `User.role` pode permanecer no modelo de dados para uso futuro, mas nenhuma tela/fluxo será construída para esse papel nesta fase.
2. **Backend: ainda não definido.** Pendência que bloqueia o início da Fase 1 (ver seção 9) — precisa ser decidida antes de iniciar a modelagem de schema/API.
3. **Multi-tenancy fica para a Fase 2.** No MVP existe **um único consultor**, com acesso a **todos os seus clientes** (multi-artista/multi-projeto). Não haverá tela de consolidação/comparação entre carreiras no MVP. O fluxo é: o consultor **seleciona um cliente ativo** e passa a ver **um painel exclusivo daquele cliente** — Dashboard, Milestones, Roadmap, Indicadores, Avaliação e Configurações devem refletir apenas os dados do cliente selecionado. Isso torna a correção da lacuna nº 2 da seção 7 (`ProjectContext` desconectado das páginas de conteúdo) **prioridade central do MVP**, não um nice-to-have.
4. **CRUD completo é essencial.** Não haverá ingestão/importação prévia de dados. O consultor precisa conseguir criar e editar clientes, projetos, marcos, subtarefas e pilares diretamente pela UI — tanto para popular clientes já existentes em sua carteira quanto para cadastrar novos clientes do zero.
5. **Avaliação Trimestral será 100% orientada a dados do sistema.** Não haverá campos de texto livre subjetivo nem geração por IA. Os campos hoje modelados em `QuarterlyReview` como narrativa aberta (`summary`, `evolved`, `blocked`, `validated`, `strategicQuestions`) precisam ser redesenhados como **saídas calculadas** a partir de dados já existentes no sistema (variação de progresso por pilar, marcos concluídos/atrasados/bloqueados no período, variação dos Indicadores). Isso é uma mudança de modelo de dados, não apenas de UI — precisa de uma sessão de definição própria sobre qual regra de cálculo substitui cada campo narrativo atual.
6. **Indicadores integrados a fontes externas.** As métricas de demanda (shows, streaming, comunidade, monetização) não serão preenchidas manualmente — serão integradas a fontes externas (ex.: Spotify for Artists, plataformas de venda de ingressos, redes sociais). Isso adiciona ao escopo técnico: autenticação OAuth com provedores terceiros, rotinas de sincronização/ETL e tratamento de indisponibilidade/rate limit dessas integrações.

### 8.2 Ponto que ainda precisa de definição

- **Comentários por marco (`Comment`) — natureza da funcionalidade ainda não está clara e precisa de decisão.** No código atual, `Comment` e `QuarterlyReview` são duas coisas distintas e não relacionadas entre si:
  - `Comment`: um registro de anotação vinculado a **um marco específico** (`milestoneId`), com autor e data — funciona como um mural/histórico de observações qualitativas sobre aquele marco ao longo do tempo (ex.: "conceito precisa ser mais afiado, revisitar moodboard..."). **Não há nenhuma tela na aplicação que exiba ou permita criar esses comentários hoje** — existem apenas como dados de exemplo (`mockComments`), sem uso na UI.
  - `QuarterlyReview` (seção "Avaliação Trimestral"): um documento estruturado por **trimestre do projeto como um todo**, não ligado a um marco específico.
  
  Ou seja, os Comentários **não são** a Avaliação Trimestral — são um recurso separado, hoje não implementado em nenhuma tela, e que fica em aberto: entra no MVP como um mural de observações por marco, ou é descartado do escopo por enquanto? Dado que a Avaliação Trimestral passará a ser orientada a dados (decisão 5 acima), os Comentários poderiam ser o único espaço remanescente para registro qualitativo do consultor — vale decidir isso na mesma conversa.

---

## 9. Proposta de Próximos Passos Técnicos

Sequenciamento revisado após as decisões de escopo da seção 8 — CRUD e a filtragem por cliente ativo deixam de ser tarefas tardias e passam a ser o núcleo do MVP:

**Fase 0 — Decisão bloqueante**
- Definir o backend (banco de dados + API própria vs. BaaS como Supabase/Firebase). Nenhuma outra fase avança sem essa definição.

**Fase 1 — Fundação de dados + seleção de cliente ativo**
- Provisionar o backend definido na Fase 0 e modelar as entidades já existentes em `types/index.ts` como schema real (já estão bem definidas e podem ser usadas quase diretamente como referência).
- Substituir `mockData.ts` por chamadas reais, usando o `react-query` já presente na stack (hoje instanciado, mas sem uso).
- Unificar **todas** as páginas (Dashboard, Milestones, Roadmap, Indicadores, Avaliação, Configurações) para consumir o cliente/projeto ativo via `ProjectContext` (ou seu substituto conectado à API), eliminando o uso direto de `mockProject`/`mockMilestones`/`mockDemandMetrics`/`mockQuarterlyReview`. Este item concretiza a decisão 8.1.3.
- Implementar filtragem de Milestones/Pillars por `projectId`.

**Fase 2 — CRUD de domínio (prioridade alta, conforme decisão 8.1.4)**
- Criar/editar/excluir Clientes (Artist), Projetos, Milestones, Subtasks e Pillars pela UI — é o único mecanismo de entrada de dados, já que não haverá importação prévia.
- Persistir criação/edição de Projetos (já parcialmente modelada no `ProjectContext`, hoje sem backend).
- Definir e resolver o ponto em aberto da seção 8.2 (Comentários por marco) antes de decidir se entra neste CRUD.

**Fase 3 — Autenticação (simplificada para o escopo do MVP)**
- Como o MVP é de acesso exclusivo do consultor e sem multi-tenancy (decisões 8.1.1 e 8.1.3), a autenticação pode começar como um login único/simples (sessão para um consultor), sem necessidade de todo o aparato de multi-usuário e permissões por papel — esse detalhamento fica para a Fase 2 de produto (multi-tenancy).
- Proteger as rotas para exigir login antes de qualquer tela interna.

**Fase 4 — Avaliação Trimestral orientada a dados + Indicadores externos**
- Redesenhar `QuarterlyReview` para ser calculada a partir de dados do sistema (decisão 8.1.5), definindo as regras de cálculo que substituem os campos narrativos atuais.
- Implementar as integrações externas de Indicadores (decisão 8.1.6): autenticação OAuth com provedores (Spotify for Artists, ticketing, redes sociais) e rotina de sincronização.

**Fase 5 — Polimento e lançamento**
- Corrigir metadados residuais do Lovable no `index.html`.
- Endurecer configuração de TypeScript (`strictNullChecks`, `noImplicitAny`).
- Auditar e ampliar cobertura de testes (Vitest/Playwright já configurados).

---

## 10. Anexo — Inventário de Arquivos-Chave Identificados

```
src/
├── App.tsx                      # Definição de rotas e providers globais
├── main.tsx                     # Entry point
├── types/index.ts                # Modelo de domínio completo (entidades, enums, labels)
├── data/mockData.ts              # Dados estáticos + funções de cálculo de progresso
├── contexts/ProjectContext.tsx   # Único estado global (lista de projetos, projeto ativo)
├── lib/helpers.ts                # Formatação de datas, moeda, cores por status/pilar
├── components/
│   ├── AppLayout.tsx / AppSidebar.tsx   # Shell de navegação
│   ├── ProgressBar.tsx / StatusBadge.tsx / PillarTag.tsx
│   └── ui/*                      # Biblioteca shadcn/ui (Radix + CVA)
└── pages/
    ├── LandingPage.tsx / LoginPage.tsx
    ├── Dashboard.tsx
    ├── ProjetosPage.tsx
    ├── MilestonesPage.tsx
    ├── RoadmapPage.tsx
    ├── IndicadoresPage.tsx
    ├── AvaliacaoPage.tsx
    ├── ConfiguracoesPage.tsx
    └── NotFound.tsx
```
