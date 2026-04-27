<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';
import { useDiscoverStore } from '@/stores/discover';
import AccountCard from '@/components/profile/AccountCard.vue';
import { ROUTE_NAMES } from '@/router/routeNames';

const router = useRouter();
const authStore = useAuthStore();
const followsStore = useFollowsStore();
const discoverStore = useDiscoverStore();

const searchQuery = ref('');
let debounceTimer = null;

onMounted(async () => {
    if (authStore.user?.id) {
        await followsStore.fetchFollowing(authStore.user.id);
    }
    await discoverStore.fetchSuggestions(1);
});

watch(searchQuery, (newQuery) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (newQuery.trim()) {
            discoverStore.searchUsers(newQuery.trim());
        } else {
            discoverStore.fetchSuggestions(1);
        }
    }, 500);
});

const goToProfile = (username) => {
    router.push({ name: ROUTE_NAMES.PERFIL, query: { user: username } });
};

const handlePagination = (page) => {
    if (searchQuery.value.trim()) {
        discoverStore.searchUsers(searchQuery.value.trim(), page);
    } else {
        discoverStore.fetchSuggestions(page);
    }
};
</script>

<template>
    <div class="descobrir-view py-5">
        <header class="mb-5">
            <h4 class="discover-title">Descobrir</h4>
            <div class="search-container mt-4">
                <div class="input-group search-input-group">
                    <span class="input-group-text bg-transparent border-end-0">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        class="form-control border-start-0 ps-0" 
                        placeholder="Pesquisar usuários..."
                        aria-label="Pesquisar"
                    >
                </div>
            </div>
        </header>

        <div v-if="discoverStore.isLoading" class="d-flex justify-content-center py-5">
            <div class="spinner-border" style="color: var(--accent);" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <template v-else>
            <div class="mb-4">
                <h6 v-if="!searchQuery" class="section-title mb-4">Sugestões para você</h6>
                <h6 v-else class="section-title mb-4">Resultados da pesquisa</h6>
            </div>

            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
                <div 
                    v-for="user in (searchQuery ? discoverStore.searchResults : discoverStore.suggestions)" 
                    :key="user.id" 
                    class="col"
                >
                    <AccountCard
                        :user="user"
                        variant="grid"
                        :is-following="followsStore.followingIds.has(user.id)"
                        :is-pending="followsStore.pendingIds.has(user.id)"
                        @click="goToProfile(user.username)"
                        @toggle-follow="followsStore.toggleFollow(user.id)"
                    />
                </div>
            </div>

            <div 
                v-if="(searchQuery ? discoverStore.searchResults.length : discoverStore.suggestions.length) === 0" 
                class="text-center py-5 text-muted card-empty"
            >
                <i class="bi bi-people fs-1 mb-3 d-block"></i>
                <p>{{ searchQuery ? 'Nenhum usuário encontrado.' : 'Nenhuma sugestão encontrada no momento.' }}</p>
            </div>

            <!-- Paginação -->
            <div v-if="discoverStore.lastPage > 1" class="ig-pagination mt-5 d-flex justify-content-center align-items-center gap-3">
                <button 
                    class="btn btn-sm btn-ig-ghost px-4"
                    :disabled="discoverStore.currentPage === 1" 
                    @click="handlePagination(discoverStore.currentPage - 1)"
                >
                    Anterior
                </button>
                <span class="fw-semibold">{{ discoverStore.currentPage }} de {{ discoverStore.lastPage }}</span>
                <button 
                    class="btn btn-sm btn-ig-ghost px-4"
                    :disabled="discoverStore.currentPage === discoverStore.lastPage" 
                    @click="handlePagination(discoverStore.currentPage + 1)"
                >
                    Próxima
                </button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.descobrir-view {
    max-width: 935px;
    margin: 0 auto;
}

.discover-title {
    font-size: 1.5rem;
    font-weight: 700;
}

.section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.search-input-group {
    max-width: 400px;
    background-color: var(--bg-main);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border);
}

.search-input-group input {
    background-color: transparent;
    color: var(--text-primary);
    border: none;
    box-shadow: none;
}

.search-input-group .input-group-text {
    border: none;
}

.card-empty {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px dashed var(--border);
}

.btn-ig-ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-primary);
    border-radius: 8px;
    font-weight: 600;
}

.btn-ig-ghost:hover:not(:disabled) {
    border-color: #555;
    background: rgba(255, 255, 255, 0.05);
}

.btn-ig-ghost:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
