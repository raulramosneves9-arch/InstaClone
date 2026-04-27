📋 tasks.md — INSTACLONE (VUE 3 + BOOTSTRAP CONTROLADO)
⚙️ REGRA GLOBAL (CRÍTICA)
## 🚫 Bootstrap NÃO pode dominar o visual

Usar Bootstrap APENAS para:
- layout (container, row, col)
- flex (d-flex, align-items, justify-content)
- espaçamento (gap, p-*, m-*)

NÃO usar:
- .card
- .btn padrão
- .bg-primary / cores Bootstrap
- sombras padrão

TODO estilo visual deve ser custom (Instagram-like)
🧠 🔖 GLOBAL — ARQUIVOS QUE NECESSITAM AJUSTE VISUAL
## 🎨 Visual Refactor Pending (Views)

- [x] FeedView.vue
- [x] PostDetailsView.vue
- [x] PerfilView.vue
- [x] ListaConexaoView.vue
- [x] NotFoundView.vue

## 🔐 Auth (baixa prioridade)

- [x] LoginView.vue
- [x] CadastroView.vue
- [x] CriarPostView.vue
- [x] EditarPerfilView.vue
- [x] DescobrirView.vue (Refatorado como Sugestões)
🧩 DETALHAMENTO (COM BOOTSTRAP CONTROLADO)
🎯 FeedView.vue (CRÍTICO)
Status: completed

Usar Bootstrap:
- container
- d-flex
- justify-content-center

NÃO usar:
- card

Ajustes:
- [x] max-width: 470px
- [x] centralização perfeita
- [x] fundo preto (#000)
- [x] espaçamento entre posts (16px) (via PostCard mb-3)
🎯 PostDetailsView.vue
Status: completed

Usar Bootstrap:
- grid (row/col)

Ajustes:
- [x] layout dividido (imagem + comentários)
- [x] sem card Bootstrap
- [x] borda: 1px solid #262626
🎯 PerfilView.vue
Status: completed

Usar Bootstrap:
- grid

Ajustes:
- [x] header alinhado (avatar + info)
- [x] grid de posts
- [x] botões SEM .btn padrão
🎯 ListaConexaoView.vue
Status: completed

Usar Bootstrap:
- d-flex
- gap

Ajustes:
- [x] lista limpa estilo seguidores
- [x] avatar + nome + botão
🎯 NotFoundView.vue
Status: completed

Ajustes:
- [x] centralização total
- [x] sem Bootstrap visual
🔐 AUTH (COM BOOTSTRAP CONTROLADO)
🎯 LoginView.vue
Status: completed

Usar Bootstrap:
- container
- d-flex

NÃO usar:
- .card
- .btn-primary

Ajustes:
- [x] inputs estilo Instagram
- [x] botão custom
- [x] fundo escuro
🎯 CadastroView.vue
Status: completed

Ajustes:
- [x] igual LoginView
Status: completed

Ajustes:
- [x] layout limpo
- [x] inputs minimalistas
🎯 EditarPerfilView.vue
Status: completed

Ajustes:
- [x] formulário consistente com perfil
🎯 DescobrirView.vue
Status: completed

Ajustes:
- [x] tipografia
- [x] alinhamento
🚀 ORDEM DE EXECUÇÃO (ATUALIZADA)
1. Sidebar (layout global)
2. FeedView.vue
3. PostCard.vue (componente)
4. PerfilView.vue
5. PostDetailsView.vue
6. Auth (por último)
💡 DICA DIRETA (ESSA AQUI É OURO)

Bootstrap é só o esqueleto
Instagram é o acabamento

👉 Se você usar .card, .btn, etc → já perdeu o visual.