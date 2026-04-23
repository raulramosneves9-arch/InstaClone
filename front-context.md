# InstaClone Frontend Context

This document outlines the architecture, tech stack, and conventions used in the InstaClone frontend project. It is intended to provide context for future development tasks.

## Tech Stack
- **Framework**: Vue 3 (Composition API & `<script setup>`)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Bootstrap 5 + Bootstrap Icons, with custom overrides in `src/assets/styles/theme.css`.
- **HTTP Client**: Axios

## Architecture & Structure
The project follows a domain-based directory structure inside `src/`:
- `components/`: Reusable UI components (e.g., `PostCard.vue`).
- `composables/`: Reusable logic.
- `layouts/`: Layout wrappers. `AppLayout.vue` for authenticated areas, `AuthLayout.vue` for public pages.
- `router/`: Vue Router configuration.
- `services/`: API integration and external services.
- `stores/`: Pinia state modules.
- `views/`: Page-level components matching routes.

## Routing System
- **Dynamic Layouts**: `App.vue` dynamically switches layouts based on `route.meta.layout`.
- **Guards**: A global `beforeEach` guard checks authentication status.
  - `requiresAuth`: Redirects unauthenticated users to `/login`.
  - `requiresGuest`: Redirects authenticated users away from `/login` or `/cadastro` to `/feed`.
- **Session Restoration**: If a token exists in `localStorage` but the user state is empty on page load, the router attempts to restore the session via `authStore.fetchMe()`.

## State Management (Pinia)
- **`auth` Store**: Manages user authentication, token storage (`instaclone.token`), and login/register/logout actions.
- **`feed` Store**: Normalizes posts (`postsById` object and `feedOrder` array) for optimal performance. Handles optimistic UI updates (e.g., liking a post before the API responds).

## API Integration (`src/services/api.js`)
- Centralized Axios instance.
- Base URL configured via `VITE_API_URL` environment variable.
- **Request Interceptor**: Automatically injects `Authorization: Bearer <token>` if a token is present in `localStorage`.
- **Response Interceptor**: Catches `401 Unauthorized` errors globally, clears the local token, and forces a redirect to `/login`.

## Key Views
- **Feed (`/feed`)**: Displays posts from followed users. Implements cursor-based pagination.
- **Criar Post (`/criar`)**: Form for uploading an image (`multipart/form-data`) and a caption.
- **Auth (`/login`, `/cadastro`)**: User authentication pages.
- **Perfil (`/perfil`)**: Displays user profile, stats (followers/following), and a grid of posts.

## Docker & Deployment
- A `.dockerignore` file is configured to exclude `node_modules`, `dist`, and local `.env` files while preserving `.env.example` for the Docker build context.

## Known Tasks & Future Work
Refer to `TASKS.md` in the project root for a detailed breakdown of the implementation roadmap, including features like "Descobrir" (Explore), Notifications, and specific UI interactions.
