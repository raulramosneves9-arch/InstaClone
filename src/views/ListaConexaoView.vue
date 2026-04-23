<template>
  <div class="container py-4" style="max-width: 600px; margin: 0 auto;">
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-link text-body p-0 me-3" @click="goBack">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <h3 class="mb-0">{{ title }}</h3>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="users.length === 0" class="text-center py-5 text-muted">
        Nenhum usuário encontrado.
      </div>
      
      <div class="list-group list-group-flush mb-4">
        <div v-for="user in users" :key="user.id" class="list-group-item px-0 d-flex align-items-center border-0 mb-2">
          <div class="cursor-pointer d-flex align-items-center flex-grow-1" @click="goToProfile(user.username)">
            <img :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'" 
                 class="rounded-circle me-3 object-fit-cover" 
                 width="50" height="50" alt="Avatar">
            <div>
              <div class="fw-bold text-dark">{{ user.username }}</div>
              <div class="text-muted small">{{ user.name }}</div>
            </div>
          </div>
          
          <div v-if="authStore.user?.id !== user.id">
            <button 
              class="btn btn-sm" 
              :class="discoverStore.followingIds.has(user.id) ? 'btn-secondary' : 'btn-primary'"
              @click="discoverStore.toggleFollow(user.id)"
            >
              {{ discoverStore.followingIds.has(user.id) ? 'Seguindo' : 'Seguir' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Paginação -->
      <div v-if="lastPage > 1" class="d-flex justify-content-center mt-4">
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="fetchData(currentPage - 1)">Anterior</button>
            </li>
            <li class="page-item disabled">
              <span class="page-link">{{ currentPage }} de {{ lastPage }}</span>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === lastPage }">
              <button class="page-link" @click="fetchData(currentPage + 1)">Próxima</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useDiscoverStore } from '../stores/discover';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const discoverStore = useDiscoverStore();

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const currentPage = ref(1);
const lastPage = ref(1);

const type = computed(() => route.params.type); // 'seguidores' ou 'seguindo'
const targetUsername = computed(() => route.query.user || authStore.user?.username);

const title = computed(() => {
  return type.value === 'seguidores' ? 'Seguidores' : 'Seguindo';
});

const goBack = () => {
  if (route.query.user) {
    router.push(`/perfil?user=${route.query.user}`);
  } else {
    router.push('/perfil');
  }
};

const goToProfile = (username) => {
  router.push(`/perfil?user=${username}`);
};

const fetchData = async (page = 1) => {
  if (!targetUsername.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // 1. Resolver o ID do usuário alvo
    const profileRes = await api.get(`/users/${targetUsername.value}`);
    const targetId = profileRes.data.id;
    
    // 2. Buscar a lista
    const endpoint = type.value === 'seguidores' ? `/users/${targetId}/followers` : `/users/${targetId}/following`;
    const res = await api.get(`${endpoint}?page=${page}`);
    
    users.value = res.data.data || res.data;
    currentPage.value = res.data.current_page || 1;
    lastPage.value = res.data.last_page || 1;
    
    // Garantir que a lista de quem eu sigo está carregada para os botões funcionarem
    if (authStore.user?.id && discoverStore.followingIds.size === 0) {
      await discoverStore.fetchFollowing(authStore.user.id);
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao carregar a lista.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

watch(() => route.params.type, () => {
  fetchData(1);
});

watch(() => route.query.user, () => {
  fetchData(1);
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
