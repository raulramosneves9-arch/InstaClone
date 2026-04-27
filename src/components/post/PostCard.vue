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
    <article class="post-card mb-4 mx-auto">
        <header class="post-header d-flex align-items-center py-2 px-1">
            <Avatar :src="post.user?.avatar_url" :size="32" />
            <div class="ms-3 d-flex align-items-center">
                <span class="fw-semibold small username me-2">{{ post.user?.username || 'Usuário' }}</span>
                <span v-if="post.created_at" class="text-muted small">• {{ timeAgo(post.created_at) }}</span>
            </div>
            <div class="ms-auto me-1">
                <i class="bi bi-three-dots fs-5 cursor-pointer"></i>
            </div>
        </header>

        <div class="post-image-container border rounded" @dblclick="handleLike">
            <img :src="resolveImageUrl(post.image_url || post.image)" class="img-fluid w-100" :alt="post.caption"
                loading="lazy">
        </div>

        <div class="post-actions pt-3 px-1">
            <div class="d-flex gap-3 mb-2">
                <i @click="handleLike" class="bi fs-4 cursor-pointer action-icon"
                    :class="[post.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                <i class="bi bi-chat fs-4 action-icon cursor-pointer"></i>
                <i class="bi bi-send fs-4 action-icon cursor-pointer"></i>
                <i class="bi bi-bookmark ms-auto fs-4 action-icon cursor-pointer"></i>
            </div>

            <div class="post-info">
                <p class="fw-bold small mb-1">{{ post.likes_count || 0 }} curtidas</p>

                <div class="post-caption small mb-2">
                    <span class="fw-bold me-2 username">{{ post.user?.username }}</span>
                    <span>{{ post.caption }}</span>
                </div>

                <div v-if="post.comments?.length > 0" class="comments-preview mb-2">
                    <div v-for="comment in post.comments.slice(0, 2)" :key="comment.id" class="small mb-1">
                        <span class="fw-bold me-2">{{ comment.user?.username }}</span>
                        <span>{{ comment.content || comment.body }}</span>
                    </div>
                </div>

                <form @submit.prevent="submitComment" class="comment-form d-flex align-items-center py-1">
                    <input v-model="commentContent" type="text"
                        class="form-control form-control-sm border-0 shadow-none ps-0 bg-transparent text-white"
                        placeholder="Adicione um comentário...">
                    <button v-if="commentContent.trim()" type="submit" class="btn-post-comment">
                        Publicar
                    </button>
                </form>
            </div>
        </div>
    </article>
</template>

<style scoped>
.post-card {
    max-width: 100%;
    background-color: transparent;
}

.post-header {
    background-color: transparent;
}

.post-image-container {
    background-color: #000;
    overflow: hidden;
    border: 1px solid #262626 !important;
}

.post-image-container img {
    display: block;
    object-fit: contain;
    max-height: 800px;
}

.action-icon {
    transition: opacity 0.2s ease;
    cursor: pointer;
}

.action-icon:hover {
    opacity: 0.6;
}

.bi-heart-fill {
    color: #ff3040 !important;
}

.username {
    font-size: 0.875rem;
}

.btn-post-comment {
    background: none;
    border: none;
    color: #0095f6;
    font-weight: 600;
    font-size: 14px;
    padding: 0;
}

.btn-post-comment:hover {
    color: #ffffff;
}

.form-control::placeholder {
    color: #737373;
    font-size: 14px;
}

.cursor-pointer {
    cursor: pointer;
}
</style>