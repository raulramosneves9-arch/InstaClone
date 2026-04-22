<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import BaseButton from '../components/ui/BaseButton.vue';

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
    <div class="card p-4 shadow-sm border">
        <h1 class="text-center logo mb-2" style="font-family: 'Style Script', cursive; font-size: 3rem;">
            InstaClone
        </h1>
        <p class="text-muted text-center fw-bold mb-4">
            Cadastre-se para ver fotos e vídeos dos seus amigos.
        </p>

        <form @submit.prevent="handleRegister">
            <div class="mb-2">
                <input v-model="form.email" type="email" class="form-control" placeholder="E-mail" required />
                <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
            </div>

            <div class="mb-2">
                <input v-model="form.name" type="text" class="form-control" placeholder="Nome completo" required />
            </div>

            <div class="mb-2">
                <input v-model="form.username" type="text" class="form-control" placeholder="Nome de usuário"
                    required />
                <small v-if="errors.username" class="text-danger">{{ errors.username[0] }}</small>
            </div>

            <div class="mb-2">
                <input v-model="form.password" type="password" class="form-control" placeholder="Senha" required />
            </div>

            <div class="mb-3">
                <input v-model="form.password_confirmation" type="password" class="form-control"
                    placeholder="Confirmar Senha" required />
                <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
            </div>

            <BaseButton type="submit" :loading="isLoading">
                Cadastre-se
            </BaseButton>

            <div v-if="errors.general" class="alert alert-danger mt-3 py-2 small text-center">
                {{ errors.general }}
            </div>
        </form>

        <div class="text-center mt-4 pt-3 border-top">
            <p class="mb-0">
                Tem uma conta?
                <router-link to="/login" class="text-primary fw-bold text-decoration-none">Conecte-se</router-link>
            </p>
        </div>
    </div>
</template>