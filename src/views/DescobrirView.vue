<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';
import AccountCard from '@/components/profile/AccountCard.vue';
import { ROUTE_NAMES } from '@/router/routeNames';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const followsStore = useFollowsStore();

const suggestions = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);
const isLoading = ref(false);

const fetchSuggestions = async (page = 1) => {
    isLoading.value = true;
    try {
        const { data } = await api.get(`/users/suggestions?page=${page}`);
        suggestions.value = data.data || data;
        currentPage.value = data.current_page || page;
        lastPage.value = data.last_page || 1;
    } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    if (authStore.user?.id) {
        await followsStore.fetchFollowing(authStore.user.id);
    }
    await fetchSuggestions(1);
});

const goToProfile = (username) => {
    router.push({ name: ROUTE_NAMES.PERFIL, query: { user: username } });
};
</script>

<template>
    <div class="descobrir-view py-4">
        <h4 class="mb-4 discover-title">Sugestões para você</h4>

        <div v-if="isLoading" class="d-flex justify-content-center py-5">
            <div class="spinner-border" style="color: var(--accent);" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <template v-else>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                <div v-for="user in suggestions" :key="user.id" class="col">
                    <AccountCard
                        :user="user"
                        :is-following="followsStore.followingIds.has(user.id)"
                        :is-pending="followsStore.pendingIds.has(user.id)"
                        @click="goToProfile(user.username)"
                        @toggle-follow="followsStore.toggleFollow(user.id)"
                    />
                </div>
            </div>

            <div v-if="suggestions.length === 0" class="text-center py-5 text-muted">
                <p>Nenhuma sugestão encontrada no momento.</p>
            </div>

            <!-- Paginação -->
            <div v-if="lastPage > 1" class="ig-pagination mt-4">
                <button :disabled="currentPage === 1" @click="fetchSuggestions(currentPage - 1)">Anterior</button>
                <span>{{ currentPage }} de {{ lastPage }}</span>
                <button :disabled="currentPage === lastPage" @click="fetchSuggestions(currentPage + 1)">Próxima</button>
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
    font-size: 1rem;
    font-weight: 600;
}
</style>
