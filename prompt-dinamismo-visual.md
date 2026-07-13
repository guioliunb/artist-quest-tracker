# Prompt de execução — Dinamismo Visual (5 melhorias)

> **Como usar este prompt:** cole este arquivo inteiro como instrução inicial em uma sessão de coding agent aberta na raiz do repositório `artist-quest-tracker`. Execute **depois** do `prompt-reskin-editorial-vinho.md` — todas as tarefas abaixo assumem que os tokens de cor (claro/escuro) e a fonte serifada `font-display` (Fraunces) já foram aplicados. Execute as 5 tarefas em ordem: a Tarefa 1 cria um componente que a Tarefa 3 reaproveita.

## Contexto

O reskin Editorial Vinho definiu a paleta e a tipografia. Esta rodada adiciona movimento e textura à interface — pequenos detalhes que fazem o app parecer feito à mão, não gerado por template. Nenhuma tarefa aqui muda dados ou lógica de negócio, apenas apresentação.

---

## Tarefa 1 — Capa de artista estilo revista

**Objetivo:** transformar o cabeçalho de artista do Dashboard (hoje: avatar pequeno + nome + linha de texto) em algo com peso editorial — nome grande, uma citação em destaque puxada do DNA artístico, e uma linha de assinatura abaixo.

**Passos:**
1. Crie `src/components/ArtistCoverHeader.tsx`, recebendo como props `artist: Artist` e `project: Project`.
2. Estrutura do componente, de cima para baixo:
   - Eyebrow (rótulo pequeno, uppercase, tracking largo): fase de carreira atual (`CAREER_PHASE_LABELS[project.careerPhase]`).
   - Nome do artista em `font-display`, tamanho grande (ex. `text-4xl` ou `text-5xl` conforme espaço disponível), peso 700.
   - Bloco de citação: se `project.dna?.artisticConcept` existir, renderize em itálico serifado, tamanho maior que o corpo normal (ex. `text-xl md:text-2xl`), com uma aspa decorativa (`"`) grande e discreta posicionada à esquerda do texto (pode ser um caractere Unicode `“` estilizado com `font-display`, cor `muted-foreground`, posicionado com `absolute` ou apenas como primeiro caractere maior). Se o campo estiver vazio, mostre um texto de fallback: "Conceito artístico ainda não definido."
   - Linha de assinatura (byline): gênero do artista + `Q{currentQuarter} {currentYear}` + estágio (`project.stage`), separados por `·`, em texto pequeno uppercase `muted-foreground`.
3. Aplique a régua grossa de 2px (`border-bottom: 2px solid` na cor `foreground`) como borda inferior do componente inteiro — reaproveitando o padrão já definido no reskin.
4. Em `src/pages/Dashboard.tsx`, substitua o bloco de cabeçalho atual (avatar + nome + nome do projeto) por `<ArtistCoverHeader artist={activeArtist} project={activeProject} />`.

**Critério de aceite:** o cabeçalho do Dashboard mostra nome grande em serifada, uma citação do conceito artístico em destaque (ou o texto de fallback), e a régua grossa por baixo. O componente não quebra se `dna`, `positioning` ou campos opcionais estiverem `undefined`.

---

## Tarefa 2 — Progresso com preenchimento animado

**Objetivo:** todas as barras de progresso do app (pilares, marcos, comparação trimestral) devem preencher visualmente do zero até o valor real ao entrar na tela, em vez de aparecerem já cheias.

**Passos:**
1. Abra `src/components/ProgressBar.tsx`.
2. Adicione um estado local `const [displayValue, setDisplayValue] = useState(0);`.
3. Em um `useEffect` que roda uma única vez após a montagem (dependência `[]`), verifique `window.matchMedia('(prefers-reduced-motion: reduce)').matches`:
   - Se `true`, chame `setDisplayValue(clampedValue)` imediatamente (sem animação).
   - Se `false`, use `requestAnimationFrame` (ou `setTimeout` com um pequeno atraso, ex. 30ms) para chamar `setDisplayValue(clampedValue)` — o atraso garante que o navegador registre o estado inicial em 0% antes de aplicar a transição para o valor final, permitindo que a transição CSS já existente (`transition-all duration-700 ease-out`) anime visualmente.
4. Adicione um segundo `useEffect` com dependência `[clampedValue]` (ignorando a primeira renderização) para que, se o valor mudar depois (ex. usuário edita um marco e o progresso recalcula), a barra também anime da posição atual até a nova, em vez de saltar.
5. Troque o `style={{ width: `${clampedValue}%` }}` do preenchimento interno para usar `displayValue` no lugar de `clampedValue`.

**Critério de aceite:** ao abrir Dashboard, Milestones, Indicadores ou Avaliação, toda barra de progresso visível na tela anima de 0% até o valor correto ao carregar. Com `prefers-reduced-motion` ativado no sistema, as barras aparecem direto no valor final, sem animação.

---

## Tarefa 3 — Divisores editoriais

**Objetivo:** substituir as bordas simples que separam grandes seções de conteúdo por um divisor com um pequeno ornamento central, reforçando a identidade editorial — sem aplicar isso em todo canto (só entre seções, não entre itens de lista).

