# InstaClone Backend API Context

This document summarizes the InstaClone backend REST API based on its OpenAPI specification.

## General Information
- **API Version**: 1.0.0
- **Base URL**: `http://localhost:8000/api` (Local Dev)
- **Authentication**: Laravel Sanctum personal access tokens.
  - Required format: `Authorization: Bearer <token>`
  - Tokens are obtained via `POST /auth/login` or `POST /auth/register`.

## API Endpoints Overview

### Auth
- `POST /auth/register`: Creates a new user and returns a token.
- `POST /auth/login`: Authenticates a user and returns a token.
- `POST /auth/logout`: Revokes the current token.
- `POST /auth/refresh`: Rotates the current token.
- `GET /auth/me`: Retrieves the currently authenticated user's details.

### Users
- `GET /users/search`: Search users by name or username (paginated).
- `PUT /users/me`: Update authenticated user's profile (name, username, bio).
- `POST /users/me/avatar`: Upload avatar image (`multipart/form-data`).
- `GET /users/{username}`: Retrieve a user's public profile.

### Follow System
- `GET /users/{id}/followers`: Paginated list of followers.
- `GET /users/{id}/following`: Paginated list of users the target follows.
- `GET /users/{id}/is-following`: Boolean check if the authenticated user follows the target.
- `POST /users/{id}/follow`: Follow a user (idempotent).
- `DELETE /users/{id}/unfollow`: Unfollow a user (idempotent).

### Posts
- `POST /posts`: Create a post with image (`multipart/form-data`, max 5MB) and caption.
- `GET /posts/{post}`: Retrieve a specific post.
- `PUT /posts/{post}`: Update a post's caption.
- `DELETE /posts/{post}`: Delete a post.
- `GET /users/{id}/posts`: Paginated list of a specific user's posts.

### Feed
- `GET /feed`: Retrieve the authenticated user's feed (posts from followed users). Cursor-paginated (supports `cursor` parameter).

### Likes
- `POST /posts/{post}/like`: Like a post (idempotent).
- `DELETE /posts/{post}/unlike`: Unlike a post (idempotent).
- `GET /posts/{post}/likes`: Paginated list of users who liked the post.

### Comments
- `GET /posts/{post}/comments`: Paginated list of comments on a post.
- `POST /posts/{post}/comments`: Add a comment to a post.
- `PUT /comments/{comment}`: Update a comment (author only).
- `DELETE /comments/{comment}`: Delete a comment (author only).

### Notifications
- `GET /notifications`: Paginated list of notifications.
- `GET /notifications/unread-count`: Get the number of unread notifications.
- `PUT /notifications/read`: Mark all notifications as read.

## Pagination
- The API uses standard length-aware pagination for most list endpoints (supports `page` and `per_page` query parameters).
- The `/feed` endpoint uses cursor-based pagination.
