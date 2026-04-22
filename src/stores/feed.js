import { defineStore } from 'pinia';
import api from '../services/api';

export const useFeedStore = defineStore('feed', {
    state: () => ({
        postsById: {},      // Dicionário para acesso rápido
        feedOrder: [],      // IDs ordenados
        nextCursor: null,
        isLoading: false
    }),

    getters: {
        feedPosts: (state) => state.feedOrder.map(id => state.postsById[id])
    },

    actions: {
        async fetchFeed() {
            this.isLoading = true;
            try {
                // Endpoint: GET /api/feed
                const { data } = await api.get('/feed');

                // Normalização dos dados
                data.data.forEach(post => {
                    this.postsById[post.id] = post;
                });

                this.feedOrder = data.data.map(post => post.id);
                this.nextCursor = data.next_cursor;
            } finally {
                this.isLoading = false;
            }
        },

        async toggleLike(postId) {
            const post = this.postsById[postId];
            if (!post) return;

            // Atualização Otimista: muda na tela antes de ir pro banco
            const originalState = { ...post };
            post.isLiked = !post.isLiked;
            post.likesCount += post.isLiked ? 1 : -1;

            try {
                if (post.isLiked) {
                    await api.post(`/posts/${postId}/like`); //
                } else {
                    await api.delete(`/posts/${postId}/unlike`); //
                }
            } catch (error) {
                // Reverte se a API falhar
                this.postsById[postId] = originalState;
            }
        },

        async createPost(formData) {
            // Recebe FormData para suportar upload de arquivos reais
            const { data } = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            this.postsById[data.id] = data;
            this.feedOrder.unshift(data.id); // Novo post no topo
        }
    }
});