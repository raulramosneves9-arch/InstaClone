# InstaClone Frontend Context (Estado Atual)

Documento resumido do estado real implementado no frontend.

## Stack

- Vue 3 + Vite
- Pinia
- Vue Router
- Axios
- Bootstrap 5 + Bootstrap Icons

## Estrutura atual

- `components/`: `Navbar`, `PostCard`, `Avatar`, `Spinner`, `ConfirmModal`
- `layouts/`: `AppLayout`, `AuthLayout`
- `router/`: rotas e guard global
- `services/`: `api.js` centralizado (única instância Axios)
- `stores/`: `auth`, `feed`, `discover`
- `views/`: telas de autenticação, feed, criar post, descobrir, perfil, editar perfil, lista de conexões, detalhes, 404

## Rotas implementadas

- `/login`, `/cadastro`
- `/feed`, `/criar`, `/descobrir`
- `/perfil`, `/perfil/editar`, `/perfil/lista/:type`
- `/posts/:postId`
- `/:pathMatch(.*)*` (NotFound)

## Convenções implementadas

- Layout dinâmico via `route.meta.layout` no `App.vue`
- Guard global com `requiresAuth` e `requiresGuest`
- Hidratação de sessão via `authStore.fetchMe()` quando há token salvo
- Persistência de token em `localStorage` com chave `instaclone.token`
- Interceptor de request adiciona `Authorization: Bearer <token>`
- Interceptor de response para `401` remove token e redireciona para `/login`

## Divergências em relação ao plano original

- Rotas foram implementadas em português (ex.: `/criar`, `/perfil`) em vez de versão em inglês
- Não existem `routeNames.js`, `stores/follows.js`, `profileUtils.js` ou `useImageUpload.js`
- Não há separação de serviços por domínio (`auth.service.js`, `posts.service.js`, etc.)
- Componentes especializados de comentário e perfil não foram extraídos; parte da lógica ainda está nas views
