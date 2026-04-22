<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from './layouts/AuthLayout.vue';
import AppLayout from './layouts/AppLayout.vue';

const route = useRoute();
const layouts = {
  AuthLayout,
  AppLayout
};

// Se não houver layout definido na rota, renderiza direto (ex: NotFound)
const layout = computed(() => layouts[route.meta.layout] || null);
</script>

<template>
  <component :is="layout" v-if="layout">
    <router-view />
  </component>
  <router-view v-else />
</template>