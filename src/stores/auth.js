import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('instaclone.token') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        // Inicializa a store (usado no App.vue)
        async init() {
            if (this.token) {
                await this.fetchMe();
            }
        },

        async fetchMe() {
            try {
                const response = await api.get('/auth/me');
                this.user = response.data;
            } catch (error) {
                await this.logout();
            }
        },

        async login(email, password) {
            try {
                const response = await api.post('/auth/login', { email, password });
                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('instaclone.token', this.token);
            } catch (error) {
                const message = error.response?.data?.message || 'Erro ao entrar';
                throw message;
            }
        },

        async register(formData) {
            try {
                const response = await api.post('/auth/register', formData);
                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('instaclone.token', this.token);
            } catch (error) {
                throw error.response?.data?.errors || 'Erro ao cadastrar';
            }
        },

        async logout() {
            try {
                await api.post('/auth/logout');
            } catch (error) {
            }

            this.user = null;
            this.token = null;
            localStorage.removeItem('instaclone.token');
        }
    }
});