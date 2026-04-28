import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('instaclone.token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

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

export default api;