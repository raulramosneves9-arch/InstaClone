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
    <div class="card p-4 shadow-sm border">
        <h1 class="text-center mb-4 logo-font" style="font-family: 'Style Script', cursive; font-size: 3rem;">
            InstaClone
        </h1>

        <form @submit.prevent="handleSubmit">
            <div class="mb-2">
                <input v-model="email" type="email" class="form-control bg-light" placeholder="E-mail" required />
            </div>
            <div class="mb-3">
                <input v-model="password" type="password" class="form-control bg-light" placeholder="Senha" required />
            </div>

            <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="loading">
                <Spinner v-if="loading" />
                <span v-else>Entrar</span>
            </button>

            <div v-if="errorMsg" class="alert alert-danger mt-3 py-2 small text-center">
                {{ errorMsg }}
            </div>
        </form>

        <div class="text-center mt-4 pt-3 border-top">
            <p class="mb-0 small">
                Não tem uma conta?
                <router-link to="/cadastro" class="text-primary fw-bold text-decoration-none">Cadastre-se</router-link>
            </p>
        </div>
    </div>
</template>