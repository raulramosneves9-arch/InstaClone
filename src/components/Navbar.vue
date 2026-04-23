<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
</script>

<template>
    <nav class="nav-container border-end bg-white">
        <div class="d-flex flex-column h-100 p-3">

            <router-link to="/feed" class="navbar-brand mb-5 d-none d-md-block">
                <h2 class="logo-font">InstaClone</h2>
            </router-link>

            <ul class="nav nav-pills flex-column mb-auto gap-2">
                <li class="nav-item">
                    <router-link to="/feed" class="nav-link d-flex align-items-center gap-3 text-dark">
                        <i class="bi bi-house-door fs-4"></i>
                        <span class="d-none d-xl-block">Página inicial</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/criar" class="nav-link d-flex align-items-center gap-3 text-dark">
                        <i class="bi bi-plus-square fs-4"></i>
                        <span class="d-none d-xl-block">Criar</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/perfil" class="nav-link d-flex align-items-center gap-3 text-dark">
                        <div class="user-avatar-nav bg-secondary text-white rounded-circle">
                            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
                        </div>
                        <span class="d-none d-xl-block">Perfil</span>
                    </router-link>
                </li>
            </ul>

            <div class="mt-auto d-none d-md-block">
                <button @click="handleLogout"
                    class="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-3 p-2 w-100">
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
    /* Largura padrão Desktop */
    z-index: 1000;
    transition: width 0.3s ease;
}

.logo-font {
    font-family: 'Style Script', cursive;
    font-size: 1.8rem;
}

.nav-link:hover {
    background-color: #f8f9fa;
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
        border-bottom: none;
        border-top: 1px solid #dee2e6;
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