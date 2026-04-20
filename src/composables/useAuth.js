import { ref, computed } from 'vue';
import authService from '../services/authService';

// Estado global compartilhado entre componentes
const user = ref(authService.getCurrentUser());
const loading = ref(false);
const error = ref(null);

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value);

    async function login(email, password) {
        loading.value = true;
        error.value = null;
        try {
            const data = await authService.login(email, password);
            user.value = data.user;
            return data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Falha ao entrar. Verifique suas credenciais.';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function logout() {
        authService.logout();
        user.value = null;
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout
    };
}