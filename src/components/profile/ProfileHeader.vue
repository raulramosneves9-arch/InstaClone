<template>
  <div class="profile-header mb-5">
    <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-4">
      <!-- Avatar -->
      <div class="profile-avatar-wrapper me-md-5 mb-4 mb-md-0 d-flex justify-content-center">
        <div class="position-relative">
          <Avatar :src="resolveImageUrl(profile.avatar_url || profile.avatar)" 
                  :size="isMobile ? 77 : 150" 
                  :alt="profile.username" />
          <!-- Mock Note bubble (optional visual match) -->
          <div v-if="isOwnProfile" class="note-bubble d-none d-md-flex">Nota...</div>
        </div>
      </div>

      <!-- Info -->
      <div class="flex-grow-1 w-100 text-center text-md-start">
        <div class="d-flex align-items-center justify-content-center justify-content-md-start mb-2 gap-2">
          <h2 class="profile-username mb-0">{{ profile.username }}</h2>
          <button class="btn-ig-icon p-1"><AppIcon name="settings" size-class="fs-5" /></button>
        </div>

        <div v-if="profile.name" class="fw-bold mb-2">{{ profile.name }}</div>

        <div class="mb-3">
          <ProfileSummaryCards
            :posts-count="postsCount"
            :followers-count="followersCount"
            :following-count="followingCount"
            :followers-link="followersLink"
            :following-link="followingLink"
          />
        </div>

        <div v-if="profile.bio" class="profile-bio mb-3">{{ profile.bio }}</div>
      </div>
    </div>

    <!-- Actions Row -->
    <div class="header-actions d-flex gap-2">
      <template v-if="isOwnProfile">
        <router-link to="/profile/edit" class="btn-ig-secondary flex-grow-1">Editar perfil</router-link>
        <button class="btn-ig-secondary flex-grow-1">Ver Itens Arquivados</button>
      </template>
      <template v-else>
        <button class="btn-ig flex-grow-1" :class="{ 'btn-ig-secondary': isFollowing }" @click="$emit('toggle-follow')" :disabled="loadingFollow">
          {{ isFollowing ? 'Seguindo' : 'Seguir' }}
        </button>
        <button class="btn-ig-secondary flex-grow-1">Enviar mensagem</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ProfileSummaryCards from './ProfileSummaryCards.vue';
import Avatar from '../ui/Avatar.vue';
import AppIcon from '../ui/AppIcon.vue';
import { resolveImageUrl } from '../../utils/imageUrl';

const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

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

.note-bubble {
  position: absolute;
  top: -10px;
  left: 0;
  background-color: #363636;
  color: var(--text-primary);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.profile-username {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-bio {
  white-space: pre-wrap;
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (max-width: 767px) {
  .profile-header {
    padding: 0 16px;
  }
  
  .profile-username {
    font-size: 1.15rem;
  }
  
  .header-actions {
    margin-top: 10px;
  }
}
</style>
