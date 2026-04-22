<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import Avatar from './ui/Avatar.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<template>
    <nav class="navbar">
        <div class="nav-content">
            <div class="logo desktop-only">InstaClone</div>

            <div class="nav-links">
                <router-link to="/feed" class="nav-item">
                    <span class="icon">🏠</span>
                    <span class="label desktop-only">Página Inicial</span>
                </router-link>

                <router-link to="/create" class="nav-item">
                    <span class="icon">➕</span>
                    <span class="label desktop-only">Criar</span>
                </router-link>

                <router-link :to="`/profile/${user?.username}`" class="nav-item" v-if="user">
                    <Avatar :src="user.avatar" :username="user.username" size="sm" />
                    <span class="label desktop-only">Perfil</span>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    z-index: 100;
}

.nav-links {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    color: var(--color-text);
}

.desktop-only {
    display: none;
}

@media (min-width: 768px) {
    .navbar {
        width: 245px;
        height: 100vh;
        left: 0;
        top: 0;
        border-top: none;
        border-right: 1px solid var(--color-border);
    }

    .nav-content {
        padding: 20px;
    }

    .logo {
        font-family: cursive;
        font-size: 24px;
        margin-bottom: 30px;
    }

    .nav-links {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .desktop-only {
        display: block;
    }
}
</style>