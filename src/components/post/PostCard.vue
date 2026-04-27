<script setup>
import { ref } from 'vue';
import { useFeedStore } from '../../stores/feed';
import Avatar from '../ui/Avatar.vue';
import { timeAgo } from '../../utils/dates';
import { resolveImageUrl } from '../../utils/imageUrl';

const props = defineProps({
    post: { type: Object, required: true }
});

const feedStore = useFeedStore();
const commentContent = ref('');

const handleLike = () => {
    feedStore.toggleLike(props.post.id);
};

const submitComment = async () => {
    if (!commentContent.value.trim()) return;

    try {
        await feedStore.addComment(props.post.id, commentContent.value);
        commentContent.value = ''; // Limpa o campo após enviar
    } catch (error) {
        alert("Erro ao enviar comentário");
    }
};

</script>

<template>
    <div class="post-card mb-3 mx-auto">
        <div class="post-header d-flex align-items-center py-2 px-3">
            <Avatar :src="post.user?.avatar_url" :size="32" />
            <span class="ms-2 fw-semibold small username">{{ post.user?.username || 'Usuário' }}</span>
        </div>

        <div class="post-image-bg" @dblclick="handleLike">
            <img :src="resolveImageUrl(post.image_url || post.image)" class="img-fluid w-100" :alt="post.caption"
                loading="lazy">
        </div>

        <div class="post-content">
            <div class="d-flex gap-3 mb-2">
                <i @click="handleLike" class="bi fs-4 cursor-pointer action-icon"
                    :class="[post.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                <i class="bi bi-chat fs-4 action-icon"></i>
                <i class="bi bi-send fs-4 action-icon"></i>
                <i class="bi bi-bookmark ms-auto fs-5 action-icon"></i>
            </div>

            <p class="fw-semibold small mb-1 username">{{ post.likes_count || 0 }} curtidas</p>

            <p class="mb-2 small">
                <span class="fw-semibold me-2 username">{{ post.user?.username }}</span>
                {{ post.caption }}
            </p>
            <p v-if="post.created_at" class="text-muted x-small mb-2 text-uppercase">
                {{ timeAgo(post.created_at) }}
            </p>

            <div v-if="post.comments?.length > 0" class="mt-2 border-top pt-2">
                <div v-for="comment in post.comments" :key="comment.id" class="small mb-1">
                    <span class="fw-bold me-2">{{ comment.user?.username }}</span>
                    <span>{{ comment.content || comment.body }}</span>
                </div>
            </div>
        </div>

        <div class="post-footer">
            <form @submit.prevent="submitComment" class="comment-form d-flex align-items-center px-3 py-2 border-top">
                <input v-model="commentContent" type="text"
                    class="form-control form-control-sm border-0 shadow-none ps-0"
                    placeholder="Adicione um comentário...">
                <button type="submit" class="btn-ig-text fw-bold"
                    :disabled="!commentContent.trim()">
                    Publicar
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.post-card {
    max-width: 470px;
    background-color: var(--bg-main);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
}

.post-header {
    border-bottom: 1px solid transparent;
}

.post-content {
    padding: 12px 16px;
}

.post-image-bg {
    background-color: var(--bg-main);
    min-height: 300px;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.cursor-pointer {
    cursor: pointer;
}

.action-icon {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.action-icon:hover {
    opacity: 0.7;
}

.bi-heart-fill {
    color: var(--danger) !important;
    transform: scale(1.2);
}

.username {
    font-weight: 600;
}

.x-small {
    font-size: 0.72rem;
    letter-spacing: 0.03em;
}

.form-control:focus {
    box-shadow: none;
}
</style>