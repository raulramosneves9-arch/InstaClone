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
/* Padding para mobile (navbar embaixo) e margem para desktop (sidebar lado) */
.main-content {
    padding-bottom: 60px;
}

@media (min-width: 768px) {
    .main-content {
        padding-bottom: 0;
        margin-left: 245px;
    }
}
</style>