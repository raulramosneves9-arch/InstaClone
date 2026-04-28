<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from './layouts/AppLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();

// Mapeia os nomes que colocamos no router (meta: { layout: '...' })
const layouts = {
  AppLayout,
  AuthLayout
};

// Computa qual layout usar baseado na rota atual
const layout = computed(() => {
  return layouts[route.meta.layout] || null;
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <div :key="route.path">
        <component :is="layout" v-if="layout">
          <component :is="Component" />
        </component>

        <component :is="Component" v-else />
      </div>
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

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #fafafa;
}
</style>