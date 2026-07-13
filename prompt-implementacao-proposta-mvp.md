# Prompt de execução — Implementação da Proposta de Produto (Milestone Tracker)

> **Como usar este prompt:** cole este arquivo inteiro como instrução inicial em uma sessão de coding agent (Claude Code ou equivalente) aberta na raiz do repositório `artist-quest-tracker`. Antes de rodar, copie também o arquivo `ray-el-vox-metricas-sociais.json` (anexo a este prompt) para `src/data/social-metrics-sample.json` no repositório — ele é usado na Tarefa 4. Se os arquivos `documento-tecnico-milestone-tracker.md` e `proposta-produto-milestone-tracker.docx` existirem, coloque-os em `docs/` para referência de auditoria; este prompt já é autossuficiente para execução mesmo sem eles.

## Contexto

O Milestone Tracker é uma plataforma de gestão de carreiras musicais para um único gestor/consultor, que acompanha múltiplos artistas (clientes). O estado atual do repositório é um front-end React 18 + Vite + TypeScript + Tailwind/shadcn-ui, **sem backend**: todo o estado vive em `ProjectContext` (Context API) e os dados são estáticos em `src/data/mockData.ts`. Não há persistência, autenticação real, nem CRUD funcional além da criação/exclusão de projetos.

Este prompt implementa a evolução de produto já validada com o cliente (gestor de carreiras). **Princípio inegociável, válido para toda tarefa abaixo:** a plataforma nunca decide nem interfere na gestão humana. Qualquer dado externo ou calculado é exibido como insumo — nenhuma tarefa deve introduzir lógica que marque automaticamente status de hipótese artística, prioridade de marco, ou qualquer julgamento que hoje é feito manualmente pelo gestor.

## Arquitetura de informação alvo (5 abas)

| Aba | Rota | Substitui/funde |
|---|---|---|
| 1. Projetos | `/projetos` | Mantém-se, ganha o botão "Novo Projeto" apontando para o wizard da Tarefa 2 |
| 2. Dashboard (+ Avaliação) | `/dashboard` | Fusão de `Dashboard.tsx` + `AvaliacaoPage.tsx` |
| 3. Milestones | `/milestones` | Mantém-se, só ganha filtragem por projeto ativo |
| 4. Indicadores | `/indicadores` | Mantém-se, passa a consumir dados reais (Tarefa 4) |
| 5. Agenda | `/agenda` | Substitui `RoadmapPage.tsx` |

`ConfiguracoesPage.tsx` deixa de existir como rota própria — sua função é absorvida pelo wizard da Tarefa 2, acessível também em modo edição a partir do Dashboard.

Execute as tarefas na ordem abaixo; a Tarefa 0 é pré-requisito de todas as outras.

---

## Tarefa 0 — Unificar o estado do cliente ativo (bloqueante)

**Problema atual:** `ProjetosPage.tsx` já usa `useProject()` do `ProjectContext` para múltiplos projetos, mas `Dashboard.tsx`, `MilestonesPage.tsx`, `RoadmapPage.tsx`, `IndicadoresPage.tsx` e `AvaliacaoPage.tsx` importam diretamente `mockProject`/`mockMilestones`/`mockDemandMetrics`/`mockQuarterlyReview` de `src/data/mockData.ts`, ignorando o projeto ativo.

**Ação:** substitua, em todas as páginas de conteúdo, o import direto de `mockData` pelo consumo de `activeProject`/`activeArtist` via `useProject()`. Onde hoje se usa `mockMilestones` inteiro, filtre por `projectId === activeProject.id`. Isso vale também para os dados novos introduzidos nas tarefas seguintes (Indicadores, Agenda).

**Critério de aceite:** trocar o projeto ativo em `/projetos` deve refletir imediatamente em Dashboard, Milestones, Indicadores e Agenda, sem refresh de página.

---

## Tarefa 1 — Reorganizar a navegação para as 5 abas

- Atualize `src/App.tsx`: remova as rotas `/roadmap`, `/avaliacao` e `/configuracoes` como rotas independentes; adicione `/agenda`.
- Atualize `src/components/AppSidebar.tsx`: os itens de navegação passam a ser exatamente Projetos, Dashboard, Milestones, Indicadores, Agenda (5 itens, nessa ordem).
- Mantenha `LandingPage`, `LoginPage` e `NotFound` como estão.

**Critério de aceite:** a barra lateral mostra exatamente 5 itens; nenhuma rota antiga (`/roadmap`, `/avaliacao`, `/configuracoes`) responde mais como página própria.

---

## Tarefa 2 — Cadastro de Definição Artística (wizard)

Novo fluxo, disparado pelo botão "Novo Projeto" em `ProjetosPage.tsx`, e reaberto em modo edição por um botão "Editar perfil artístico" a ser adicionado em `Dashboard.tsx`.

Crie `src/pages/CadastroArtisticoPage.tsx` (ou componente de wizard reutilizável, ex.: `src/components/ArtistProfileWizard.tsx`) com 5 etapas, barra de progresso visível e navegação Voltar/Próxima etapa, revisão final antes de confirmar. Nenhum campo novo no modelo de dados é necessário — todos já existem em `types/index.ts`:

