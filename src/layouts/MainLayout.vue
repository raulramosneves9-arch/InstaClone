<script setup>
// No Módulo 3 criaremos o componente Navbar e importaremos aqui
</script>

<template>
    <div class="main-layout">
        <header v-if="$slots.header" class="top-nav">
            <slot name="header" />
        </header>

        <main class="content">
            <slot />
        </main>

        <nav class="bottom-nav">
            <p style="text-align: center; font-size: 12px; color: var(--color-text-muted);">
                Navbar Placeholder
            </p>
        </nav>
    </div>
</template>

<style scoped>
.main-layout {
    min-height: 100vh;
    background-color: var(--color-bg);
}

.content {
    max-width: 935px;
    /* Largura padrão do Instagram Desktop */
    margin: 0 auto;
    padding: 20px 0 var(--nav-height-mobile) 0;
    /* Padding bottom para a Navbar mobile */
}

.bottom-nav {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: var(--nav-height-mobile);
    background-color: var(--color-surface);
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

/* Ajuste para telas maiores (Simulando Sidebar futura) */
@media (min-width: 768px) {
    .content {
        padding-left: var(--sidebar-width-desktop);
        padding-bottom: 20px;
    }

    .bottom-nav {
        width: var(--sidebar-width-desktop);
        height: 100vh;
        left: 0;
        top: 0;
        border-top: none;
        border-right: 1px solid var(--color-border);
    }
}
</style>