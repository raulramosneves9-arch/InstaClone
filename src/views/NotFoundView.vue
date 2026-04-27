<template>
  <div class="not-found-container d-flex flex-column align-items-center justify-content-center text-center py-5">
    <h1 class="not-found-title mb-3">404</h1>
    <h2 class="not-found-subtitle mb-4">Ops! Essa página não existe.</h2>
    <p class="not-found-text mb-4">O link que você acessou pode estar quebrado ou a página pode ter sido removida.</p>
    
    <router-link v-if="authStore.isAuthenticated" to="/feed" class="btn-ig">
      Voltar para o Feed
    </router-link>
    <router-link v-else to="/login" class="btn-ig">
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

.not-found-title {
  font-size: 5rem;
  font-weight: 300;
  color: var(--text-primary);
}

.not-found-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
}

.not-found-text {
  color: var(--text-secondary);
  max-width: 400px;
}
</style>