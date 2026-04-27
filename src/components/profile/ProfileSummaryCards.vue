<template>
  <div class="d-flex mb-4 gap-3 summary-row">
    <div class="summary-item"><strong>{{ postsCount }}</strong> {{ postsCount === 1 ? 'post' : 'posts' }}</div>
    <div class="summary-item">
      <router-link :to="followersLink" class="text-decoration-none summary-link">
        <strong>{{ followersCount }}</strong> {{ followersCount === 1 ? 'seguidor' : 'seguidores' }}
      </router-link>
    </div>
    <div class="summary-item">
      <router-link :to="followingLink" class="text-decoration-none summary-link">
        <strong>{{ followingCount }}</strong> seguindo
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
</script>

<style scoped>
.summary-row {
  color: var(--text-primary);
  font-size: 0.95rem;
}

.summary-link {
  color: inherit;
  transition: opacity 0.2s ease;
}

.summary-link:hover {
  opacity: 0.7;
}
</style>
