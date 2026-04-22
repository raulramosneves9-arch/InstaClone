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
        // Transforma o objeto de IDs de volta em uma lista para o v-for do FeedView
        feedPosts: (state) => state.feedOrder.map(id => state.postsById[id]),
    },

    actions: {
        async fetchFeed() {
            this.isLoading = true;
            try {
                // O api.js já coloca o token automaticamente no cabeçalho
                const { data } = await api.get('/feed');

                //data.data costuma ser onde o Laravel coloca a lista na paginação
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

        // AÇÃO PARA O MÓDULO 6: Criar Post
        async createPost(formData) {
            try {
                // multipart/form-data é obrigatório para enviar arquivos/fotos
                const { data } = await api.post('/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Adiciona o novo post no topo da lista
                this.postsById[data.id] = data;
                this.feedOrder.unshift(data.id);

                return data;
            } catch (error) {
                throw error.response?.data?.message || 'Erro ao publicar post';
            }
        },

        // AÇÃO PARA CURTIR:
        async toggleLike(postId) {
            const post = this.postsById[postId];
            if (!post) return;

            // Otimismo visual: muda na tela antes mesmo da API responder
            post.isLiked = !post.isLiked;
            post.likes_count += post.isLiked ? 1 : -1;

            try {
                await api.post(`/posts/${postId}/like`);
            } catch (error) {
                // Se der erro na API, desfaz a mudança visual
                post.isLiked = !post.isLiked;
                post.likes_count += post.isLiked ? 1 : -1;
            }
        }
    }
});