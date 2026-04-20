import axios from 'axios';

// Criamos a instância usando a variável de ambiente definida no módulo anterior
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Interceptor de Request:
 * Antes de cada chamada, verificamos se existe um token no localStorage.
 * Se houver, injetamos no Header Authorization.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor de Response:
 * Monitoramos as respostas do servidor. Se recebermos um 401 (Não autorizado),
 * limpamos os dados locais e redirecionamos para o login.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Usamos window.location para garantir um "hard reset" no estado da aplicação
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;