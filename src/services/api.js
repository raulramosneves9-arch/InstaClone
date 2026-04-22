import axios from 'axios';

/**
 * Instância centralizada do Axios.
 * A baseURL utiliza a variável de ambiente definida no .env.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

/**
 * INTERCEPTOR DE REQUEST:
 * Antes de cada requisição, verifica se existe um token no localStorage.
 * Se existir, injeta o cabeçalho Authorization: Bearer <token>.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('instaclone.token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * INTERCEPTOR DE RESPONSE:
 * Monitoriza as respostas da API.
 * Se o status for 401 (Não Autorizado), limpa o token e redireciona para o login.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se a API retornar 401, a sessão expirou ou o token é inválido
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('instaclone.token');

            // Redirecionamento forçado para garantir a limpeza do estado da app
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Exportação obrigatória como default conforme o contrato técnico
export default api;