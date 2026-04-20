<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login, loading, error } = useAuth();

const email = ref('');
const password = ref('');

async function handleSubmit() {
    if (!email.value || !password.value) return;

    try {
        await login(email.value, password.value);
        router.push('/feed');
    } catch (err) {
        // Erro já é tratado pelo composable
        console.error('Login failed:', err);
    }
}
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <h1 class="logo">InstaClone</h1>

            <form @submit.prevent="handleSubmit" class="auth-form">
                <input v-model="email" type="email" placeholder="E-mail" required :disabled="loading" />
                <input v-model="password" type="password" placeholder="Senha" required :disabled="loading" />

                <button type="submit" :disabled="loading" class="btn-primary">
                    {{ loading ? 'Entrando...' : 'Entrar' }}
                </button>

                <p v-if="error" class="error-message">{{ error }}</p>
            </form>

            <div class="divider">
                <span>OU</span>
            </div>

            <p class="signup-link">
                Não tem uma conta? <router-link to="/register">Cadastre-se</router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: var(--color-bg);
}

.auth-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 40px;
    width: 100%;
    max-width: 350px;
    text-align: center;
}

.logo {
    font-family: 'Style Script', cursive, sans-serif;
    /* Simulação da fonte do Insta */
    font-size: 3rem;
    margin-bottom: 30px;
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
    cursor: not-allowed;
}

.error-message {
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

.signup-link {
    margin-top: 20px;
    font-size: 14px;
}

.signup-link a {
    color: var(--color-primary);
    font-weight: bold;
}
</style>