1. **Identidade básica** — `Artist.name`, `Artist.genre`, `Artist.bio`.
2. **DNA artístico** — `ProjectDNA.artisticConcept`, `artisticNarrative`, `culturalUniverse`, `references[]`, `artisticHypothesis`.
3. **Posicionamento** — `ProjectPositioning` (todos os campos).
4. **Público-alvo** — `ProjectAudience` (todos os campos).
5. **Objetivos** — `Project.bigGoal`, `Project.quarterGoal`, `Project.careerPhase` inicial.

Em modo criação, ao confirmar, chame `addProject()` do `ProjectContext` (já existente) e navegue para `/dashboard`. Em modo edição, chame `updateProject()`/`updateArtist()` campo a campo, pré-preenchendo cada etapa com os dados do `activeProject`/`activeArtist`.

**Critério de aceite:** é possível criar um cliente do zero e editar um cliente existente usando o mesmo componente de wizard; nenhuma tela de "Configurações" solta permanece na navegação.

---

## Tarefa 3 — Fusão Dashboard + Avaliação

Mova o conteúdo de `AvaliacaoPage.tsx` para dentro de `Dashboard.tsx` como uma segunda seção (por exemplo, abas internas "Visão Geral" / "Avaliação Trimestral", ou scroll sequencial — decisão de implementação livre, desde que as duas seções coexistam na mesma rota `/dashboard`).

A Avaliação Trimestral deixa de ter campos de texto livre subjetivo. Substitua os campos narrativos de `QuarterlyReview` (`summary`, `evolved`, `blocked`, `validated`, `strategicQuestions`) por blocos **calculados** a partir de Milestones e Indicadores do próprio projeto. Use estas regras iniciais (marcadas como sujeitas a validação do cliente — não travam a implementação):

- **Evoluiu:** lista de marcos cujo `status` mudou para `concluido` dentro do trimestre corrente, e pilares cujo `progress` aumentou em relação à revisão anterior.
- **Travou:** marcos com `status === 'atrasado'`, ou `status === 'em_andamento'` sem variação de `progress` há mais de 30 dias.
- **Validado:** marcos concluídos cujo `measurableGoal` foi atingido (comparar texto/valor, se aplicável) — se não houver forma automática de verificar, liste apenas os marcos concluídos como candidatos e sinalize no PR que esta regra precisa de refinamento.
- **Perguntas estratégicas → indicadores objetivos:** substitua as 5 perguntas de texto livre por métricas computadas equivalentes, por exemplo `audienceResponse` → variação percentual de alcance/engajamento no período (Tarefa 4); `realDemand` → variação de shows solicitados/confirmados e superfãs ativos; `bottleneck` → pilar com menor `progress` relativo no período.
- **Comparação por pilar:** mantenha o componente já existente (`progress` atual vs. anterior), sem alteração de lógica.

**Critério de aceite:** a Avaliação Trimestral não deve conter nenhum `<textarea>`/campo de texto livre preenchido pelo gestor; todo o conteúdo é renderizado a partir de dados de Milestones/Indicadores do projeto ativo.

---

## Tarefa 4 — Indicadores com dados reais de mídias sociais

Use o arquivo `src/data/social-metrics-sample.json` (cópia do anexo `ray-el-vox-metricas-sociais.json`) como fonte mock para os indicadores automáticos. É uma extração real de um agregador de mídias sociais (Facebook, Instagram, TikTok, YouTube), com nomes de projeto já adaptados para o artista fictício "RAY EL VOX"; os valores numéricos são reais e não devem ser alterados.

**Passo 1 — Modelar o tipo.** Adicione em `src/types/index.ts` um tipo que represente uma métrica de rede social vinda da API (formato `{ values: number, trend?: { data: number[] }, comparison?: {...} }`), e um tipo agregador por rede (`facebook`, `instagram`, `tiktok`, `youtube`). Não precisa modelar o catálogo completo do JSON — apenas as métricas primárias abaixo, que são as que têm valor real de curtidas/comentários/alcance:

| Rede | Chave no JSON | Métrica |
|---|---|---|
| Facebook | `fb:page_reach` / `fb:page_reach_total` | Alcance da página |
| Facebook | `fb:page_post_engagements` | Engajamento em posts |
| Facebook | `fb:page_post_rate_engagements` | Taxa de engajamento (%) |
| Facebook | `fb:total_video_views` | Visualizações de vídeo/reels |
| Instagram | `ig:profile_views` | Visitas ao perfil |
| Instagram | `ig:views` | Visualizações totais |
| Instagram | `ig:stories_views` / `ig:reach_over_time` | Alcance de stories / evolução de alcance |
| TikTok | `tiktok:views` | Visualizações |
| TikTok | `tiktok:likes` | Curtidas |
| TikTok | `tiktok:comments` | Comentários |
| TikTok | `tiktok:share` | Compartilhamentos |
| TikTok | `tiktok:follows` | Seguidores |
| YouTube | `youtube:views` | Visualizações |
| YouTube | `youtube:likes` | Curtidas |
| YouTube | `youtube:comments` | Comentários |
| YouTube | `youtube:shares` | Compartilhamentos |
| YouTube | `youtube:subscribers_variation` | Variação de inscritos |

