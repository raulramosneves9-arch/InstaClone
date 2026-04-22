<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import AuthLayout from './layouts/AuthLayout.vue';
import AppLayout from './layouts/AppLayout.vue';

const route = useRoute();
const authStore = useAuthStore();

const layouts = {
  AuthLayout,
  AppLayout
};

// Determina qual layout usar baseado na meta da rota
const layout = computed(() => layouts[route.meta.layout] || null);

onMounted(() => {
  authStore.init();
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="layout" v-if="layout">
        <component :is="Component" :key="route.fullPath" />
      </component>
      <component :is="Component" v-else :key="route.fullPath" />
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