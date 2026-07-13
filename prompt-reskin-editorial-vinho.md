# Prompt de execução — Reskin visual "Editorial Vinho" (claro + escuro)

> **Como usar este prompt:** cole este arquivo inteiro como instrução inicial em uma sessão de coding agent (Claude Code ou equivalente) aberta na raiz do repositório `artist-quest-tracker`. Este prompt é independente do `prompt-implementacao-proposta-mvp.md` já existente — pode ser executado antes, depois, ou em paralelo (numa branch separada), já que ambos tocam arquivos diferentes na maior parte (este mexe em tokens de estilo; o outro mexe em rotas e dados).

## Contexto

O visual atual do app é o padrão gerado por template (shadcn/ui dark genérico, sem identidade própria). Foi decidido, em validação com o cliente, adotar a linha **Editorial** — tipografia serifada, régua grossa como assinatura visual, um único acento de cor forte — na paleta **Vinho**, com suporte completo a modo claro e escuro (alternável pelo usuário).

## Tarefa 1 — Tokens de cor (claro/escuro)

Localize o arquivo global de estilos onde as CSS custom properties do shadcn/Tailwind já estão definidas (tipicamente `src/index.css`, blocos `:root` e `.dark`) e o `tailwind.config.ts`. Substitua os valores das variáveis já existentes pelos abaixo, **preservando os nomes de variável já usados no projeto** (não renomeie tokens; apenas troque os valores). Se o arquivo já usa o formato de tripla HSL (`H S% L%`) em vez de hex, converta os valores abaixo para esse formato antes de aplicar.

| Token | Light | Dark |
|---|---|---|
| `background` | `#F5F1E8` | `#1C1714` |
| `foreground` | `#1A1A16` | `#EDE6DA` |
| `card` | `#FAF7F0` | `#241E19` |
| `border` | `#E1D9C4` | `#33291F` |
| `muted` | `#ECE5D5` | `#2A2119` |
| `muted-foreground` | `#6B6A63` | `#A79C8D` |
| `primary` / `accent` | `#7A2331` (vinho) | `#C9505F` (vinho claro) |
| `primary-foreground` | `#F5F1E8` | `#1C1714` |
| `status-completed` | `#3F6B4A` (verde-musgo) | `#7FAE8C` |
| `status-in-progress` | `#B8862E` (âmbar) | `#E0AA55` |
| `status-delayed` | `#A8342A` (vermelho-alerta) | `#E0726A` |
| `sidebar-background` | `#EFE8D8` | `#171310` |
| `sidebar-foreground` | `#1A1A16` | `#EDE6DA` |

**Importante:** `primary`/`accent` (vinho) é a cor de marca — usada em CTAs, tag de fase de carreira, item de navegação ativo. As três cores de status (`completed`/`in-progress`/`delayed`) são semânticas e devem continuar visualmente distintas entre si e do vinho — não as substitua pela cor de marca.

**Critério de aceite:** alternar entre claro e escuro não deixa nenhum elemento ilegível (checar contraste texto/fundo em ambos os modos); nenhuma cor de status fica igual à cor de marca.

## Tarefa 2 — Alternância de tema claro/escuro

O pacote `next-themes` já está instalado (`package.json`), mas não está sendo usado. Adicione um `ThemeProvider` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`) envolvendo o app em `src/App.tsx`, e um botão de alternância (ícone sol/lua) no rodapé de `AppSidebar.tsx`, próximo ao botão de recolher a barra lateral já existente.

**Critério de aceite:** o botão alterna entre claro e escuro instantaneamente, sem reload, e o app abre por padrão no modo escuro.

## Tarefa 3 — Tipografia editorial

Troque a fonte usada pela classe utilitária `font-display` (já aplicada em todos os títulos do app, ex. `font-display font-bold`) para uma serifada de caráter editorial — recomendo **Fraunces** (Google Fonts, pesos 600/700), que tem "optical sizing" desenhado para títulos grandes. Importe via `<link>` no `index.html` ou `@font-face`/`@import` no CSS global, e atualize `fontFamily.display` no `tailwind.config.ts` para apontar para ela. Mantenha a fonte sans atual (a que já é usada nos textos de corpo/labels) sem alteração — o contraste serifado (títulos) + sans (corpo) é intencional e faz parte da identidade editorial.

**Critério de aceite:** nomes de artista/projeto e títulos de página (`Dashboard`, `Milestones`, etc.) renderizam em Fraunces; labels, valores numéricos e texto de corpo continuam na fonte sans atual.

## Tarefa 4 — Motivo de assinatura: régua grossa

Adicione uma borda inferior de 2px sólida na cor `foreground` (não `border`) nos seguintes pontos — e apenas nesses, para não pesar visualmente a interface:

- No cabeçalho de artista/projeto no topo do Dashboard (`Dashboard.tsx`).
- No título `<h1>` de cada página (`Projetos`, `Milestones`, `Indicadores`, `Agenda`).

Não aplique essa régua em cards de conteúdo (marcos, indicadores, pilares) — eles continuam usando a borda fina padrão (`border`).

**Critério de aceite:** a régua grossa aparece exatamente nos cabeçalhos de página e no cabeçalho do artista, em nenhum outro lugar.

## Tarefa 5 — Navegação ativa

Em `AppSidebar.tsx`, troque o destaque do item de navegação ativo: em vez do preenchimento de fundo atual (`bg-accent`), use uma régua vertical de 3px na cor `primary` (vinho) à esquerda do item ativo, mantendo o texto em `foreground` (sem preenchimento de fundo). É um tratamento mais discreto e mais alinhado à linguagem editorial do que um "pill" preenchido.

**Critério de aceite:** o item de navegação ativo é identificável pela régua vinho à esquerda, não por um bloco de cor de fundo.

## Tarefa 6 — Ajustes pontuais

- `LandingPage.tsx`: o botão CTA usa hoje uma cor laranja hardcoded (`bg-[hsl(25,95%,53%)]`), que não pertence a nenhuma paleta editorial validada — troque pela cor `primary` (vinho) do token acima.
- `ProgressBar.tsx` e `src/lib/helpers.ts` (`getStatusColor`, `getStatusTextColor`, `getStatusDotColor`): confirme que os valores de cor batem com os tokens `status-completed`/`status-in-progress`/`status-delayed` da Tarefa 1, sem cores hardcoded fora do sistema de tokens.

## Definition of Done

- [ ] App abre em modo escuro por padrão; alternância para claro funciona sem reload.
- [ ] Nenhuma cor hardcoded fora do sistema de tokens (`bg-[hsl(...)]`, hex direto em classes) restante no código.
- [ ] Títulos de página e nome do artista renderizam em Fraunces; corpo/labels continuam na fonte sans.
- [ ] Régua grossa aparece apenas em cabeçalhos de página e no cabeçalho do artista.
- [ ] Item de navegação ativo usa régua vertical vinho, não preenchimento de fundo.
- [ ] Cores de status (completo/em andamento/atrasado) continuam distintas entre si e da cor de marca em ambos os modos.
