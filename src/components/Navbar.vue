<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ROUTE_NAMES } from '../router/routeNames';
import AppIcon from './ui/AppIcon.vue';
import Avatar from './ui/Avatar.vue';
import { resolveImageUrl } from '../utils/imageUrl';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>

<template>
    <nav class="nav-container border-end">
        <div class="d-flex flex-column h-100 py-4 px-3">

            <!-- Logo Section -->
            <div class="logo-section mb-4 px-2">
                <router-link to="/feed" class="logo-link">
                    <div class="logo-text">
                        <h2 class="logo-font mb-0">InstaClone</h2>
                    </div>
                    <div class="logo-icon">
                        <AppIcon name="instagram" size-class="fs-3" />
                    </div>
                </router-link>
            </div>

            <!-- Main Nav Items -->
            <ul class="nav flex-column mb-auto gap-1">
                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.FEED }" class="nav-link-custom"
                        :class="{ active: route.name === ROUTE_NAMES.FEED }">
                        <div class="icon-wrapper">
                            <AppIcon name="home" :filled="route.name === ROUTE_NAMES.FEED" />
                        </div>
                        <span class="nav-label">Página inicial</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.DESCOBRIR }" class="nav-link-custom"
                        :class="{ active: route.name === ROUTE_NAMES.DESCOBRIR }">
                        <div class="icon-wrapper">
                            <AppIcon name="search" :filled="route.name === ROUTE_NAMES.DESCOBRIR" />
                        </div>
                        <span class="nav-label">Pesquisa</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.CRIAR }" class="nav-link-custom"
                        :class="{ active: route.name === ROUTE_NAMES.CRIAR }">
                        <div class="icon-wrapper">
                            <AppIcon name="create" :filled="route.name === ROUTE_NAMES.CRIAR" />
                        </div>
                        <span class="nav-label">Criar</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.PERFIL }" class="nav-link-custom"
                        :class="{ active: route.name === ROUTE_NAMES.PERFIL }">
                        <div class="icon-wrapper">
                            <Avatar :src="resolveImageUrl(authStore.user?.avatar_url || authStore.user?.avatar)"
                                :size="24" :alt="authStore.user?.username || 'Perfil'"
                                :class="{ 'border border-white': route.name === ROUTE_NAMES.PERFIL }" />
                        </div>
                        <span class="nav-label" :class="{ 'fw-bold': route.name === ROUTE_NAMES.PERFIL }">Perfil</span>
                    </router-link>
                </li>
            </ul>

            <!-- Bottom Items -->
            <div class="mt-auto pt-3 border-top border-secondary border-opacity-10">
                <button class="nav-link-custom w-100 mb-1" @click="handleLogout">
                    <div class="icon-wrapper">
                        <AppIcon name="more" />
                    </div>
                    <span class="nav-label">Mais</span>
                </button>
                <div class="nav-link-custom w-100 opacity-75 visual-only">
                    <div class="icon-wrapper">
                        <AppIcon name="meta" />
                    </div>
                    <span class="nav-label text-truncate">Também da Meta</span>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.visual-only {
    cursor: default;
}

.nav-container {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 72px;
    background-color: var(--bg-main);
    border-color: var(--border) !important;
    z-index: 1000;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.nav-container:hover {
    width: 245px;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.5);
}

.logo-section {
    height: 60px;
    display: flex;
    align-items: center;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--text-primary);
}

.logo-text {
    opacity: 0;
    visibility: hidden;
    width: 0;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    white-space: nowrap;
}

.logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    transition: transform 0.3s ease;
}

.nav-container:hover .logo-text {
    opacity: 1;
    visibility: visible;
    width: auto;
    margin-left: 12px;
}

.nav-container:hover .logo-icon {
    display: none;
}

.logo-font {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Instagram Sans', -apple-system, sans-serif;
}

.nav-link-custom {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    color: var(--text-primary);
    text-decoration: none;
    transition: background-color 0.2s ease;
    cursor: pointer;
    border: none;
    background: transparent;
}

.nav-link-custom:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link-custom.active {
    font-weight: 700;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    position: relative;
}

.nav-label {
    margin-left: 12px;
    font-size: 1rem;
    opacity: 0;
    visibility: hidden;
    white-space: nowrap;
    transition: opacity 0.2s ease, visibility 0.2s ease;
}

.nav-container:hover .nav-label {
    opacity: 1;
    visibility: visible;
}

.badge-dot {
    position: absolute;
    top: -4px;
    right: 4px;
    background-color: var(--danger);
    color: white;
    font-size: 10px;
    font-weight: bold;
    min-width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-main);
}

/* Ajuste para Mobile (Barra Inferior) */
@media (max-width: 768px) {
    .nav-container {
        top: auto;
        width: 100% !important;
        height: 60px;
        border-bottom: none !important;
        border-top: 1px solid var(--border) !important;
    }

    .nav-container .d-flex {
        flex-direction: row !important;
        justify-content: space-around;
        align-items: center;
        padding: 0 !important;
    }

    .nav-label,
    .logo-section,
    .mt-auto {
        display: none !important;
    }

    .nav-link-custom {
        padding: 10px;
    }
}
</style>