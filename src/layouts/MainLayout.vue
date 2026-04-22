<script setup>
import Navbar from '../components/Navbar.vue';
</script>

<template>
    <div class="layout-wrapper">
        <Navbar />
        <main class="main-content">
            <header class="view-header">
                <slot name="header" />
            </header>
            <slot />
        </main>
    </div>
</template>

<style scoped>
.main-content {
    padding-bottom: 70px;
    /* Espaço para navbar mobile */
    min-height: 100vh;
}

@media (min-width: 768px) {
    .main-content {
        padding-left: 245px;
        /* Espaço para sidebar desktop */
        padding-bottom: 0;
    }
}
</style>