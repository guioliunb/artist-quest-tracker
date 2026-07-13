# Prompt de execução — Funcionalidades de Valor de Venda (EPK, Linha do Tempo, Modo Demo)

> **Como usar este prompt:** cole este arquivo inteiro como instrução inicial em uma sessão de coding agent aberta na raiz do repositório `artist-quest-tracker`. **Pré-requisitos:** execute antes (ou pelo menos garanta que já existam) a Tarefa 1 do `prompt-dinamismo-visual.md` (componente `ArtistCoverHeader`) e a Tarefa 0 do `prompt-implementacao-proposta-mvp.md` (estado de cliente ativo unificado via `ProjectContext`). Execute as três tarefas abaixo **nesta ordem**: Linha do Tempo → EPK → Modo Demo — o Modo Demo, no final, existe justamente para mostrar as outras duas funcionalidades já populadas com dados convincentes.

## Contexto

Estas três funcionalidades não existem hoje no produto e não fazem parte do escopo funcional básico (marcos, indicadores, avaliação) — elas existem para **apoiar a venda da ferramenta**: dar ao gestor um artefato tangível para mostrar a terceiros (EPK), contar a história estratégica do trabalho ao longo do tempo (Linha do Tempo), e dar a um prospect uma forma de explorar o produto sem fricção antes de comprar (Modo Demo).

Vale o mesmo princípio já registrado nos documentos anteriores: nada aqui deve introduzir julgamento automático — a Linha do Tempo exibe fatos com data, não interpretações geradas pelo sistema.

---

## Tarefa 1 — Linha do tempo de evolução de carreira

**Objetivo:** hoje o Dashboard mostra só a fase de carreira atual destacada numa tira de 8 estágios (`CareerPhaseIndicator`), sem histórico. A ideia é substituir isso por uma linha do tempo real, com data de entrada em cada fase e marcos relevantes concluídos naquele período — contando a história do trabalho, não só o estado atual.

**Passos:**

1. **Modelo de dados.** Em `src/types/index.ts`, adicione:
   ```ts
   interface CareerPhaseHistoryEntry {
     id: string;
     projectId: string;
     phase: CareerPhase;
     startedAt: string; // ISO date
     note?: string; // anotação curta e factual, preenchida manualmente
   }
   ```
2. **Dado mock.** Em `src/data/mockData.ts`, crie `mockCareerPhaseHistory: CareerPhaseHistoryEntry[]` com uma progressão plausível para o projeto `p1` (RAY EL VOX), por exemplo:
   - `definicao_mda` iniciado em `2025-01-15`, nota: "Diagnóstico estratégico iniciado."
   - `experimentacao` iniciado em `2025-03-01`, nota: "Conceito artístico e pesquisa de nicho concluídos."
   (Ajuste as datas para bater com as datas já existentes em `mockMilestones`/`mockProject`.)
3. **Componente.** Crie `src/components/CareerTimeline.tsx`, recebendo `project: Project`, `history: CareerPhaseHistoryEntry[]`, `milestones: Milestone[]`.
   - Renderize uma trilha horizontal com os 8 estágios de `CAREER_PHASE_ORDER` (reaproveitando a lógica visual já existente de "concluído / atual / futuro" do `CareerPhaseIndicator`).
   - Para cada estágio que tenha uma entrada correspondente em `history`, mostre abaixo do ponto na trilha: a data de início (formatada com `formatDate` já existente em `lib/helpers.ts`) e a `note`, se houver, truncada a uma linha.
   - Para o estágio atual (`project.careerPhase`), plote como marcadores adicionais pequenos os `milestones` com `priority === 'critica'` e `status === 'concluido'` cujo `deadline` caia dentro do período daquela fase — um ponto menor sobre a trilha, com tooltip (`title` HTML nativo é suficiente) mostrando o título do marco.
4. **Integração.** Em `src/pages/Dashboard.tsx`, substitua o uso do componente `CareerPhaseIndicator` atual por `<CareerTimeline project={activeProject} history={mockCareerPhaseHistory.filter(h => h.projectId === activeProject.id)} milestones={filteredMilestones} />` (reaproveitando a lista de marcos já filtrada por projeto ativo, resultado da Tarefa 0 do prompt de implementação funcional).

