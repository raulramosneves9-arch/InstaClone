<template>
  <div class="profile-header d-flex flex-column flex-md-row align-items-center mb-5">
    <div class="profile-avatar-wrapper me-md-5 mb-4 mb-md-0">
      <img :src="profile.avatar || 'https://via.placeholder.com/150'" class="profile-avatar rounded-circle border" alt="Avatar">
    </div>

    <div class="flex-grow-1">
      <div class="d-flex flex-wrap align-items-center mb-3">
        <h2 class="profile-username mb-0 me-3">{{ profile.username }}</h2>

        <div class="header-actions">
          <template v-if="isOwnProfile">
            <router-link to="/profile/edit" class="btn-ig-ghost btn-sm">Editar perfil</router-link>
          </template>
          <template v-else>
            <button class="btn-sm" :class="isFollowing ? 'btn-ig-ghost' : 'btn-ig'" @click="$emit('toggle-follow')" :disabled="loadingFollow">
              {{ isFollowing ? 'Seguindo' : 'Seguir' }}
            </button>
          </template>
        </div>
      </div>

      <ProfileSummaryCards
        :posts-count="postsCount"
        :followers-count="followersCount"
        :following-count="followingCount"
        :followers-link="followersLink"
        :following-link="followingLink"
      />

      <div v-if="profile.name" class="fw-bold mb-1">{{ profile.name }}</div>
      <div v-if="profile.bio" class="profile-bio">{{ profile.bio }}</div>
    </div>
  </div>
</template>

<script setup>
import ProfileSummaryCards from './ProfileSummaryCards.vue';

defineProps({
  profile: {
    type: Object,
    required: true,
  },
  isOwnProfile: {
    type: Boolean,
    required: true,
  },
  isFollowing: {
    type: Boolean,
    required: true,
  },
  loadingFollow: {
    type: Boolean,
    required: true,
  },
  postsCount: {
    type: Number,
    required: true,
  },
  followersCount: {
    type: Number,
    required: true,
  },
  followingCount: {
    type: Number,
    required: true,
  },
  followersLink: {
    type: [String, Object],
    required: true,
  },
  followingLink: {
    type: [String, Object],
    required: true,
  },
});

defineEmits(['toggle-follow']);
</script>

<style scoped>
.profile-header {
  padding: 0 16px;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.profile-username {
  font-size: 1.25rem;
  font-weight: 300;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.profile-bio {
  white-space: pre-wrap;
  color: var(--text-primary);
  font-size: 0.875rem;
}

@media (max-width: 767px) {
  .profile-avatar {
    width: 77px;
    height: 77px;
  }
  
  .profile-username {
    font-size: 1.25rem;
    font-weight: 400;
  }
}
</style>
