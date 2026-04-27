<template>
  <div class="profile-header d-flex align-items-center mb-4">
    <img :src="profile.avatar || 'https://via.placeholder.com/100'" class="rounded-circle me-4 object-fit-cover border" width="100" height="100" alt="Avatar">

    <div class="flex-grow-1">
      <div class="d-flex align-items-center mb-2">
        <h4 class="mb-0 me-3 fw-semibold">{{ profile.username }}</h4>

        <template v-if="isOwnProfile">
          <router-link to="/profile/edit" class="btn btn-outline-secondary btn-sm">Editar perfil</router-link>
        </template>
        <template v-else>
          <button class="btn btn-sm" :class="isFollowing ? 'btn-secondary' : 'btn-primary'" @click="$emit('toggle-follow')" :disabled="loadingFollow">
            {{ isFollowing ? 'Seguindo' : 'Seguir' }}
          </button>
        </template>
      </div>

      <ProfileSummaryCards
        :posts-count="postsCount"
        :followers-count="followersCount"
        :following-count="followingCount"
        :followers-link="followersLink"
        :following-link="followingLink"
      />

      <div v-if="profile.name" class="fw-semibold">{{ profile.name }}</div>
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
  gap: 8px;
}

.profile-bio {
  white-space: pre-wrap;
  color: var(--text-primary);
}
</style>
