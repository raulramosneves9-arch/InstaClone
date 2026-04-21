<script setup>

import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useFeedStore } from './stores/feed';

const auth = useAuthStore();
const feed = useFeedStore();

onMounted(() => {
  auth.init();
  feed.init();
  console.log('Usuários:', auth.localAccounts);
  console.log('Posts:', feed.posts);
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
/* Transição suave de opacidade entre páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>