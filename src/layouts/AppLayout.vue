<script setup>
import Navbar from '../components/Navbar.vue';
</script>

<template>
    <div class="app-layout">
        <Navbar />
        <main class="main-content">
            <div class="container py-4">
                <slot />
            </div>
        </main>
    </div>
</template>

<style scoped>
.main-content {
    margin-bottom: 60px;
    /* Espaço para nav mobile */
}

@media (min-width: 768px) {
    .main-content {
        margin-bottom: 0;
        margin-left: 245px;
        /* Espaço para sidebar desktop */
    }
}
</style>