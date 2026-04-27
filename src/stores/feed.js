import { defineStore } from 'pinia';
import api from '../services/api';
import { defaultAuthor } from './profileUtils';

const normalizeComment = (comment = {}) => ({
    id: comment.id ?? crypto.randomUUID(),
    content: comment.content ?? comment.body ?? '',
    user: {
        id: comment.user?.id ?? comment.author?.id ?? null,
        username: comment.user?.username ?? comment.author?.username ?? 'usuario',
        avatar_url: comment.user?.avatar_url ?? comment.author?.avatar_url ?? null,
    },
    created_at: comment.created_at ?? comment.createdAt ?? null,
});

const normalizePost = (post = {}) => ({
    ...post,
    user: post.user ?? defaultAuthor(),
    isLiked: Boolean(post.isLiked ?? post.is_liked),
    likes_count: Number(post.likes_count ?? post.likesCount ?? 0),
    comments_count: Number(post.comments_count ?? post.commentsCount ?? post.comments?.length ?? 0),
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
        feedPosts: (state) => state.feedOrder.map(id => state.postsById[id]),
    },

    actions: {
        // Busca os posts reais do seu banco
        async fetchFeed() {
            this.isLoading = true;
            try {
                const { data } = await api.get('/feed');
                const posts = (data.data || data).map(normalizePost);

                posts.forEach(post => {
                    this.postsById[post.id] = post;
                });

                this.feedOrder = posts.map(post => post.id);
                this.nextCursor = data.next_cursor || null;
            } catch (error) {
                console.error("Erro ao carregar feed:", error);
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

                posts.forEach(post => {
                    this.postsById[post.id] = post;
                    if (!this.feedOrder.includes(post.id)) {
                        this.feedOrder.push(post.id);
                    }
                });

                this.nextCursor = data.next_cursor || null;
            } catch (error) {
                console.error("Erro ao carregar mais feed:", error);
            } finally {
                this.isFetchingMore = false;
            }
        },

        // Envia o post (Meme + Legenda) para o Laravel
        async createPost(formData) {
            try {
                const { data } = await api.post('/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const postData = normalizePost(data.data || data);

                // Adiciona o post retornado pelo back no topo do feed
                this.postsById[postData.id] = postData;
                this.feedOrder.unshift(postData.id);

                return postData;
            } catch (error) {
                console.error("Erro no upload:", error);
                throw error.response?.data?.message || 'Erro ao publicar post';
            }
        },

        async toggleLike(postId) {
            const post = this.postsById[postId];
            if (!post) return;

            // Otimismo no Front (muda antes da resposta do back)
            post.isLiked = !post.isLiked;
            post.likes_count += post.isLiked ? 1 : -1;

            try {
                if (post.isLiked) {
                    await api.post(`/posts/${postId}/like`);
                } else {
                    await api.delete(`/posts/${postId}/unlike`);
                }
            } catch (error) {
                // Reverte se o back falhar
                post.isLiked = !post.isLiked;
                post.likes_count += post.isLiked ? 1 : -1;
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
                post.comments_count = Number(post.comments_count ?? 0) + 1;
                return comment;
            } catch (error) {
                throw error.response?.data?.message || 'Erro ao comentar';
            }
        }
    }
});