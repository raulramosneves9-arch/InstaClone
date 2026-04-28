import { defineStore } from 'pinia';
import api from '../services/api';
import { defaultAuthor } from './profileUtils';

const DEFAULT_USERNAME = 'user';

/**
 * Normalizes user data from API responses.
 */
const normalizeUser = (user = {}) => ({
    id: user.id ?? null,
    username: user.username ?? DEFAULT_USERNAME,
    avatarUrl: user.avatar_url ?? user.avatarUrl ?? null,
});

/**
 * Normalizes comment data from API responses.
 */
const normalizeComment = (comment = {}) => ({
    id: comment.id ?? crypto.randomUUID(),
    content: comment.content ?? comment.body ?? '',
    user: normalizeUser(comment.user ?? comment.author),
    createdAt: comment.created_at ?? comment.createdAt ?? null,
});

/**
 * Normalizes post data from API responses.
 */
const normalizePost = (post = {}) => ({
    ...post,
    user: post.user ?? defaultAuthor(),
    isLiked: Boolean(post.isLiked ?? post.is_liked),
    likesCount: Number(post.likes_count ?? post.likesCount ?? 0),
    commentsCount: Number(post.comments_count ?? post.commentsCount ?? post.comments?.length ?? 0),
    comments: Array.isArray(post.comments) ? post.comments.map(normalizeComment) : [],
});

export const useFeedStore = defineStore('feed', {
    state: () => ({
        postsById: {},
        feedOrder: [],
        isLoading: false,
        isFetchingMore: false,
        nextCursor: null,
    }),

    getters: {
        /**
         * Returns the feed posts in display order.
         */
        feedPosts: (state) => state.feedOrder.map(id => state.postsById[id]),
    },

    actions: {
        // Método privado para adicionar posts à store sem duplicação
        _addPostsToStore(posts) {
            posts.forEach(post => {
                if (!this.postsById[post.id]) {
                    this.postsById[post.id] = post;
                    this.feedOrder.push(post.id);
                }
            });
        },

        // Busca o feed inicial do backend
        async fetchFeed() {
            this.isLoading = true;
            try {
                const { data } = await api.get('/feed');
                const posts = (data.data || data).map(normalizePost);

                this.postsById = {};
                this.feedOrder = [];
                this._addPostsToStore(posts);
                this.nextCursor = data.next_cursor || null;
            } catch (error) {
                console.error("Erro ao carregar feed:", error);
                throw new Error('Falha ao carregar feed');
            } finally {
                this.isLoading = false;
            }
        },

        async loadMoreFeed() {
            if (!this.nextCursor || this.isFetchingMore) return;
            this.isFetchingMore = true;
            try {
                const { data } = await api.get(`/feed?cursor=${this.nextCursor}`);
                const posts = (data.data || data).map(normalizePost);

                this._addPostsToStore(posts);
                this.nextCursor = data.next_cursor || null;
            } catch (error) {
                console.error("Erro ao carregar mais feed:", error);
                throw new Error('Falha ao carregar mais feed');
            } finally {
                this.isFetchingMore = false;
            }
        },

        // Cria um novo post e adiciona no topo do feed
        async createPost(formData) {
            try {
                const { data } = await api.post('/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const newPost = normalizePost(data.data || data);

                // Adiciona o novo post no topo do feed
                this.postsById[newPost.id] = newPost;
                this.feedOrder.unshift(newPost.id);

                return newPost;
            } catch (error) {
                console.error("Erro ao criar post:", error);
                throw error.response?.data?.message || 'Erro ao publicar post';
            }
        },

        async toggleLike(postId) {
            const post = this.postsById[postId];
            if (!post) return;

            // Atualização otimista
            const wasLiked = post.isLiked;
            post.isLiked = !wasLiked;
            post.likesCount += post.isLiked ? 1 : -1;

            try {
                const endpoint = post.isLiked ? 'like' : 'unlike';
                await api.post(`/posts/${postId}/${endpoint}`);
            } catch (error) {
                console.error('Falha ao alternar like:', error);
                // Reverte em caso de falha
                post.isLiked = wasLiked;
                post.likesCount += wasLiked ? 1 : -1;
                throw new Error('Falha ao atualizar like');
            }
        },

        async addComment(postId, content) {
            try {
                const { data } = await api.post(`/posts/${postId}/comments`, { body: content });
                const comment = normalizeComment(data.data || data);
                const post = this.postsById[postId];

                if (!post.comments) {
                    post.comments = [];
                }

                post.comments.push(comment);
                post.commentsCount = Number(post.commentsCount ?? 0) + 1;
                return comment;
            } catch (error) {
                console.error('Erro ao adicionar comentário:', error);
                throw error.response?.data?.message || 'Erro ao comentar';
            }
        }
    }
});