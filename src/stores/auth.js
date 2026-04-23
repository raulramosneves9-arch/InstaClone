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

        // Busca os dados do usuário logado
        async fetchMe() {
            try {
                // Tentamos /user, que é o padrão do Laravel Sanctum
                const response = await api.get('/user');
                this.user = response.data;
            } catch (error) {
                console.warn("Rota /user não encontrada, tentando /me...");
                try {
                    const response = await api.get('/me');
                    this.user = response.data;
                } catch (e) {
                    this.logout();
                }
            }
        },

        // Realiza o Login
        async login(email, password) {
            try {
                const response = await api.post('/auth/login', { email, password });
                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('instaclone.token', this.token);
            } catch (error) {
                // Lança o erro para ser capturado pela View (LoginView)
                const message = error.response?.data?.message || 'Erro ao entrar';
                throw message;
            }
        },

        // Realiza o Registro (Cadastro)
        async register(formData) {
            try {
                const response = await api.post('/auth/register', formData);
                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('instaclone.token', this.token);
            } catch (error) {
                // Retorna os erros de validação do Laravel (e-mail já existe, etc)
                throw error.response?.data?.errors || 'Erro ao cadastrar';
            }
        },

        // Logout
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('instaclone.token');
        }
    }
});