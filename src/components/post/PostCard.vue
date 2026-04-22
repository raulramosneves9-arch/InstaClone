<script setup>
import { useFeedStore } from '../../stores/feed';
import Avatar from '../ui/Avatar.vue';

const props = defineProps({
    post: { type: Object, required: true }
});

const feedStore = useFeedStore();

const handleLike = () => {
    feedStore.toggleLike(props.post.id);
};
</script>

<template>
    <div class="card mb-4 border shadow-sm mx-auto post-card">
        <div class="card-header bg-white d-flex align-items-center border-0 py-2">
            <Avatar :src="post.user.avatar_url" :size="32" />
            <span class="ms-2 fw-bold small">{{ post.user.username }}</span>
        </div>

        <div class="post-image-bg" @dblclick="handleLike">
            <img :src="post.image_url" class="img-fluid w-100" :alt="post.caption">
        </div>

        <div class="card-body p-3">
            <div class="d-flex gap-3 mb-2">
                <i @click="handleLike" class="bi fs-4 cursor-pointer"
                    :class="[post.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                <i class="bi bi-chat fs-4"></i>
            </div>

            <p class="fw-bold small mb-1">{{ post.likes_count || 0 }} curtidas</p>

            <p class="mb-1 small">
                <span class="fw-bold me-2">{{ post.user.username }}</span>
                {{ post.caption }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.post-card {
    max-width: 470px;
}

.post-image-bg {
    background-color: #fafafa;
    min-height: 300px;
    display: flex;
    align-items: center;
}

.cursor-pointer {
    cursor: pointer;
}
</style>