# InstaClone (frontend) - Status real de implementacao

Checklist revisada com base no codigo atual do repositório.

## 1 - Setup do Projeto

- [x] Inicializar projeto com vue@latest
- [ ] Estrutura de pastas por dominio: `components/`, `composables/`, `layouts/`, `router/`, `services/`, `stores/`, `utils/`, `views/`
- [x] Vue Router com rota curinga `/:pathMatch(.*)*` servindo uma view `NotFound`
- [x] Todas as views devem ser lazy-loaded com `component: () => import(...)`
- [ ] Constantes de nomes de rota e tipos de lista em `src/router/routeNames.js`
- [ ] Pinia para estado compartilhado (`auth`, `feed`, `follows`)
- [x] Tema global em `src/assets/styles/theme.css` (importado no `main.js` apos Bootstrap)
- [ ] Google Fonts carregado por `<link rel="preconnect">` + stylesheet em `index.html`
- [x] Cliente axios centralizado em `src/services/api.js`
- [x] `.env.example` com `VITE_API_URL=http://localhost:8000/api`
- [x] `.dockerignore` excluindo `node_modules`, `dist`, `.env`, mantendo `.env.example`

## 2 - Autenticacao

- [x] Tela `/login` com campos `email` e `password`
- [x] Tela de registro (implementada em `/cadastro`, nao `/register`)
- [x] Store `auth` (Pinia) com estado `user`, `token`, `isAuthenticated`, actions `login`, `register`, `logout`, `fetchMe`
- [x] `POST /auth/login` devolve `access_token` e `user`; token salvo em `localStorage` (`instaclone.token`)
- [x] `POST /auth/register` cria conta e autentica
- [ ] `POST /auth/logout` limpa sessão local mesmo com token inválido (logout atual apenas local)
- [x] `GET /auth/me` hidrata o usuario atual
- [x] Servico de autenticacão via cliente central usado pela UI
- [x] Guards de rota `requiresAuth` / `requiresGuest`
- [x] Mensagens de erro exibidas inline abaixo do formulario
- [x] Código browser-only sem guards desnecessários de SSR

## 3 - Layout, Navegacao e Icones

- [x] `AuthLayout` para telas de visitante
- [x] `AppLayout` para area autenticada
- [x] Layout autenticado concentrado em `src/layouts/AppLayout.vue`
- [x] Shell autenticado responsivo (sidebar desktop e barra inferior mobile)
- [ ] Entradas de navegacao: `Home`, `Buscar`, `Criar`, `Perfil` (falta item de Buscar na navbar atual)
- [ ] Navegacao por constantes `ROUTE_NAMES`
- [x] `RouterView` usando `v-slot="{ Component }"` + `<component :is="Component" />`
- [ ] `AppIcon` com prop `filled`

## 4 - Feed (`/feed`)

- [x] `GET /feed` com paginação por cursor
- [x] Store `feed` normaliza posts em dicionario (`postsById`) + ordem (`feedOrder`)
- [x] Actions: `fetchFeed`, `loadMoreFeed`, `toggleLike`, `addComment`, `createPost`
- [ ] `normalizeComment` em `stores/feed.js`
- [ ] `defaultAuthor()` em `stores/profileUtils.js`
- [x] Botao "carregar mais" quando existe `nextCursor`
- [ ] Card com data relativa
- [x] Card com autor, imagem, curtidas, legenda, comentários e campo inline
- [ ] Comentar inline com payload `{ body }` (atual envia `content`)
- [ ] Descurtir via `DELETE /posts/:id/unlike` no feed (atual usa somente `POST /posts/:id/like`)

## 5 - Descobrir (`/discover`)

- [ ] Rota esperada `/discover` (atual: `/descobrir`)
- [x] `GET /users/suggestions` lista perfis sugeridos
- [x] `GET /users/:viewerId/following` para estado inicial de botao
- [ ] Estado de follow vindo de store `follows` (atual está em `discoverStore`)
- [ ] Store `follows` com `followingIds` e `pendingIds` reativos
- [x] Seguir/deixar de seguir por card
- [ ] Cards devem usar `components/profile/AccountCard.vue`
- [x] Clique no card abre perfil
- [x] Paginação por pagina (`?page=<n>`)

