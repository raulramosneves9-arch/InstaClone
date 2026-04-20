import api from './api';

const authService = {
    /**
     * Envia credenciais e retorna token + dados do usuário
     */
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    /**
     * Cria uma nova conta
     */
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Limpa a sessão
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;