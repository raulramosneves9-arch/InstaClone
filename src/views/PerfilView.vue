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
      <ProfileHeader :profile="profile" :is-own-profile="isOwnProfile" :is-following="isFollowing"
        :loading-follow="loadingFollow" :posts-count="posts.length" :followers-count="followersCount"
        :following-count="followingCount" :followers-link="followersLink" :following-link="followingLink"
        @toggle-follow="toggleFollow" />

      <!-- Highlights (Mockup) -->
      <div class="highlights-section d-flex gap-4 mb-5 overflow-auto pb-2 px-2">
        <div v-for="i in 3" :key="i" class="highlight-item d-flex flex-column align-items-center">
          <div class="highlight-circle mb-2">
            <img src="../assets/images/highlight1.jpg" alt="highlight">
          </div>
          <span class="highlight-label">.</span>
        </div>
        <div v-if="isOwnProfile" class="highlight-item d-flex flex-column align-items-center">
          <div class="highlight-circle-add mb-2 d-flex justify-content-center align-items-center">
            <i class="bi bi-plus-lg fs-2"></i>
          </div>
          <span class="highlight-label">Novo</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="profile-tabs border-top d-flex justify-content-center gap-5">
        <button class="profile-tab active">
          <AppIcon name="posts" size-class="fs-6 me-2" />
          <span>PUBLICAÇÕES</span>
        </button>
        <button class="profile-tab">
          <AppIcon name="saved" size-class="fs-6 me-2" />
          <span>SALVOS</span>
        </button>
        <button class="profile-tab">
          <AppIcon name="tagged" size-class="fs-6 me-2" />
          <span>MARCADOS</span>
        </button>
      </div>

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
import AppIcon from '../components/ui/AppIcon.vue';

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
  max-width: 935px;
  margin: 0 auto;
}

.highlights-section {
  padding-left: 10px;
  margin-top: 10px;
}

.highlight-circle,
.highlight-circle-add {
  width: 87px;
  height: 87px;
  border-radius: 50%;
  border: 1px solid var(--border);
  padding: 3px;
  background-color: var(--bg-main);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.highlight-circle img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.highlight-circle-add {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.highlight-circle-add i {
  color: var(--text-secondary);
}

.highlight-label {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-top: 8px;
}

.profile-tabs {
  margin-top: 20px;
  border-top: 1px solid var(--border);
}

.profile-tab {
  background: transparent;
  border: none;
  border-top: 1px solid transparent;
  padding: 18px 0;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 1px;
  margin-top: -1px;
}

.profile-tab.active {
  color: var(--text-primary);
  border-top-color: var(--text-primary);
}

.profile-tab span {
  display: inline-block;
}

@media (max-width: 767px) {
  .highlights-section {
    padding-left: 0;
  }

  .profile-tab span {
    display: none;
  }

  .profile-tab {
    padding: 12px 0;
  }
}
</style>