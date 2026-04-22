<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import BaseButton from '../components/ui/BaseButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

async function handleLogin() {
    isLoading.value = true;
    error.value = '';

    try {
        // Note: O backend Laravel geralmente usa 'email' em vez de 'username' para login
        await authStore.login(email.value, password.value);
        router.replace('/');
    } catch (err) {
        error.value = err; // Mensagem vinda do interceptor da API
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="card p-4 shadow-sm border">
        <h1 class="text-center logo mb-4" style="font-family: 'Style Script', cursive; font-size: 3rem;">
            InstaClone
        </h1>

        <form @submit.prevent="handleLogin">
            <div class="mb-3">
                <input v-model="email" type="email" class="form-control" placeholder="E-mail" required
                    :disabled="isLoading" />
            </div>
            <div class="mb-3">
                <input v-model="password" type="password" class="form-control" placeholder="Senha" required
                    :disabled="isLoading" />
            </div>

            <BaseButton type="submit" :loading="isLoading">
                Entrar
            </BaseButton>

            <div v-if="error" class="alert alert-danger mt-3 py-2 small text-center" role="alert">
                {{ error }}
            </div>
        </form>

        <div class="text-center mt-4 pt-3 border-top">
            <p class="mb-0">
                Não tem uma conta?
                <router-link to="/register" class="text-primary fw-bold text-decoration-none">Cadastre-se</router-link>
            </p>
        </div>
    </div>
</template>