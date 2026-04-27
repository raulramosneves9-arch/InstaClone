<script setup>
import { onMounted } from 'vue';
import { useFeedStore } from '@/stores/feed';
import PostCard from '@/components/post/PostCard.vue';

const feedStore = useFeedStore();

onMounted(async () => {
    // Só busca se o feed estiver vazio
    if (feedStore.feedOrder.length === 0) {
        await feedStore.fetchFeed();
    }
});
</script>

<template>
    <div class="feed-view">
        <div class="feed-main">

                <div v-if="feedStore.isLoading" class="d-flex justify-content-center py-5">
                    <div class="spinner-border" style="color: var(--accent);" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>

                <template v-else>
                    <div v-if="feedStore.feedPosts.length > 0">
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
                        <i class="bi bi-camera fs-1" style="color: var(--text-secondary);"></i>
                        <h4 class="mt-3">Nenhuma publicação ainda</h4>
                        <p style="color: var(--text-secondary);">Siga pessoas ou crie seu primeiro post!</p>
                        <router-link to="/create" class="btn-ig mt-3 d-inline-flex">
                            Criar minha primeira publicação
                        </router-link>
                    </div>
                </template>

        </div>
        <aside class="feed-suggestions d-none d-xl-block">
            <div class="suggestions-card">
                <h6 class="mb-2">Sugestoes</h6>
                <p class="text-muted mb-0">Use a aba Buscar para encontrar novas pessoas para seguir.</p>
            </div>
        </aside>
    </div>
</template>

<style scoped>
.feed-view {
    display: block;
}

.feed-main {
    max-width: 470px;
    width: 100%;
}

.empty-state {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 40px 16px;
}

.load-more-btn {
    min-width: 152px;
}

.feed-suggestions {
    width: 300px;
    position: sticky;
    top: 24px;
}

.suggestions-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
}

@media (min-width: 1200px) {
    .feed-view {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 32px;
    }
}
</style>