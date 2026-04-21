<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useFeedStore } from './stores/feed';

const authStore = useAuthStore();
const feedStore = useFeedStore();

onMounted(() => {
  // Inicializa as stores com os dados do LocalStorage ou Mocks
  authStore.init();
  feedStore.init();
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>