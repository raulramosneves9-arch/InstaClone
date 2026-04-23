<template>
  <div class="not-found-container d-flex flex-column align-items-center justify-content-center text-center py-5">
    <h1 class="display-1 fw-bold text-primary mb-3">404</h1>
    <h2 class="h4 mb-4">Ops! Essa página não existe.</h2>
    <p class="text-muted mb-4">O link que você acessou pode estar quebrado ou a página pode ter sido removida.</p>
    
    <router-link v-if="authStore.isAuthenticated" to="/feed" class="btn btn-primary">
      Voltar para o Feed
    </router-link>
    <router-link v-else to="/login" class="btn btn-primary">
      Ir para o Login
    </router-link>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.not-found-container {
  min-height: 80vh;
}
</style>