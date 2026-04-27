<template>
  <div class="container py-4" style="max-width: 600px; margin: 0 auto;">
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-link text-body p-0 me-3 nav-back-btn" @click="goBack">
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
      
      <div class="d-flex flex-column gap-3 mb-4">
        <div v-for="user in users" :key="user.id">
          <AccountCard
            :user="user"
            compact
            :is-following="followsStore.followingIds.has(user.id)"
            :is-pending="followsStore.pendingIds.has(user.id)"
            :show-follow-button="authStore.user?.id !== user.id"
            @click="goToProfile(user.username)"
            @toggle-follow="followsStore.toggleFollow(user.id)"
          />
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
import { useFollowsStore } from '../stores/follows';
import api from '../services/api';
import { CONNECTION_LIST_TYPES, ROUTE_NAMES } from '../router/routeNames';
import AccountCard from '../components/profile/AccountCard.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const followsStore = useFollowsStore();

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const currentPage = ref(1);
const lastPage = ref(1);

const type = computed(() => route.params.type);
const targetUsername = computed(() => route.query.user || authStore.user?.username);

const title = computed(() => {
  return type.value === CONNECTION_LIST_TYPES.FOLLOWERS ? 'Seguidores' : 'Seguindo';
});

const isValidType = computed(() => {
  return Object.values(CONNECTION_LIST_TYPES).includes(type.value);
});

const normalizedType = computed(() => {
  if (isValidType.value) return type.value;
  if (type.value === 'seguidores') return CONNECTION_LIST_TYPES.FOLLOWERS;
  if (type.value === 'seguindo') return CONNECTION_LIST_TYPES.FOLLOWING;
  return null;
});

const goBack = () => {
  if (route.query.user) {
    router.push(`/profile?user=${route.query.user}`);
  } else {
    router.push('/profile');
  }
};

const goToProfile = (username) => {
  router.push(`/profile?user=${username}`);
};

const fetchData = async (page = 1) => {
  if (!targetUsername.value || !normalizedType.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // 1. Resolver o ID do usuário alvo
    const profileRes = await api.get(`/users/${targetUsername.value}`);
    const targetId = profileRes.data.id;
    
    // 2. Buscar a lista
    const endpoint = normalizedType.value === CONNECTION_LIST_TYPES.FOLLOWERS ? `/users/${targetId}/followers` : `/users/${targetId}/following`;
    const res = await api.get(`${endpoint}?page=${page}`);
    
    users.value = res.data.data || res.data;
    currentPage.value = res.data.current_page || 1;
    lastPage.value = res.data.last_page || 1;
    
    // Garantir que a lista de quem eu sigo está carregada para os botões funcionarem
    if (authStore.user?.id && followsStore.followingIds.size === 0) {
      await followsStore.fetchFollowing(authStore.user.id);
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao carregar a lista.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!normalizedType.value) {
    router.replace({ name: ROUTE_NAMES.NOT_FOUND });
    return;
  }
  if (!isValidType.value && normalizedType.value) {
    router.replace({
      name: ROUTE_NAMES.PERFIL_LISTA,
      params: { type: normalizedType.value },
      query: route.query,
    });
    return;
  }
  fetchData();
});

watch(() => route.params.type, () => {
  if (!normalizedType.value) {
    router.replace({ name: ROUTE_NAMES.NOT_FOUND });
    return;
  }
  if (!isValidType.value && normalizedType.value) {
    router.replace({
      name: ROUTE_NAMES.PERFIL_LISTA,
      params: { type: normalizedType.value },
      query: route.query,
    });
    return;
  }
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

.nav-back-btn:hover {
  opacity: 0.7;
}
</style>
