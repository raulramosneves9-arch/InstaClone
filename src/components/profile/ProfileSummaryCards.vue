<template>
  <div class="d-flex mb-2 gap-3 summary-row">
    <div><strong>{{ postsCount }}</strong> publicações</div>
    <div>
      <router-link :to="followersLink" class="text-decoration-none text-body summary-link">
        <strong>{{ followersCount }}</strong> seguidores
      </router-link>
    </div>
    <div>
      <router-link :to="followingLink" class="text-decoration-none text-body summary-link">
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
}

.summary-link {
  transition: opacity 0.2s ease;
}

.summary-link:hover {
  opacity: 0.7;
}
</style>
