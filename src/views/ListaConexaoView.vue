<template>
  <div class="connections-view mx-auto">
    <div class="connections-header d-flex align-items-center mb-3 border-bottom py-2">
      <button class="nav-back-btn p-2" @click="goBack">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <h3 class="connections-title flex-grow-1 text-center mb-0 pe-5">{{ title }}</h3>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--accent);" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="error-msg mb-3">
      {{ error }}
    </div>

    <div v-else>
      <div class="connections-list mb-4">
        <AccountCard
          v-for="user in users"
          :key="user.id"
          :user="user"
          compact
          :is-following="followsStore.followingIds.has(user.id)"
          :is-pending="followsStore.pendingIds.has(user.id)"
          :show-follow-button="authStore.user?.id !== user.id"
          @click="goToProfile(user.username)"
          @toggle-follow="followsStore.toggleFollow(user.id)"
        />
      </div>
      
      <!-- Paginação -->
      <div v-if="lastPage > 1" class="ig-pagination mt-4">
        <button :disabled="currentPage === 1" @click="fetchData(currentPage - 1)">Anterior</button>
        <span>{{ currentPage }} de {{ lastPage }}</span>
        <button :disabled="currentPage === lastPage" @click="fetchData(currentPage + 1)">Próxima</button>
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
.connections-view {
  max-width: 600px;
  background-color: var(--bg-main);
  min-height: 80vh;
}

.connections-header {
  border-color: var(--border) !important;
}

.connections-title {
  font-size: 1rem;
  font-weight: 600;
}

.nav-back-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.nav-back-btn:hover {
  opacity: 0.7;
}

.connections-list {
  display: flex;
  flex-column: column;
  flex-direction: column;
}
</style>
