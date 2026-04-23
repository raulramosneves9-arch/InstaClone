<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useDiscoverStore } from '@/stores/discover';

const router = useRouter();
const authStore = useAuthStore();
const discoverStore = useDiscoverStore();

onMounted(async () => {
    // Busca perfis seguidos para marcar os botões
    if (authStore.user?.id) {
        await discoverStore.fetchFollowing(authStore.user.id);
    }
    // Busca a primeira página de sugestões
    await discoverStore.fetchSuggestions(1);
});

const goToProfile = (username) => {
    router.push({ path: '/perfil', query: { user: username } });
};
</script>

<template>
    <div class="descobrir-view container py-4">
        <h2 class="mb-4">Descobrir Pessoas</h2>

        <div v-if="discoverStore.isLoading" class="d-flex justify-content-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <template v-else>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                <div v-for="user in discoverStore.suggestions" :key="user.id" class="col">
                    <div class="card h-100 text-center shadow-sm cursor-pointer border-0 rounded-3" @click="goToProfile(user.username)">
                        <div class="card-body d-flex flex-column align-items-center">
                            <img 
                                :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'" 
                                class="rounded-circle mb-3 border" 
                                style="width: 80px; height: 80px; object-fit: cover;" 
                                alt="Avatar"
                            >
                            <h5 class="card-title mb-0 text-truncate w-100">{{ user.name }}</h5>
                            <p class="card-text text-muted small mb-3">@{{ user.username }}</p>
                            
                            <button 
                                class="btn btn-sm mt-auto" 
                                :class="discoverStore.followingIds.has(user.id) ? 'btn-outline-secondary' : 'btn-primary'"
                                @click.stop="discoverStore.toggleFollow(user.id)"
                            >
                                {{ discoverStore.followingIds.has(user.id) ? 'Seguindo' : 'Seguir' }}
                            </button>
                        </div>
                    </div>
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
.cursor-pointer {
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}
.cursor-pointer:hover {
    transform: translateY(-5px);
}
</style>
