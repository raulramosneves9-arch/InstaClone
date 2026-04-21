import { defineStore } from 'pinia';
import { MOCK_USERS } from '../data/mockData';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        localAccounts: [] // Lista de usuários cadastrados no navegador
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUserId: (state) => state.user?.id
    },

    actions: {
        /**
         * Inicializa a store buscando dados no localStorage.
         * Se estiver vazio, carrega os MOCK_USERS como base inicial.
         */
        init() {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            const savedAccounts = localStorage.getItem('local_accounts');

            if (savedUser) this.user = JSON.parse(savedUser);
            if (savedToken) this.token = savedToken;

            // Se não houver contas salvas, semeia com os MOCK_USERS
            this.localAccounts = savedAccounts ? JSON.parse(savedAccounts) : MOCK_USERS;

            if (!savedAccounts) {
                localStorage.setItem('local_accounts', JSON.stringify(MOCK_USERS));
            }
        },

        async login(username, password) {
            // Simula delay de rede
            await new Promise(resolve => setTimeout(resolve, 800));

            const account = this.localAccounts.find(
                u => u.username === username && u.password === password
            );

            if (account) {
                const mockToken = `mock-token-${Date.now()}`;
                this.user = account;
                this.token = mockToken;

                localStorage.setItem('user', JSON.stringify(account));
                localStorage.setItem('token', mockToken);
                return account;
            }
            throw new Error('Usuário ou senha incorretos');
        },

        register(name, username, email, password) {
            const exists = this.localAccounts.some(u => u.username === username);
            if (exists) throw new Error('Este nome de usuário já está em uso');

            const newUser = {
                id: Date.now(),
                name,
                username,
                email,
                password,
                avatar: '',
                bio: '',
                followersCount: 0,
                followingCount: 0
            };

            this.localAccounts.push(newUser);
            localStorage.setItem('local_accounts', JSON.stringify(this.localAccounts));

            // Login automático após registro
            return this.login(username, password);
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
});