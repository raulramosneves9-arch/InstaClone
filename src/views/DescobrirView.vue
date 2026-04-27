<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useDiscoverStore } from '@/stores/discover';
import { useFollowsStore } from '@/stores/follows';
import AccountCard from '@/components/profile/AccountCard.vue';
import { ROUTE_NAMES } from '@/router/routeNames';

const router = useRouter();
const authStore = useAuthStore();
const discoverStore = useDiscoverStore();
const followsStore = useFollowsStore();

onMounted(async () => {
    if (authStore.user?.id) {
        await followsStore.fetchFollowing(authStore.user.id);
    }
    await discoverStore.fetchSuggestions(1);
});

const goToProfile = (username) => {
    router.push({ name: ROUTE_NAMES.PERFIL, query: { user: username } });
};

const toggleFollow = async (userId) => {
    await followsStore.toggleFollow(userId);
};
</script>

<template>
    <div class="descobrir-view py-4">
        <h2 class="mb-4">Descobrir Pessoas</h2>

        <div v-if="discoverStore.isLoading" class="d-flex justify-content-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <template v-else>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                <div v-for="user in discoverStore.suggestions" :key="user.id" class="col">
                    <AccountCard :user="user" :is-following="followsStore.followingIds.has(user.id)"
                        :is-pending="followsStore.pendingIds.has(user.id)" @click="goToProfile(user.username)"
                        @toggle-follow="toggleFollow(user.id)" />
                </div>
            </div>

            <div v-if="discoverStore.suggestions.length === 0" class="text-center py-5 text-muted">
                <p>Nenhuma sugestão encontrada no momento.</p>
            </div>

            <!-- Paginação -->
            <div v-if="discoverStore.lastPage > 1" class="d-flex justify-content-center mt-4">
                <nav aria-label="Navegação de sugestões">
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: discoverStore.currentPage === 1 }">
                            <button class="page-link" @click="discoverStore.fetchSuggestions(discoverStore.currentPage - 1)">
                                Anterior
                            </button>
                        </li>
                        <li class="page-item disabled">
                            <span class="page-link">
                                {{ discoverStore.currentPage }} de {{ discoverStore.lastPage }}
                            </span>
                        </li>
                        <li class="page-item" :class="{ disabled: discoverStore.currentPage === discoverStore.lastPage }">
                            <button class="page-link" @click="discoverStore.fetchSuggestions(discoverStore.currentPage + 1)">
                                Próxima
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </template>
    </div>
</template>

<style scoped>
.descobrir-view h2 {
    font-size: 1.5rem;
    font-weight: 600;
}

.page-link:hover {
    opacity: 0.7;
}
</style>
