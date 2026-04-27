<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';
import Avatar from '../components/ui/Avatar.vue';
import PostCommentList from '../components/post/PostCommentList.vue';
import PostCommentForm from '../components/post/PostCommentForm.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const postId = route.params.postId;

const post = ref(null);
const comments = ref([]);
const commentsPage = ref(1);
const commentsLastPage = ref(1);
const isLoadingPost = ref(true);
const isLoadingComments = ref(false);
const isDeletingPost = ref(false);
const newComment = ref('');

const currentUser = computed(() => authStore.user);

const fetchPost = async () => {
    isLoadingPost.value = true;
    try {
        const { data } = await api.get(`/posts/${postId}`);
        post.value = data.data || data;
    } catch (error) {
        console.error("Erro ao carregar post", error);
        // Pode redirecionar 404
        if (error.response && error.response.status === 404) {
            router.push({ name: 'not-found' });
        }
    } finally {
        isLoadingPost.value = false;
    }
};

const fetchComments = async (page = 1) => {
    if (isLoadingComments.value) return;
    isLoadingComments.value = true;
    try {
        const { data } = await api.get(`/posts/${postId}/comments?page=${page}`);
        if (page === 1) {
            comments.value = data.data;
        } else {
            comments.value = [...comments.value, ...data.data];
        }
        commentsPage.value = data.current_page || 1;
        commentsLastPage.value = data.last_page || 1;
    } catch (error) {
        console.error("Erro ao carregar comentários", error);
    } finally {
        isLoadingComments.value = false;
    }
};

const loadMoreComments = () => {
    if (commentsPage.value < commentsLastPage.value) {
        fetchComments(commentsPage.value + 1);
    }
};


const handleLike = async () => {
    if (!post.value) return;
    
    // Otimismo
    post.value.isLiked = !post.value.isLiked;
    post.value.likes_count += post.value.isLiked ? 1 : -1;

    try {
        if (post.value.isLiked) {
            await api.post(`/posts/${postId}/like`);
        } else {
            await api.delete(`/posts/${postId}/unlike`);
        }
    } catch (error) {
        // Reverter
        post.value.isLiked = !post.value.isLiked;
        post.value.likes_count += post.value.isLiked ? 1 : -1;
    }
};

const submitComment = async () => {
    if (!newComment.value.trim()) return;

    try {
        const { data } = await api.post(`/posts/${postId}/comments`, { body: newComment.value });
        const commentData = data.data || data;
        
        comments.value.unshift(commentData); // adiciona no início
        post.value.comments_count++;
        newComment.value = '';
    } catch (error) {
        console.error("Erro ao comentar", error);
        alert("Erro ao enviar comentário");
    }
};

const deleteComment = async (commentId, index) => {
    if (!confirm("Tem certeza que deseja apagar este comentário?")) return;

    try {
        await api.delete(`/comments/${commentId}`);
        comments.value.splice(index, 1);
        post.value.comments_count = Math.max(0, post.value.comments_count - 1);
    } catch (error) {
        console.error("Erro ao deletar comentário", error);
        alert("Erro ao deletar comentário");
    }
};

const deletePost = async () => {
    if (!confirm("Tem certeza que deseja apagar este post? Esta ação não pode ser desfeita.")) return;
    
    isDeletingPost.value = true;
    try {
        await api.delete(`/posts/${postId}`);
        router.push('/feed');
    } catch (error) {
        console.error("Erro ao deletar post", error);
        alert("Erro ao deletar post");
        isDeletingPost.value = false;
    }
};

onMounted(() => {
    fetchPost();
    fetchComments();
});
</script>

<template>
    <div class="container py-4">
        <div v-if="isLoadingPost" class="text-center py-5">
            <div class="spinner-border" style="color: var(--accent);" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <div v-else-if="post" class="post-details-container mx-auto">
            <div class="post-image-side">
                <div class="post-image-wrapper" @dblclick="handleLike">
                    <img :src="resolveImageUrl(post.image_url || post.image)" class="post-image" :alt="post.caption">
                </div>
            </div>

            <div class="post-info-side">
                <div class="post-header d-flex justify-content-between align-items-center p-3 border-bottom">
                    <router-link :to="`/profile?user=${post.user?.username}`" class="d-flex align-items-center text-decoration-none">
                        <Avatar :src="post.user?.avatar_url" :size="32" />
                        <span class="ms-2 fw-semibold">{{ post.user?.username }}</span>
                    </router-link>
                    
                    <button v-if="currentUser?.id === post.user?.id" 
                        @click="deletePost" 
                        class="btn-ig-danger" 
                        :disabled="isDeletingPost">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>

                <div class="post-scrollable-content p-3">
                    <div class="post-caption-section mb-4">
                        <div class="d-flex gap-2">
                            <Avatar :src="post.user?.avatar_url" :size="32" />
                            <div>
                                <router-link :to="`/profile?user=${post.user?.username}`" class="fw-semibold text-decoration-none me-2">
                                    {{ post.user?.username }}
                                </router-link>
                                <span>{{ post.caption }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="comments-section">
                        <PostCommentList
                            :comments="comments"
                            :current-user-id="currentUser?.id"
                            @delete-comment="deleteComment"
                        />

                        <button v-if="commentsPage < commentsLastPage" 
                            @click="loadMoreComments" 
                            class="btn-ig-text mt-2"
                            :disabled="isLoadingComments">
                            <span v-if="isLoadingComments" class="spinner-border spinner-border-sm me-1" role="status"></span>
                            Carregar mais comentários
                        </button>
                    </div>
                </div>

                <div class="post-actions-section p-3 border-top">
                    <div class="d-flex gap-3 mb-2">
                        <i @click="handleLike" class="bi fs-4 cursor-pointer action-icon"
                            :class="[post.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                        <i class="bi bi-chat fs-4 action-icon"></i>
                        <i class="bi bi-send fs-4 action-icon"></i>
                    </div>

                    <div class="fw-bold mb-1">{{ post.likes_count || 0 }} curtidas</div>
                    <div class="text-muted x-small text-uppercase">
                        {{ post.comments_count || 0 }} comentários
                    </div>
                </div>

                <div class="post-comment-input border-top">
                    <PostCommentForm v-model="newComment" @submit="submitComment" />
                </div>
            </div>
        </div>

        <div v-else class="text-center py-5">
            <h4 class="text-muted">Post não encontrado</h4>
            <router-link to="/feed" class="btn btn-primary mt-3">Voltar ao Feed</router-link>
        </div>
    </div>
</template>

<style scoped>
.post-details-container {
    max-width: 935px;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-main);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    min-height: 450px;
}

@media (min-width: 768px) {
    .post-details-container {
        flex-direction: row;
    }
    
    .post-image-side {
        flex: 1 1 60%;
        background-color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid var(--border);
    }
    
    .post-info-side {
        flex: 0 0 40%;
        display: flex;
        flex-direction: column;
        max-width: 400px;
    }
}

.post-image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.post-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
}

.post-scrollable-content {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 400px;
}

.cursor-pointer {
    cursor: pointer;
}

.action-icon {
    transition: opacity 0.2s ease;
}

.action-icon:hover {
    opacity: 0.7;
}

.bi-heart-fill {
    color: var(--danger) !important;
}

.x-small {
    font-size: 0.75rem;
}
</style>
