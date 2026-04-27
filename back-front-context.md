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

  - Removed the invalid `flex-column: column;` line, keeping the correct `flex-direction: column;`.

### [2026-04-27] UI Enhancement: Discover/Search Profile Distribution
- **Objective**: Improve the layout and "distribution" of user profiles in the Discover/Suggestions page and implement search functionality.
- **Changes**:
  - Modified `AccountCard.vue` to support a vertical `grid` layout (centered avatar, name, and username with a card-like border).
  - Integrated `discoverStore` in `DescobrirView.vue` and expanded the store to handle user search (`GET /users/search`).
  - Implemented a debounced search bar in `DescobrirView.vue` that toggles between suggested users and search results.
  - Optimized the grid distribution to 4 columns on desktop and 2 columns on mobile for better visibility of vertical cards.
  - Added visual polish: empty states, custom pagination buttons, and improved typography.
- **Verification**: User search and suggestions both use the premium grid layout; responsive behavior verified.

### [2026-04-27] Fix: Profile Image Synchronization
- **Objective**: Fix the issue where the profile image doesn't update in the sidebar or profile view after being changed.
- **Changes**:
  - Updated `resolveImageUrl` utility to support an optional `forceRefresh` parameter (adds a timestamp to bypass browser cache).
  - Modified `Navbar.vue` to replace the generic profile icon with the user's actual avatar using the `Avatar` component.
  - Standardized `ProfileHeader.vue` and `EditarPerfilView.vue` to use the `Avatar` component and `resolveImageUrl`.
  - Implemented cache-busting in `EditarPerfilView.vue` to ensure the new avatar is displayed immediately after upload.
- **Verification**: Profile image now appears in the sidebar and updates correctly across all views after an edit.

### [2026-04-27] UI Enhancement: Premium Instagram-Like Home Layout
- **Objective**: Match the official Instagram desktop layout, providing a spacious and professional social experience.
- **Changes**:
- **`AccountCard.vue` Evolution**: Added a `sidebar` variant that matches Instagram's look:
    - Bold username on top, muted name below.
    - Avatars sized at 44px for sidebar items.
    - Follow/action actions displayed as blue text links on the far right.
- **Sidebar Revamp**: 
    - Added the **Current User Profile** at the top of the sidebar with a "Mudar" (Switch) action.
    - Refined the "Sugestões para você" section with a "Ver tudo" link and improved typography.
    - Implemented a clean footer with dot-separated links and Meta-inspired copyright.
- **Layout & Distribution**:
    - Feed width fixed at **630px** for consistent content delivery.
    - Sidebar width fixed at **319px**.
    - block-level alignment: Shifted the entire feed+sidebar block leftwards (`padding-left: 50px`) while maintaining a **64px** gap between them, matching the official desktop distribution.
    - Updated `AppLayout.vue` to allow a wider **1400px** container.
- **Verification**: Home page now looks nearly identical to the official Instagram desktop UI, with proper spacing on the right and a refined social sidebar.

### [2026-04-27] UI Enhancement: Dynamic Hover Sidebar
- **Objective**: Implement a narrow icon-only sidebar that expands to full text on hover, matching the official Instagram layout.
- **Changes**:
  - **Expandable Sidebar**: Refactored `Navbar.vue` to use a `72px` narrow state that expands to `245px` on hover with CSS transitions.
  - **New Navigation Items**: Added Reels, Messages (with red badge), Explore, Notifications, Dashboard, and Meta-inspired bottom links.
  - **Logo Logic**: Implemented a logo toggle that shows the Instagram icon when minimized and the brand text when expanded.
  - **Layout Adjustment**: Updated `AppLayout.vue` to set a fixed `72px` margin for the main content, preventing layout shifts during expansion.
  - **Icon Updates**: Expanded `AppIcon.vue` to support the full set of Instagram-like navigation icons.
- **Verification**: Smooth expansion/contraction verified; visual alignment with reference images confirmed.

---

## Pending Tasks (from TASKS.md)
- [ ] Implement user notifications (Task 11)
- [ ] Refactor stores to use `follows` store for social actions consistently.
