<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Avatar from './ui/Avatar.vue';

const router = useRouter();
const { user, logout } = useAuth();

// Ícones simplificados para o exemplo (no real seriam os SVGs do Insta)
const navItems = [
    { name: 'Feed', path: '/feed', icon: '🏠' },
    { name: 'Explore', path: '/explore', icon: '🔍' },
    { name: 'Criar', path: '/create', icon: '➕' },
    { name: 'Notificações', path: '/notifications', icon: '❤️' },
];
</script>

<template>
    <nav class="nav-container">
        <div class="nav-logo desktop-only">InstaClone</div>

        <div class="nav-links">
            <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item">
                <span class="icon">{{ item.icon }}</span>
                <span class="label desktop-only">{{ item.name }}</span>
            </router-link>

            <router-link :to="`/profile/${user?.username}`" class="nav-item" v-if="user">
                <Avatar :src="user.avatar" :username="user.username" size="sm" />
                <span class="label desktop-only">Perfil</span>
            </router-link>

            <button @click="logout" class="nav-item logout-btn desktop-only">
                <span class="icon">🚪</span>
                <span class="label">Sair</span>
            </button>
        </div>
    </nav>
</template>

<style scoped>
.nav-container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    align-items: center;
}

.nav-logo {
    font-family: 'Style Script', cursive;
    font-size: 1.5rem;
    padding: 20px;
    margin-bottom: 20px;
}

.nav-links {
    display: flex;
    width: 100%;
    justify-content: space-around;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    border-radius: var(--radius-md);
    transition: background 0.2s;
    color: var(--color-text);
}

.nav-item:hover {
    background-color: var(--color-bg);
}

.nav-item.router-link-active {
    font-weight: bold;
}

.icon {
    font-size: 24px;
}

.desktop-only {
    display: none;
}

@media (min-width: 768px) {
    .nav-container {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .nav-links {
        flex-direction: column;
        justify-content: flex-start;
    }

    .desktop-only {
        display: block;
    }

    .nav-item {
        width: 90%;
        margin: 4px 10px;
    }
}
</style>