## 6 - Criar Post (`/create`)

- [ ] Rota esperada `/create` (atual: `/criar`)
- [x] Input file aceita `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- [x] Limite de 5 MB no cliente
- [x] Preview com `URL.createObjectURL` + cleanup
- [ ] Logica de upload em `composables/useImageUpload.js`
- [x] Campo de legenda com limite de 2200 e contador
- [x] Botao desabilitado sem imagem/legenda
- [x] `POST /posts` com `FormData`
- [x] Feedback de sucesso (redireciona para `/feed`) e erro

## 7 - Perfil (`/profile` e `/profile?user=<username>`)

- [ ] Rotas esperadas `/profile` (atual: `/perfil`)
- [x] `GET /users/{username}` resolve perfil alvo
- [x] Carrega posts/followers/following
- [x] `GET /users/{id}/is-following` para perfil de terceiros
- [ ] Ações de follow via store `follows` (atual direto na view/API)
- [x] Seguir/deixar de seguir no perfil
- [ ] Rota esperada `/profile/edit` (atual: `/perfil/editar`)
- [ ] Rotas esperadas `/profile/list/followers|following` (atual: `/perfil/lista/seguidores|seguindo`)
- [x] Grid de posts abre `/posts/:postId`
- [ ] `ProfileView` decomposto em `ProfileHeader`, `ProfileSummaryCards` e `ProfilePostGrid`

## 7.1 - Editar Perfil (`/profile/edit`)

- [x] `PUT /users/me` com `{ name, username, bio }`
- [x] `POST /users/me/avatar` com `FormData`
- [x] Limites: `name` 255, `username` 30 + regex, `bio` 500, avatar 2MB
- [ ] Constantes `PROFILE_*_MAX_LENGTH` em `stores/profileUtils.js`
- [ ] Logica de upload em `composables/useImageUpload.js`
- [x] Mensagens de erro por campo do backend

## 8 - Listas de Conexao (`/profile/list/:type`)

- [ ] `:type` deveria aceitar `followers` e `following` (atual: `seguidores` e `seguindo`)
- [ ] Tipos válidos via `CONNECTION_LIST_TYPES`
- [x] Respeita `?user=<username>`
- [x] Usa `GET /users/{id}/followers` e `GET /users/{id}/following` com paginação
- [x] Linhas mostram avatar, nome, username e botão de seguir/deixar de seguir
- [ ] Conta renderizada por `components/profile/AccountCard.vue`
- [ ] Estado de follow/pending via store `follows`
- [x] Botao de voltar para perfil de origem

## 9 - Detalhes do Post (`/posts/:postId`)

- [x] `GET /posts/:id` carrega post
- [x] `GET /posts/:id/comments` com paginação
- [ ] Componentes dedicados de comentário (`PostCommentList`, `PostCommentItem`, `PostCommentForm`)
- [x] Botao "carregar mais" comentarios
- [ ] Campo de comentar com payload `{ body }` (atual envia `content`)
- [x] `DELETE /comments/:id` apenas para autor
- [x] `DELETE /posts/:id` apenas para autor, redireciona `/feed`
- [x] Contadores de curtidas/comentarios do backend

## 10 - Datas e Performance

- [ ] Formatadores em `utils/dates.js` (arquivo atual é `utils/date.js`)
- [ ] `Intl.DateTimeFormat` hoistado para formatadores definidos em task
- [x] Build de produção mantém views em chunks separados (lazy routes)
- [x] Build de produção gera chunks em `dist/assets`

## 11 - 404

- [x] View `NotFound` com link para `/feed` (autenticado) ou `/login` (visitante)

## 12 - Docker e Entrega

- [x] `Dockerfile` multi-stage com `node:22-alpine` + `nginx:1.27-alpine`
- [x] `docker/nginx.conf` com `try_files $uri $uri/ /index.html`
- [x] `compose.yaml` expondo `3000:80` e passando `VITE_API_URL` como build-arg
- [x] `.dockerignore` exclui `node_modules`, `dist`, `.env` e preserva `.env.example`
- [x] `npm run build` gera bundle em `dist/`

## Fora de escopo deliberado

- TypeScript
- Otimizacao fina de importacao do Bootstrap
- Modal customizado para confirmacoes destrutivas
