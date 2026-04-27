<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ROUTE_NAMES } from '../router/routeNames';
import AppIcon from './ui/AppIcon.vue';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>

<template>
    <nav class="nav-container border-end">
        <div class="d-flex flex-column h-100 p-3">

            <router-link to="/feed" class="navbar-brand mb-5 d-none d-md-block">
                <h2 class="logo-font">InstaClone</h2>
            </router-link>

            <ul class="nav nav-pills flex-column mb-auto gap-2">
                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.FEED }" custom v-slot="{ href, navigate, isActive }">
                        <a :href="href" @click="navigate" class="nav-link d-flex align-items-center gap-3">
                            <AppIcon name="home" :filled="isActive" />
                            <span class="d-none d-xl-block">Home</span>
                        </a>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.DESCOBRIR }" custom v-slot="{ href, navigate, isActive }">
                        <a :href="href" @click="navigate" class="nav-link d-flex align-items-center gap-3">
                            <AppIcon name="search" :filled="isActive" />
                            <span class="d-none d-xl-block">Buscar</span>
                        </a>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.CRIAR }" custom v-slot="{ href, navigate, isActive }">
                        <a :href="href" @click="navigate" class="nav-link d-flex align-items-center gap-3">
                            <AppIcon name="create" :filled="isActive" />
                            <span class="d-none d-xl-block">Criar</span>
                        </a>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: ROUTE_NAMES.PERFIL }" custom v-slot="{ href, navigate, isActive }">
                        <a :href="href" @click="navigate" class="nav-link d-flex align-items-center gap-3">
                            <AppIcon name="profile" :filled="isActive" />
                            <span class="d-none d-xl-block">Perfil</span>
                        </a>
                    </router-link>
                </li>
            </ul>

            <div class="mt-auto d-none d-md-block">
                <button @click="handleLogout"
                    class="btn btn-link logout-btn text-decoration-none d-flex align-items-center gap-3 p-2 w-100">
                    <i class="bi bi-box-arrow-left fs-4"></i>
                    <span class="d-none d-xl-block">Sair</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.nav-container {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    background-color: var(--bg-main);
    border-color: var(--border) !important;
    z-index: 1000;
    transition: width 0.3s ease;
}

.logo-font {
    color: var(--text-primary);
    font-size: 1.7rem;
    font-weight: 600;
}

.nav-link {
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    transition: opacity 0.2s ease;
}

.nav-link:hover {
    opacity: 0.7;
    background-color: transparent;
}

.nav-link.router-link-active {
    font-weight: 600;
}

.user-avatar-nav {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
}

.logout-btn {
    color: var(--text-secondary) !important;
}

.logout-btn:hover {
    color: var(--danger) !important;
    opacity: 0.9;
}

/* Ajuste para telas médias (Tablets) - Ícones apenas */
@media (max-width: 1200px) {
    .nav-container {
        width: 72px;
    }
}

/* Ajuste para Mobile (Barra Inferior) */
@media (max-width: 768px) {
    .nav-container {
        top: auto;
        width: 100%;
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

    .nav-link {
        padding: 10px;
    }
}
</style>