<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const error = ref('');
const isLoading = ref(false);

async function handleRegister() {
    if (form.value.password !== form.value.confirmPassword) {
        error.value = "As senhas não coincidem";
        return;
    }

    isLoading.value = true;
    error.value = '';

    try {
        await authStore.register(
            form.value.name,
            form.value.username,
            form.value.email,
            form.value.password
        );
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
            <p class="subtitle">Cadastre-se para ver fotos e vídeos dos seus amigos.</p>

            <form @submit.prevent="handleRegister" class="auth-form">
                <input v-model="form.email" type="email" placeholder="E-mail" required />
                <input v-model="form.name" type="text" placeholder="Nome completo" required />
                <input v-model="form.username" type="text" placeholder="Nome de usuário" required />
                <input v-model="form.password" type="password" placeholder="Senha" required />
                <input v-model="form.confirmPassword" type="password" placeholder="Confirmar Senha" required />

                <button type="submit" class="btn-primary" :disabled="isLoading">
                    {{ isLoading ? 'Cadastrando...' : 'Cadastre-se' }}
                </button>

                <p v-if="error" class="error-msg">{{ error }}</p>
            </form>

            <p class="footer-text">
                Tem uma conta?
                <router-link to="/login"><strong>Conecte-se</strong></router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
/* Reaproveita os estilos da LoginView */
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
    font-family: 'Style Script', cursive;
    font-size: 3rem;
    margin-bottom: 10px;
    background: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end));
    -webkit-background-clip: text;
    /* Compatibilidade Webkit (Chrome/Safari) */
    background-clip: text;
    /* Propriedade padrão (Firefox/Edge) */
    -webkit-text-fill-color: transparent;
}

.subtitle {
    color: var(--color-text-muted);
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 17px;
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

.error-msg {
    color: var(--color-danger);
    font-size: 14px;
    margin-top: 15px;
}

.footer-text {
    font-size: 14px;
    margin-top: 20px;
    border-top: 1px solid var(--color-border);
    padding-top: 20px;
    /* Corrigido de pt para padding-top */
}

.footer-text a {
    color: var(--color-primary);
}
</style>