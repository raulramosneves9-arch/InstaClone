# InstaClone - Frontend (Vue 3)

Frontend SPA do InstaClone usando Vue 3 + Vite + Pinia + Vue Router.
Este README foi atualizado para refletir o estado atual do código no repositório.

## Tecnologias

- Vue 3 (Composition API com `<script setup>`)
- Vite 8
- Pinia
- Vue Router
- Axios
- Bootstrap 5 + Bootstrap Icons

## Requisitos

- Node.js `^20.19.0 || >=22.12.0`

## Como rodar

```bash
npm install
npm run dev
```

App em desenvolvimento: `http://localhost:5173`

Build de produção:

```bash
npm run build
npm run preview
```

## Variáveis de ambiente

Arquivo `.env.example`:

```env
VITE_API_URL=http://localhost:8000/api
```

## Docker

```bash
docker compose up --build
```

Frontend disponível em `http://localhost:3000`.

## Estrutura atual

```txt
src/
  assets/styles/theme.css
  components/
    post/PostCard.vue
    ui/Avatar.vue
    ui/ConfirmModal.vue
    ui/Spinner.vue
    Navbar.vue
  layouts/
    AppLayout.vue
    AuthLayout.vue
  router/index.js
  services/api.js
  stores/
    auth.js
    feed.js
    discover.js
  utils/
    date.js
    format.js
  views/
    FeedView.vue
    CriarPostView.vue
    DescobrirView.vue
    PerfilView.vue
    EditarPerfilView.vue
    ListaConexaoView.vue
    PostDetailsView.vue
    NotFoundView.vue
    auth/
      LoginView.vue
      CadastroView.vue
```

## Rotas atuais

- `/login`
- `/cadastro`
- `/feed`
- `/criar`
- `/descobrir`
- `/perfil`
- `/perfil/editar`
- `/perfil/lista/:type`
- `/posts/:postId`
- `/:pathMatch(.*)*` (404)

## O que já está implementado

- Autenticação com persistência de token em `localStorage` (`instaclone.token`)
- Guardas de rota para páginas autenticadas e guest
- Feed com carregamento inicial e paginação por cursor
- Criar post com upload de imagem + legenda
- Curtir e comentar no feed e na tela de detalhes do post
- Descobrir usuários com paginação e ação de seguir/deixar de seguir
- Perfil próprio e de terceiros, incluindo lista de posts
- Editar perfil (dados básicos e avatar)
- Lista de conexões (seguidores/seguindo)
- Build multi-stage com Nginx para SPA (history mode)

## Observações importantes do estado atual

- Os nomes de rota e paths estão em português (ex.: `/criar`, `/perfil`).
- Existe apenas um serviço Axios central (`src/services/api.js`), sem separação por domínio.
- Não há `stores/follows.js`, `routeNames.js`, `composables/useImageUpload.js` ou componentes separados de comentário.
- Alguns itens planejados em `TASKS.md` ainda não estão concluídos.