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
        async init() {
            if (this.token) {
                try {
                    await this.fetchMe();
                } catch (error) {
                    this.logout();
                }
            }
        },

        async login(email, password) {
            try {
                // Endpoint: POST /api/auth/login
                const { data } = await api.post('/auth/login', { email, password });

                this.token = data.access_token;
                this.user = data.user;

                localStorage.setItem('instaclone.token', this.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            } catch (error) {
                throw error.response?.data?.message || 'Erro ao fazer login';
            }
        },

        async register(userData) {
            try {
                // Endpoint: POST /api/auth/register
                const { data } = await api.post('/auth/register', userData);

                this.token = data.access_token;
                this.user = data.user;

                localStorage.setItem('instaclone.token', this.token);
            } catch (error) {
                throw error.response?.data?.errors || 'Erro no cadastro';
            }
        },

        async fetchMe() {
            const { data } = await api.get('/auth/me'); //
            this.user = data;
        },

        logout() {
            // Opcional: api.post('/auth/logout')
            this.user = null;
            this.token = null;
            localStorage.removeItem('instaclone.token');
            delete api.defaults.headers.common['Authorization'];
        },

        updateProfile(updatedUser) {
            this.user = { ...this.user, ...updatedUser };
        }
    },
});