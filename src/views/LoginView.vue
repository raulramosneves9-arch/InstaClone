<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

async function handleLogin() {
    if (!username.value || !password.value) return;

    isLoading.value = true;
    error.value = '';

    try {
        await authStore.login(username.value, password.value);
        router.replace('/feed');
    } catch (err) {
        error.value = err.message;
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-card">
            <h1 class="insta-logo">InstaClone</h1>

            <form @submit.prevent="handleLogin" class="auth-form">
                <input v-model="username" type="text" placeholder="Nome de usuário" required :disabled="isLoading" />
                <input v-model="password" type="password" placeholder="Senha" required :disabled="isLoading" />

                <button type="submit" class="btn-primary" :disabled="isLoading">
                    <span v-if="!isLoading">Entrar</span>
                    <span v-else>Entrando...</span>
                </button>

                <p v-if="error" class="error-msg">{{ error }}</p>
            </form>

            <div class="divider">
                <span>OU</span>
            </div>

            <p class="footer-text">
                Não tem uma conta?
                <router-link to="/register"><strong>Cadastre-se</strong></router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-bg);
    padding: 20px;
}

.auth-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 40px;
    width: 100%;
    max-width: 350px;
    text-align: center;
}

.insta-logo {
    font-family: 'Style Script', cursive, sans-serif;
    font-size: 3rem;
    margin-bottom: 30px;
    background: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end));
    -webkit-background-clip: text;
    /* Para navegadores baseados em Webkit */
    background-clip: text;
    /* Propriedade padrão para compatibilidade */
    -webkit-text-fill-color: transparent;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input {
    padding: 10px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: 14px;
}

.btn-primary {
    background-color: var(--color-primary);
    color: white;
    padding: 8px;
    border-radius: var(--radius-sm);
    font-weight: bold;
    margin-top: 10px;
}

.btn-primary:disabled {
    opacity: 0.7;
}

.error-msg {
    color: var(--color-danger);
    font-size: 14px;
    margin-top: 15px;
}

.divider {
    margin: 20px 0;
    border-top: 1px solid var(--color-border);
    position: relative;
}

.divider span {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-surface);
    padding: 0 10px;
    color: var(--color-text-muted);
    font-size: 12px;
}

.footer-text {
    font-size: 14px;
    margin-top: 20px;
}

.footer-text a {
    color: var(--color-primary);
}
</style>