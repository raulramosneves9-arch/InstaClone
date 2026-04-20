<script setup>
import Navbar from '../components/Navbar.vue';
</script>

<template>
    <div class="main-layout">
        <main class="content">
            <slot />
        </main>

        <aside class="nav-wrapper">
            <Navbar />
        </aside>
    </div>
</template>

<style scoped>
/* O CSS permanece similar ao anterior, mas agora focado na nav-wrapper */
.nav-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: var(--nav-height-mobile);
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    z-index: 100;
}

@media (min-width: 768px) {
    .nav-wrapper {
        top: 0;
        left: 0;
        width: var(--sidebar-width-desktop);
        height: 100vh;
        border-top: none;
        border-right: 1px solid var(--color-border);
    }
}
</style>