**Passos:**
1. Crie `src/components/SectionDivider.tsx`, um componente sem props obrigatórias (aceita `className?: string`).
2. Estrutura: um contêiner `relative` com uma linha horizontal fina (`border-t border-border`) ocupando 100% da largura, e um `<span>` centralizado absolutamente (`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0`) contendo um caractere ornamental (ex. `◆` ou `✳`, tamanho pequeno, cor `muted-foreground`), com `background-color: var(--background)` (ou a cor de fundo da seção onde está inserido) e um pequeno padding horizontal, para "cortar" a linha visualmente atrás do ornamento.
3. Aplique `<SectionDivider />` nos seguintes pontos (substituindo bordas/`<hr>` hoje usados como separador de seção, não de item de lista):
   - Entre "Visão Geral" e "Avaliação Trimestral" dentro da página Dashboard fundida (conforme o prompt de implementação funcional).
   - Entre os grupos de `MetricSection` na página Indicadores.
   - Entre os blocos de resumo (`ReviewSection`) e a seção de "Perguntas Estratégicas"/comparação por pilar na Avaliação Trimestral.
4. **Não aplique** este divisor entre itens de uma mesma lista (ex. entre marcos no modo lista, entre subtarefas) — nesses casos mantenha a borda fina simples já existente.

**Critério de aceite:** o ornamento aparece uma vez por divisor, centralizado, sem sobrepor texto, e se adapta automaticamente entre modo claro e escuro por já usar as variáveis de cor do tema.

---

## Tarefa 4 — Estados vazios ilustrados

**Objetivo:** nenhuma tela deve mostrar apenas uma frase seca tipo "Nenhum item encontrado" — trocar por uma pequena ilustração de traço simples + texto convidativo.

**Passos:**
1. Crie `src/components/EmptyState.tsx` recebendo props `illustration: 'milestones' | 'agenda' | 'indicadores' | 'projetos'`, `title: string`, `description: string`, `action?: { label: string; onClick: () => void }`.
2. Dentro do componente, crie 4 SVGs simples de traço único (`stroke="currentColor"`, `fill="none"`, `stroke-width="1.5"`, sem cor fixa — herda a cor do texto ao redor via `text-muted-foreground` no elemento pai), um para cada valor de `illustration`:
   - `milestones`: uma folha/checklist com 2-3 linhas e um check.
   - `agenda`: um calendário simples com um quadrado vazio no meio.
   - `indicadores`: um gráfico de linha simples subindo, com uma lupa.
   - `projetos`: uma pasta com um sinal de "+".
   - Mantenha cada SVG em no máximo ~10 linhas de path, sem detalhamento excessivo (traço reconhecível, não ilustração realista).
3. Layout do componente: ilustração centralizada (tamanho ~64-80px), título em `font-display`, descrição em texto secundário (`muted-foreground`), e o botão de ação (se fornecido) abaixo.
4. Substitua as seguintes ocorrências de texto vazio simples pelo novo componente:
   - `MilestonesPage.tsx`: `"Nenhum milestone encontrado."` → `<EmptyState illustration="milestones" .../>`.
   - `Dashboard.tsx`, seção "Próximos Passos"/"Em andamento": quando as listas estiverem vazias.
   - `ProjetosPage.tsx`: estado de lista de projetos vazia (se existir) → `<EmptyState illustration="projetos" action={{ label: 'Novo Projeto', onClick: () => setDialogOpen(true) }} />`.
   - Quando a página Agenda (do outro prompt) e a página Indicadores tiverem estados sem dados, aplique `illustration="agenda"` e `illustration="indicadores"` respectivamente.

**Critério de aceite:** buscando por strings como "Nenhum" ou "encontrado" no código, nenhuma delas deve mais estar solta em um `<p>` sem o componente `EmptyState` ao redor.

---

## Tarefa 5 — Hover com sublinhado editorial

**Objetivo:** títulos e itens clicáveis que hoje só mudam de cor no hover (ou nem reagem) ganham um sublinhado fino que se estende da esquerda para a direita.

**Passos:**
1. No arquivo de estilos globais (`src/index.css` ou equivalente), adicione uma classe utilitária `.link-editorial`:
   ```css
   .link-editorial {
     position: relative;
     text-decoration: none;
   }
   .link-editorial::after {
     content: '';
     position: absolute;
     left: 0;
     bottom: -2px;
     height: 1px;
     width: 0%;
     background-color: var(--primary);
     transition: width 200ms ease-out;
   }
   .link-editorial:hover::after,
   .link-editorial:focus-visible::after {
     width: 100%;
   }
   ```
2. Aplique a classe `link-editorial` em:
   - Títulos de marco clicáveis em `MilestonesPage.tsx` e nas linhas de marco do Dashboard (`MilestoneRow`).
   - Títulos de projeto em `ProjetosPage.tsx`.
   - Links de ação em texto (ex. "Editar perfil artístico", se implementado como link de texto e não botão).
3. **Não aplique** em botões com fundo preenchido (`<button>` com `bg-primary`, etc.) — esses mantêm o próprio estado de hover (`hover:opacity-90` ou equivalente já usado no app).

**Critério de aceite:** passar o mouse (ou navegar por teclado, `:focus-visible`) sobre um título de marco ou projeto mostra o sublinhado vinho se estendendo da esquerda para a direita em ~200ms; botões preenchidos não são afetados.

---

## Definition of Done

- [ ] Cabeçalho do Dashboard usa `ArtistCoverHeader`, com citação do DNA artístico em destaque.
- [ ] Toda barra de progresso anima do zero ao valor real ao carregar a tela, respeitando `prefers-reduced-motion`.
- [ ] `SectionDivider` aparece entre seções (não entre itens de lista) nos três locais listados na Tarefa 3.
- [ ] Nenhuma tela mostra texto de "vazio" sem passar pelo componente `EmptyState`.
- [ ] Títulos clicáveis de marco e projeto usam o sublinhado animado `.link-editorial`; botões preenchidos não foram alterados.
