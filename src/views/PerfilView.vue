<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else-if="profile" class="profile-container">
      <!-- Profile Header -->
      <div class="d-flex align-items-center mb-4">
        <img :src="profile.avatar || 'https://via.placeholder.com/100'" 
             class="rounded-circle me-4 object-fit-cover" 
             width="100" height="100" alt="Avatar">
             
        <div class="flex-grow-1">
          <div class="d-flex align-items-center mb-2">
            <h4 class="mb-0 me-3">{{ profile.username }}</h4>
            
            <template v-if="isOwnProfile">
              <router-link to="/perfil/editar" class="btn btn-outline-secondary btn-sm">Editar perfil</router-link>
            </template>
            <template v-else>
              <button class="btn btn-sm" :class="isFollowing ? 'btn-secondary' : 'btn-primary'" @click="toggleFollow" :disabled="loadingFollow">
                {{ isFollowing ? 'Seguindo' : 'Seguir' }}
              </button>
            </template>
          </div>
          
          <div class="d-flex mb-2 gap-3">
            <div><strong>{{ posts.length }}</strong> publicações</div>
            <div>
              <router-link :to="followersLink" class="text-decoration-none text-body">
                <strong>{{ followersCount }}</strong> seguidores
              </router-link>
            </div>
            <div>
              <router-link :to="followingLink" class="text-decoration-none text-body">
                <strong>{{ followingCount }}</strong> seguindo
              </router-link>
            </div>
          </div>
          
          <div v-if="profile.name" class="fw-bold">{{ profile.name }}</div>
          <div v-if="profile.bio" style="white-space: pre-wrap;">{{ profile.bio }}</div>
        </div>
      </div>
      
      <hr>
      
      <!-- Posts Grid -->
      <div class="row g-1">
        <div v-for="post in posts" :key="post.id" class="col-4">
          <router-link :to="`/posts/${post.id}`" class="d-block ratio ratio-1x1 bg-light position-relative overflow-hidden group">
            <img :src="post.image_url" class="object-fit-cover w-100 h-100" alt="Post image">
            <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center opacity-0 hover-opacity-100 transition text-white">
               <span class="me-3"><i class="bi bi-heart-fill me-1"></i> {{ post.likes_count || 0 }}</span>
               <span><i class="bi bi-chat-fill me-1"></i> {{ post.comments_count || 0 }}</span>
            </div>
          </router-link>
        </div>
        <div v-if="posts.length === 0" class="col-12 text-center text-muted py-5">
          <i class="bi bi-camera fs-1 mb-2"></i>
          <p>Nenhuma publicação ainda.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const route = useRoute();
const authStore = useAuthStore();

const profile = ref(null);
const posts = ref([]);
const followersCount = ref(0);
const followingCount = ref(0);
const isFollowing = ref(false);

const loading = ref(true);
const error = ref(null);
const loadingFollow = ref(false);

const username = computed(() => {
  return route.query.user || authStore.user?.username;
});

const isOwnProfile = computed(() => {
  return authStore.user && profile.value && authStore.user.id === profile.value.id;
});

const followersLink = computed(() => {
  return route.query.user ? `/perfil/lista/seguidores?user=${username.value}` : '/perfil/lista/seguidores';
});

const followingLink = computed(() => {
  return route.query.user ? `/perfil/lista/seguindo?user=${username.value}` : '/perfil/lista/seguindo';
});

async function loadProfileData() {
  if (!username.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // 1. Get profile
    const profileRes = await api.get(`/users/${username.value}`);
    profile.value = profileRes.data;
    
    // 2. Fetch posts, followers count, following count in parallel
    const targetId = profile.value.id;
    const [postsRes, followersRes, followingRes] = await Promise.all([
      api.get(`/users/${targetId}/posts`),
      api.get(`/users/${targetId}/followers`),
      api.get(`/users/${targetId}/following`)
    ]);
    
    posts.value = postsRes.data.data || postsRes.data || [];
    
    followersCount.value = followersRes.data.total !== undefined ? followersRes.data.total : (followersRes.data.data || followersRes.data).length;
    followingCount.value = followingRes.data.total !== undefined ? followingRes.data.total : (followingRes.data.data || followingRes.data).length;
    
    // 3. If it's a third-party profile, check if following
    if (!isOwnProfile.value) {
      try {
        const isFollowingRes = await api.get(`/users/${targetId}/is-following`);
        isFollowing.value = isFollowingRes.data.is_following !== undefined ? isFollowingRes.data.is_following : !!isFollowingRes.data;
      } catch (err) {
        console.error("Erro ao checar follows", err);
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao carregar o perfil. Usuário não encontrado.';
  } finally {
    loading.value = false;
  }
}

async function toggleFollow() {
  if (loadingFollow.value || !profile.value) return;
  
  loadingFollow.value = true;
  const targetId = profile.value.id;
  
  try {
    if (isFollowing.value) {
      await api.delete(`/users/${targetId}/unfollow`);
      isFollowing.value = false;
      followersCount.value = Math.max(0, followersCount.value - 1);
    } else {
      await api.post(`/users/${targetId}/follow`);
      isFollowing.value = true;
      followersCount.value++;
    }
  } catch (err) {
    console.error("Erro ao alterar estado de seguir", err);
  } finally {
    loadingFollow.value = false;
  }
}

watch(() => route.query.user, () => {
  loadProfileData();
});

onMounted(() => {
  loadProfileData();
});
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
}
.group:hover .hover-opacity-100 {
  opacity: 1 !important;
}
.transition {
  transition: opacity 0.2s ease-in-out;
}
</style>