<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';
import { useDiscoverStore } from '@/stores/discover';
import { useFollowsStore } from '@/stores/follows';
import { useAuthStore } from '@/stores/auth';
import PostCard from '@/components/post/PostCard.vue';
import AccountCard from '@/components/profile/AccountCard.vue';

const feedStore = useFeedStore();
const discoverStore = useDiscoverStore();
const followsStore = useFollowsStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
    // Busca feed se estiver vazio
    if (feedStore.feedOrder.length === 0) {
        feedStore.fetchFeed();
    }

    // Busca sugestões e lista de seguindo para o sidebar
    discoverStore.fetchSuggestions();
    if (authStore.user) {
        followsStore.fetchFollowing(authStore.user.id);
    }
});

// Filtra sugestões para remover pessoas que já seguimos
const filteredSuggestions = computed(() => {
    return discoverStore.suggestions
        .filter(user => !followsStore.followingIds.has(user.id))
        .slice(0, 5);
});

const handleToggleFollow = async (user) => {
    try {
        await followsStore.toggleFollow(user.id);
    } catch (error) {
        console.error("Erro ao seguir/deixar de seguir:", error);
    }
};

const goToProfile = (username) => {
    router.push(`/perfil?user=${username}`);
};

const logout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>

<template>
    <div class="feed-view-container">
        <div class="feed-view">
            <div class="feed-main">
                <div v-if="feedStore.isLoading && feedStore.feedOrder.length === 0" class="d-flex justify-content-center py-5">
                    <div class="spinner-border" style="color: var(--accent);" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>

                <template v-else>
                    <div v-if="feedStore.feedPosts.length > 0">
                        <!-- Espaço para Stories (opcional no futuro) -->
                        <div class="stories-placeholder mb-4 d-none d-md-flex">
                            <!-- Aqui poderiam entrar os círculos de stories -->
                        </div>
                        
                        <PostCard v-for="post in feedStore.feedPosts" :key="post.id" :post="post" />
                        
                        <div v-if="feedStore.nextCursor" class="d-flex justify-content-center py-4">
                            <button
                                class="btn-ig-ghost load-more-btn"
                                :disabled="feedStore.isFetchingMore"
                                @click="feedStore.loadMoreFeed()"
                            >
                                <span v-if="feedStore.isFetchingMore" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Carregar mais
                            </button>
                        </div>
                    </div>

                    <div v-else class="empty-state text-center">
                        <div class="empty-icon-wrapper mb-4">
                            <i class="bi bi-camera fs-1"></i>
                        </div>
                        <h4 class="fw-bold mb-2">Nenhuma publicação ainda</h4>
                        <p class="text-secondary mb-4">Siga pessoas ou compartilhe seu primeiro momento com o mundo.</p>
                        <router-link to="/create" class="btn-ig px-4 py-2">
                            Criar minha primeira publicação
                        </router-link>
                    </div>
                </template>
            </div>

            <aside class="feed-sidebar d-none d-xl-block">
                <!-- Perfil do Usuário Atual -->
                <div v-if="authStore.user" class="current-user-sidebar mb-4">
                    <AccountCard
                        :user="authStore.user"
                        variant="sidebar"
                        action-text="Mudar"
                        :avatar-size="56"
                        @action-click="logout"
                        @click="goToProfile(authStore.user.username)"
                    />
                </div>

                <!-- Seção Sugestões -->
                <div class="sidebar-section">
                    <div class="d-flex justify-content-between align-items-center mb-2 px-1">
                        <h6 class="section-title mb-0">Sugestões para você</h6>
                        <router-link to="/descobrir" class="btn-link-sm text-white">Ver tudo</router-link>
                    </div>
                    
                    <div v-if="discoverStore.isLoading && discoverStore.suggestions.length === 0" class="text-center py-3">
                        <div class="spinner-border spinner-border-sm text-muted" role="status"></div>
                    </div>

                    <div v-else class="sidebar-list">
                        <template v-if="filteredSuggestions.length > 0">
                            <AccountCard
                                v-for="user in filteredSuggestions"
                                :key="user.id"
                                :user="user"
                                variant="sidebar"
                                :is-following="false"
                                :is-pending="followsStore.pendingIds.has(user.id)"
                                @toggle-follow="handleToggleFollow"
                                @click="goToProfile(user.username)"
                            />
                        </template>
                        <div v-else class="py-3 text-muted small px-1">
                            Nenhuma sugestão nova.
                        </div>
                    </div>
                </div>

                <footer class="mt-5 px-1">
                    <nav class="footer-nav mb-3">
                        <a href="#">Sobre</a> • <a href="#">Ajuda</a> • <a href="#">Imprensa</a> • <a href="#">API</a> • <a href="#">Carreiras</a> • <a href="#">Privacidade</a> • <a href="#">Termos</a> • <a href="#">Localizações</a> • <a href="#">Idioma</a> • <a href="#">Meta Verified</a>
                    </nav>
                    <p class="text-muted" style="font-size: 11px; letter-spacing: 0.5px; opacity: 0.5; text-transform: uppercase;">
                        © 2026 INSTACLONE FROM META
                    </p>
                </footer>
            </aside>
        </div>
    </div>
</template>

<style scoped>
.feed-view-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding-left: 50px; /* Ajuste para não ficar colado na navbar lateral */
}

.feed-view {
    display: flex;
    flex-direction: row;
    gap: 64px;
    width: 100%;
    max-width: 1035px;
    margin: 0 auto 0 0; /* Alinha à esquerda mas mantém gap do início */
}

.feed-main {
    width: 630px;
    flex-shrink: 0;
}

.feed-sidebar {
    width: 319px;
    flex-shrink: 0;
    margin-top: 20px;
}

.empty-state {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 80px 40px;
    margin-top: 20px;
}

.empty-icon-wrapper {
    width: 110px;
    height: 110px;
    border: 2px solid var(--text-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.sidebar-section {
    background-color: transparent;
}

.section-title {
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 600;
}

.btn-link-sm {
    color: var(--text-primary);
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
}

.btn-link-sm:hover {
    color: var(--text-secondary);
}

.sidebar-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.footer-nav {
    font-size: 12px;
    color: #737373;
    line-height: 1.5;
}

.footer-nav a {
    color: inherit;
    text-decoration: none;
}

.footer-nav a:hover {
    text-decoration: underline;
}

@media (max-width: 1200px) {
    .feed-view-container {
        justify-content: center;
        padding-left: 0;
    }
    
    .feed-view {
        justify-content: center;
        margin: 0 auto;
    }
    
    .feed-main {
        width: 100%;
        max-width: 470px;
    }
}
</style>