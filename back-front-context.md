# InstaClone - Unified Context (Backend & Frontend)

This document serves as the single source of truth for the project state, combining API definitions and frontend architecture.

## Backend API Overview

### General Information
- **API Version**: 1.0.0
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Laravel Sanctum (Bearer Token)

### Key Endpoints
- `POST /auth/register` / `POST /auth/login`
- `GET /auth/me`
- `GET /feed` (Cursor pagination)
- `POST /posts` (Create post with image/caption)
- `GET /users/{username}` (Profile)
- `POST /users/{id}/follow` / `DELETE /users/{id}/unfollow`

---

## Frontend Architecture

### Stack
- Vue 3 (Composition API)
- Pinia (Stores: `auth`, `feed`, `discover`)
- Vue Router
- Axios (Centralized service)
- Bootstrap 5 + Custom Theme (`theme.css`)

### Current Structure
- `src/components/ui/`: `Avatar`, `Spinner`, `ConfirmModal`
- `src/stores/`: `auth.js`, `feed.js`, `discover.js`
- `src/composables/`: `useImageUpload.js`
- `src/views/`: `FeedView`, `CriarPostView`, `DescobrirView`, `PerfilView`, etc.

---

## Recent Changes & Fixes

### [2026-04-27] UI Enhancement: CriarPostView
- **Objective**: Improve visual aesthetics and layout distribution for the "Create Post" card.
- **Changes**:
  - Implemented a modern card design (max-width 900px) with fixed height (600px) for better desktop proportions.
  - Refined the image upload placeholder with a custom Instagram-inspired SVG icon and improved typography.
  - Optimized layout distribution: 60% image / 40% info side with a vertical border separator.
  - Added glassmorphism-inspired loading overlay with backdrop blur.
  - Integrated subtle animations (`fade-in`, `slide-up`) for smoother UX.
  - Improved mobile responsiveness with aspect-ratio handling for the image side.
  - Enhanced the caption area with better spacing, user context (avatar/username), and character counter.
- **Verification**: UI elements align with the premium design direction; responsive behavior confirmed for desktop and mobile layouts.

---

## Pending Tasks (from TASKS.md)
- [ ] Implement search functionality (Task 10)
- [ ] Implement user notifications (Task 11)
- [ ] Refactor stores to use `follows` store for social actions.
