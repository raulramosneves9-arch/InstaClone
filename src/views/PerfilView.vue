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
      <ProfileHeader
        :profile="profile"
        :is-own-profile="isOwnProfile"
        :is-following="isFollowing"
        :loading-follow="loadingFollow"
        :posts-count="posts.length"
        :followers-count="followersCount"
        :following-count="followingCount"
        :followers-link="followersLink"
        :following-link="followingLink"
        @toggle-follow="toggleFollow"
      />
      
      <hr>
      
      <ProfilePostGrid :posts="posts" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { useFollowsStore } from '../stores/follows';
import { CONNECTION_LIST_TYPES } from '../router/routeNames';
import ProfileHeader from '../components/profile/ProfileHeader.vue';
import ProfilePostGrid from '../components/profile/ProfilePostGrid.vue';

const route = useRoute();
const authStore = useAuthStore();
const followsStore = useFollowsStore();

const profile = ref(null);
const posts = ref([]);
const followersCount = ref(0);
const followingCount = ref(0);

const loading = ref(true);
const error = ref(null);

const loadingFollow = computed(() => {
  if (!profile.value) return false;
  return followsStore.pendingIds.has(profile.value.id);
});

const username = computed(() => {
  return route.query.user || authStore.user?.username;
});

const isOwnProfile = computed(() => {
  return authStore.user && profile.value && authStore.user.id === profile.value.id;
});

const followersLink = computed(() => {
  return route.query.user
    ? `/profile/list/${CONNECTION_LIST_TYPES.FOLLOWERS}?user=${username.value}`
    : `/profile/list/${CONNECTION_LIST_TYPES.FOLLOWERS}`;
});

const followingLink = computed(() => {
  return route.query.user
    ? `/profile/list/${CONNECTION_LIST_TYPES.FOLLOWING}?user=${username.value}`
    : `/profile/list/${CONNECTION_LIST_TYPES.FOLLOWING}`;
});

const isFollowing = computed(() => {
  if (!profile.value) return false;
  return followsStore.followingIds.has(profile.value.id);
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
    
    if (authStore.user?.id) {
      await followsStore.fetchFollowing(authStore.user.id);
    }

    // 3. If it's a third-party profile, check if following
    if (!isOwnProfile.value) {
      try {
        const isFollowingRes = await api.get(`/users/${targetId}/is-following`);
        const isFollowingNow = isFollowingRes.data.is_following !== undefined ? isFollowingRes.data.is_following : !!isFollowingRes.data;
        if (isFollowingNow) {
          followsStore.followingIds.add(targetId);
        } else {
          followsStore.followingIds.delete(targetId);
        }
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

  const targetId = profile.value.id;

  try {
    const wasFollowing = isFollowing.value;
    await followsStore.toggleFollow(targetId);
    if (wasFollowing) {
      followersCount.value = Math.max(0, followersCount.value - 1);
    } else {
      followersCount.value++;
    }
  } catch (err) {
    console.error("Erro ao alterar estado de seguir", err);
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

.profile-container hr {
  border-color: var(--border);
  opacity: 1;
}
</style>