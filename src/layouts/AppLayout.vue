<script setup>
import Navbar from '../components/Navbar.vue';
</script>

<template>
    <div class="app-layout">
        <Navbar />
        <main class="main-content">
            <div class="app-content-wrapper py-4">
                <slot />
            </div>
        </main>
    </div>
</template>

<style scoped>
.app-layout {
    min-height: 100vh;
    background-color: var(--bg-main);
}

.main-content {
    min-height: 100vh;
    padding-bottom: 60px;
}

.app-content-wrapper {
    width: min(100%, 1400px);
    margin: 0 auto;
    padding: 0 16px;
}

@media (min-width: 768px) {
    .main-content {
        padding-bottom: 0;
        margin-left: 72px;
    }
}

@media (min-width: 1200px) {
    .app-content-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        column-gap: 32px;
        align-items: start;
        justify-content: center;
    }
}
</style>