**Critério de aceite:** o Dashboard mostra, para o projeto ativo, pelo menos duas fases com data de início visível (não apenas a fase atual destacada), mais os marcos críticos concluídos da fase atual como marcadores sobre a trilha. Um projeto novo, criado pelo wizard de Cadastro Artístico e sem histórico registrado, não quebra o componente — mostra a trilha normalmente, só sem anotações de data.

---

## Tarefa 2 — EPK exportável (one-pager do artista)

**Objetivo:** um botão que gera, a partir dos dados do cliente ativo, um PDF/imagem de uma página só, no estilo capa de revista, pronto para o gestor enviar a um selo, produtor ou marca — sem precisar copiar informação manualmente para outro programa.

**Passos:**

1. **Dependências.** Instale `html2canvas` e `jspdf` (`npm install html2canvas jspdf`) — ambos rodam no navegador, sem necessidade de backend.
2. **Componente de conteúdo.** Crie `src/components/epk/ArtistEPK.tsx`, um componente **puramente apresentacional** (sem interatividade) que renderiza, nesta ordem:
   - O `ArtistCoverHeader` já existente (Tarefa 1 do prompt de dinamismo visual), reaproveitado como está.
   - Um bloco "Posicionamento": `positioning.valueProposition` em destaque, seguido de `mainGenre` / `subGenre` / `culturalTerritory`.
   - Um bloco "Público": resumo de `audience` (faixa etária, cena cultural, plataformas principais como badges).
   - Um bloco de 3-4 indicadores-chave em formato de card numérico grande (reaproveitar o padrão visual de `MetricCard` da página Indicadores), priorizando: ouvintes mensais, alcance/reach, superfãs ativos, shows confirmados — usando os dados reais de mídias sociais (`social-metrics-sample.json`, adicionados pelo prompt de implementação funcional) quando disponíveis, com fallback para `mockDemandMetrics` caso a integração ainda não exista nesta branch.
   - Rodapé pequeno: nome do gestor/consultoria e data de geração do documento.
3. **Forçar tema claro no export.** Envolva `ArtistEPK` num contêiner com uma classe própria (ex. `epk-print-surface`) que define explicitamente os tokens de cor do modo claro do reskin Editorial Vinho (não herdar o tema atual do usuário) — o documento é para ser impresso/compartilhado externamente e deve funcionar bem em qualquer situação de leitura, independente do tema em que o gestor está usando o app no momento.
4. **Modal de prévia + exportação.** Adicione um botão "Exportar EPK" próximo ao cabeçalho do Dashboard (`Dashboard.tsx`), que abre um `Dialog` (componente shadcn já usado em outras partes do app) contendo:
   - Uma prévia ao vivo do `ArtistEPK` (renderizado dentro do modal, em tamanho reduzido ou com scroll).
   - Dois botões de ação: "Baixar PDF" e "Baixar imagem (PNG)".
5. **Lógica de exportação.** Ao clicar em qualquer um dos botões:
   - Use `html2canvas` para capturar o nó DOM do `ArtistEPK` renderizado (fora da tela, em tamanho real, não o preview reduzido) como um `canvas`.
   - Para PNG: `canvas.toDataURL('image/png')` e acione um download via um link `<a>` temporário com atributo `download`.
   - Para PDF: crie um documento `jsPDF` de uma página (tamanho A4 ou Letter, portrait), insira a imagem do canvas ajustada para caber na página inteira, e chame `.save()` com um nome de arquivo derivado do nome do artista (ex. `epk-ray-el-vox.pdf`).
6. **Nome de arquivo e feedback.** Use o nome do artista ativo (slugificado, sem acentos/espaços) no nome do arquivo gerado. Mostre um toast de confirmação (`sonner`, já usado no app) ao concluir o download.

**Critério de aceite:** clicar em "Exportar EPK" abre uma prévia fiel ao que será baixado; os botões geram, respectivamente, um PDF de uma página e um PNG, ambos legíveis e no tema claro, independentemente do tema atual da interface; o conteúdo reflete os dados reais do cliente ativo no momento do clique (não dados fixos).

