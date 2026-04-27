<template>
  <div class="row g-1 profile-grid">
    <div v-for="post in posts" :key="post.id" class="col-4">
      <router-link :to="`/posts/${post.id}`" class="d-block ratio ratio-1x1 post-thumb position-relative overflow-hidden group">
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
</template>

<script setup>
defineProps({
  posts: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.group:hover .hover-opacity-100 {
  opacity: 1 !important;
}

.transition {
  transition: opacity 0.2s ease-in-out;
}

.post-thumb {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
}
</style>
