import { defineStore } from 'pinia';
import api from '../services/api';

export const useFeedStore = defineStore('feed', {
    state: () => ({
        postsById: {},
        feedOrder: [],
        isLoading: false,
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
                const posts = data.data || data;

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

        // Envia o post (Meme + Legenda) para o Laravel
        async createPost(formData) {
            try {
                const { data } = await api.post('/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Adiciona o post retornado pelo back no topo do feed
                this.postsById[data.id] = data;
                this.feedOrder.unshift(data.id);

                return data;
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
                await api.post(`/posts/${postId}/like`);
            } catch (error) {
                // Reverte se o back falhar
                post.isLiked = !post.isLiked;
                post.likes_count += post.isLiked ? 1 : -1;
            }
        },

        async addComment(postId, content) {
            try {
                const { data } = await api.post(`/posts/${postId}/comments`, { content });

                if (!this.postsById[postId].comments) {
                    this.postsById[postId].comments = [];
                }

                this.postsById[postId].comments.push(data);
                return data;
            } catch (error) {
                throw error.response?.data?.message || 'Erro ao comentar';
            }
        }
    }
});