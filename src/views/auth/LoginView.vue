<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import Spinner from '../../components/ui/Spinner.vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

async function handleSubmit() {
    loading.value = true;
    errorMsg.value = '';

    try {
        await authStore.login(email.value, password.value);
        router.push('/feed');
    } catch (err) {
        errorMsg.value = err;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="auth-box p-4 border mx-auto">
        <h1 class="text-center mb-5 logo-font">
            InstaClone
        </h1>

        <form @submit.prevent="handleSubmit">
            <div class="mb-2">
                <input v-model="email" type="email" class="ig-input" placeholder="E-mail" required />
            </div>
            <div class="mb-3">
                <input v-model="password" type="password" class="ig-input" placeholder="Senha" required />
            </div>

            <button type="submit" class="btn-ig w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                <span v-else>Entrar</span>
            </button>

            <div v-if="errorMsg" class="error-msg mt-3 text-center">
                {{ errorMsg }}
            </div>
        </form>
    </div>

    <div class="auth-box p-4 border mx-auto mt-3 text-center">
        <p class="mb-0 small">
            Não tem uma conta?
            <router-link to="/cadastro" class="text-primary fw-bold text-decoration-none">Cadastre-se</router-link>
        </p>
    </div>
</template>

<style scoped>
.auth-box {
    max-width: 350px;
    background-color: var(--bg-main);
}

.logo-font {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
}

.ig-input {
    width: 100%;
    padding: 9px 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text-primary);
    font-size: 0.75rem;
}

.ig-input:focus {
    border-color: var(--text-secondary);
    outline: none;
}
</style>