**Passo 2 — Adapter de leitura.** Crie `src/data/socialMetrics.ts` com uma função que lê `social-metrics-sample.json`, extrai as chaves da tabela acima por `result.slug`, e expõe um objeto tipado (ex.: `getSocialMetricsSnapshot(): SocialMetricsSnapshot`). Não é necessário chamar API real nesta etapa — é mock, mas com formato idêntico ao de uma integração real futura, para que trocar por uma chamada de API depois seja apenas trocar a implementação da função, sem tocar nos componentes.

**Passo 3 — UI.** Em `IndicadoresPage.tsx`, adicione uma seção "Mídias sociais" com cards por rede, no mesmo padrão visual dos cards de `MetricSection`/`MetricCard` já existentes (número, tendência, comparação com período anterior). Mantenha a seção "Demanda Real vs. Métricas de Vaidade" já existente, e classifique as novas métricas dentro dela (ex.: curtidas/alcance como vaidade; superfãs, ingressos, shows continuam como demanda real — as métricas sociais entram como contexto complementar, não substituem a distinção já feita).

**Critério de aceite:** a aba Indicadores mostra pelo menos uma métrica real de curtidas, uma de comentários e uma de alcance/visualizações por rede social disponível no JSON, com o mesmo componente visual de card usado hoje.

---

## Tarefa 5 — Agenda (nova aba)

Crie `src/pages/AgendaPage.tsx`, substituindo `RoadmapPage.tsx`.

**Modelo de dados** — adicione em `types/index.ts`:

```ts
type CalendarEventType = 'show' | 'lancamento' | 'prazo_marco' | 'reuniao' | 'avaliacao_trimestral';

interface CalendarEvent {
  id: string;
  projectId: string;
  type: CalendarEventType;
  title: string;
  date: string;
  notes?: string;
  sourceMilestoneId?: string; // preenchido quando o evento vem de um Milestone
}
```

**Geração a partir de Milestones:** todo `Milestone` do projeto ativo com `deadline` definido deve poder aparecer como um `CalendarEvent` do tipo `prazo_marco` — implemente isso como uma função de derivação (não duplique dados manualmente), e deixe uma opção de toggle "Mostrar prazos de marcos na Agenda" (ligada por padrão).

**UI:** visualização por mês, semana ou lista, com filtro por `type`. Reaproveite o padrão visual de card/timeline já usado em `RoadmapPage.tsx` como ponto de partida, mas sem a limitação fixa de 3 meses.

**Critério de aceite:** a Agenda mostra, para o projeto ativo, os prazos de marcos automaticamente, e permite adicionar manualmente eventos dos demais tipos (show, lançamento, reunião, avaliação trimestral).

---

## Tarefa 6 — Milestones: filtragem por projeto ativo

Em `MilestonesPage.tsx`, filtre `mockMilestones` por `projectId === activeProject.id` antes de aplicar os filtros de pilar/busca já existentes. Nenhuma outra mudança funcional nesta aba — o preenchimento continua 100% manual (criação/edição de marco, subtarefas e pilares), sem qualquer automação de status.

---

## Fora de escopo nesta rodada

Não implemente nesta rodada (fica para fases futuras já registradas no Documento Técnico):

- Backend real, persistência, autenticação ou multi-tenancy.
- Chamada real às APIs do Meta e do Google Trends — a Tarefa 4 usa exclusivamente o arquivo mock anexado.
- Qualquer lógica que decida ou classifique automaticamente algo que hoje é julgamento do gestor (status de hipótese artística, prioridade, validação de meta).
- Comentários por marco (`Comment`) — decisão de escopo ainda pendente com o cliente.

## Definition of Done (checklist geral)

- [ ] Trocar de projeto em `/projetos` reflete em todas as demais abas sem refresh.
- [ ] Navegação lateral mostra exatamente 5 itens: Projetos, Dashboard, Milestones, Indicadores, Agenda.
- [ ] Wizard de Definição Artística funciona em modo criação e em modo edição.
- [ ] `/dashboard` contém a Avaliação Trimestral como seção interna, 100% orientada a dados (sem texto livre).
- [ ] `/indicadores` exibe métricas reais de curtidas, comentários e alcance por rede social, a partir do arquivo mock anexado.
- [ ] `/agenda` existe, mostra prazos de marcos automaticamente e aceita outros tipos de evento manuais.
- [ ] `/milestones` só mostra marcos do projeto ativo.
- [ ] Nenhuma rota antiga (`/roadmap`, `/avaliacao`, `/configuracoes`) permanece acessível como página própria.

## Pontos em aberto a sinalizar no PR (não bloqueiam a entrega desta rodada)

- Regras de cálculo definitivas da Avaliação Trimestral (Tarefa 3) usam uma proposta inicial — precisam de validação final do cliente.
- Escopo dos Comentários por marco ainda não decidido.
- Escolha de backend definitivo ainda pendente (impacta quando o mock da Tarefa 4 será trocado por integração real).
