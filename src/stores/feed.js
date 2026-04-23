import { defineStore } from 'pinia';
import api from '../services/api';

export const useFeedStore = defineStore('feed', {
    state: () => ({
        postsById: {
            '999': {
                id: 999,
                caption: 'WOW',
                // Imagem de exemplo do Unsplash (Gato impressionado)
                image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
                likes_count: 125,
                isLiked: false,
                user: {
                    username: 'incrivel_meme_master',
                    avatar_url: 'https://i.pravatar.cc/150?u=999'
                },
                comments: [
                    { id: 1, content: 'Isso é incrível! 🔥', user: { username: 'dev_aluno' } }
                ]
            }
        },
        feedOrder: [999],
        isLoading: false,
        nextCursor: null,
    }),

    getters: {
        feedPosts: (state) => state.feedOrder.map(id => state.postsById[id]),
    },

    actions: {
        async fetchFeed() {
            this.isLoading = true;
            try {
                const { data } = await api.get('/feed');
                const posts = data.data || data;

                posts.forEach(post => {
                    this.postsById[post.id] = post;
                    if (!this.feedOrder.includes(post.id)) {
                        this.feedOrder.push(post.id);
                    }
                });

                this.nextCursor = data.next_cursor || null;
            } catch (error) {
                console.error("Erro ao carregar feed:", error);
                // Se der erro na API, mantemos nosso post de teste para você não ver a tela vazia
            } finally {
                this.isLoading = false;
            }
        },

        async createPost(formData) {
            try {
                const { data } = await api.post('/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                this.postsById[data.id] = data;
                this.feedOrder.unshift(data.id);
                return data;
            } catch (error) {
                throw error.response?.data?.message || 'Erro ao publicar post';
            }
        },

        async toggleLike(postId) {
            const post = this.postsById[postId];
            if (!post) return;

            post.isLiked = !post.isLiked;
            post.likes_count += post.isLiked ? 1 : -1;

            if (postId !== 999) {
                try {
                    await api.post(`/posts/${postId}/like`);
                } catch (error) {
                    post.isLiked = !post.isLiked;
                    post.likes_count += post.isLiked ? 1 : -1;
                }
            }
        },

        async addComment(postId, content) {
            if (postId === 999) {
                const fakeComment = {
                    id: Date.now(),
                    content,
                    user: { username: 'voce' }
                };
                this.postsById[postId].comments.push(fakeComment);
                return fakeComment;
            }

            try {
                const { data } = await api.post(`/posts/${postId}/comments`, { content });
                this.postsById[postId].comments.push(data);
                return data;
            } catch (error) {
                throw error.response?.data?.message || 'Erro ao comentar';
            }
        }
    }
});