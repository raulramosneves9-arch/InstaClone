<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Spinner from '@/components/ui/Spinner.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '' // Padrão do Laravel: password_confirmation
});

const errors = ref({}); // Objeto para erros de validação
const isLoading = ref(false);

async function handleRegister() {
    isLoading.value = true;
    errors.value = {};

    try {
        await authStore.register(form.value);
        router.replace('/');
    } catch (err) {
        if (typeof err === 'object') {
            errors.value = err; // Erros de campo do Laravel
        } else {
            errors.value = { general: err };
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="auth-box p-4 border mx-auto">
        <h1 class="text-center mb-2 logo-font">
            InstaClone
        </h1>
        <p class="text-muted text-center fw-bold mb-4 signup-sub">
            Cadastre-se para ver fotos e vídeos dos seus amigos.
        </p>

        <form @submit.prevent="handleRegister">
            <div class="mb-2">
                <input v-model="form.email" type="email" class="ig-input" placeholder="E-mail" required />
                <small v-if="errors.email" class="field-error">{{ errors.email[0] }}</small>
            </div>

            <div class="mb-2">
                <input v-model="form.name" type="text" class="ig-input" placeholder="Nome completo" required />
            </div>

            <div class="mb-2">
                <input v-model="form.username" type="text" class="ig-input" placeholder="Nome de usuário"
                    required />
                <small v-if="errors.username" class="field-error">{{ errors.username[0] }}</small>
            </div>

            <div class="mb-2">
                <input v-model="form.password" type="password" class="ig-input" placeholder="Senha" required />
            </div>

            <div class="mb-3">
                <input v-model="form.password_confirmation" type="password" class="ig-input"
                    placeholder="Confirmar Senha" required />
                <small v-if="errors.password" class="field-error">{{ errors.password[0] }}</small>
            </div>

            <button type="submit" class="btn-ig w-100 mt-3" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                <span v-else>Cadastrar</span>
            </button>

            <div v-if="errors.general" class="error-msg mt-3 text-center">
                {{ errors.general }}
            </div>
        </form>
    </div>

    <div class="auth-box p-4 border mx-auto mt-3 text-center">
        <p class="mb-0 small">
            Tem uma conta?
            <router-link to="/login" class="text-primary fw-bold text-decoration-none">Conecte-se</router-link>
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

.signup-sub {
    font-size: 1rem;
    color: var(--text-secondary) !important;
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

.field-error {
    color: var(--danger);
    font-size: 0.7rem;
    display: block;
    margin-top: 2px;
}
</style>