---

## Tarefa 3 — Modo demo com artista fictício populado

**Objetivo:** uma rota acessível sem login, pré-carregada com um caso de sucesso fictício e visualmente completo, para prospects explorarem o produto sozinhos.

**Passos:**

1. **Dataset de demonstração.** Em `src/data/demoData.ts`, crie um segundo conjunto completo de dados mock — artista, projeto, marcos, pilares, indicadores, avaliação trimestral e `CareerPhaseHistoryEntry[]` — deliberadamente mais avançado e "bonito" que o seed padrão:
   - Artista fictício diferente do padrão (ex. "NOVA LUNA"), fase de carreira avançada (`tracao` ou `consolidacao`).
   - Marcos majoritariamente concluídos, com 1-2 em andamento e nenhum atrasado (para não passar impressão ruim numa demonstração).
   - Histórico de fase com pelo menos 4-5 entradas datadas, para a Linha do Tempo (Tarefa 1) aparecer rica.
   - Indicadores com tendência de crescimento consistente ao longo de vários meses (para os gráficos/cards de tendência mostrarem setas de alta).
   - Um arquivo de métricas sociais no mesmo formato de `social-metrics-sample.json`, com valores mais altos, para o EPK (Tarefa 2) gerar um one-pager visualmente impressionante.
2. **Rota pública.** Em `src/App.tsx`, adicione uma rota `/demo` que não passa por nenhuma verificação de login (o app hoje não tem guard de rota real, então isso é simples: basta a rota existir e não redirecionar).
3. **Provider isolado.** Para não misturar o dataset de demonstração com o dataset "real" usado no resto do app, envolva as rotas internas (`/demo/*`, se optar por sub-rotas, ou apenas o layout renderizado em `/demo`) em uma instância própria de `ProjectProvider` inicializada com o dataset de `demoData.ts` em vez do `mockData.ts` padrão — por exemplo, adicionando um parâmetro opcional ao `ProjectProvider` (`initialProjects`) usado apenas nesta rota.
4. **Sinalização visual.** Adicione uma faixa fixa no topo (ou dentro do `AppLayout`, condicional a uma prop/contexto `isDemo`) com o texto "Modo demonstração — dados fictícios", usando a cor de acento vinho, visível em todas as telas enquanto navegando dentro do modo demo.
5. **Ponto de entrada.** Em `src/pages/LandingPage.tsx`, adicione um segundo botão/link "Ver demonstração" ao lado do "Entrar" existente, apontando para `/demo`.

**Critério de aceite:** acessar `/demo` diretamente (sem login) carrega o app funcional com o artista fictício "NOVA LUNA", fase avançada, marcos majoritariamente concluídos, Linha do Tempo populada com várias datas, e o botão de EPK gerando um one-pager visualmente completo — tudo isso sem alterar ou ser afetado pelo dataset padrão usado fora de `/demo`. A faixa "Modo demonstração" fica visível em todas as telas dentro dessa rota.

---

## Fora de escopo nesta rodada

- Link público somente-leitura para compartilhar o Dashboard de um cliente real (ideia registrada, não escolhida para esta rodada).
- Qualquer geração de conteúdo do EPK por IA — todos os campos vêm diretamente dos dados já preenchidos no sistema pelo gestor.
- Persistência real do dataset de demonstração entre sessões — como o app inteiro ainda não tem backend, o modo demo reseta a cada refresh, igual ao restante do produto.

## Definition of Done

- [ ] Dashboard mostra a Linha do Tempo com pelo menos duas fases datadas e marcos críticos concluídos como marcadores.
- [ ] Botão "Exportar EPK" abre prévia e gera PDF e PNG de uma página, sempre no tema claro, com dados reais do cliente ativo.
- [ ] Rota `/demo` acessível sem login, com dataset fictício próprio ("NOVA LUNA"), isolado do dataset padrão.
- [ ] Faixa "Modo demonstração — dados fictícios" visível em todas as telas dentro de `/demo`.
- [ ] `LandingPage.tsx` tem um segundo ponto de entrada ("Ver demonstração") além do "Entrar" já existente.
