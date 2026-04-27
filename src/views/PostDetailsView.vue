<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
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

const formatImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/500x500?text=Sem+Imagem';
    if (url.startsWith('http')) return url;
    const cleanPath = url.replace('public/', '');
    return `http://localhost:8000/storage/${cleanPath}`;
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
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <div v-else-if="post" class="card border mx-auto post-details-card">
            <div class="card-header d-flex justify-content-between align-items-center py-3">
                <router-link :to="`/profile?user=${post.user?.username}`" class="d-flex align-items-center text-decoration-none">
                    <Avatar :src="post.user?.avatar_url" :size="40" />
                    <span class="ms-2 fw-semibold">{{ post.user?.username }}</span>
                </router-link>
                
                <button v-if="currentUser?.id === post.user?.id" 
                    @click="deletePost" 
                    class="btn btn-sm btn-outline-danger" 
                    :disabled="isDeletingPost">
                    <i class="bi bi-trash"></i> Apagar
                </button>
            </div>

            <div class="post-image-container d-flex justify-content-center align-items-center" @dblclick="handleLike">
                <img :src="formatImageUrl(post.image_url || post.image)" class="img-fluid post-image" :alt="post.caption">
            </div>

            <div class="card-body">
                <div class="d-flex gap-3 mb-3">
                    <i @click="handleLike" class="bi fs-3 cursor-pointer action-icon"
                        :class="[post.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                    <i class="bi bi-chat fs-3 action-icon"></i>
                    <i class="bi bi-send fs-3 action-icon"></i>
                </div>

                <div class="fw-bold mb-2">{{ post.likes_count || 0 }} curtidas</div>

                <div class="mb-3">
                    <router-link :to="`/profile?user=${post.user?.username}`" class="fw-semibold text-decoration-none me-2">
                        {{ post.user?.username }}
                    </router-link>
                    <span>{{ post.caption }}</span>
                </div>
                
                <div class="text-muted small mb-4 border-bottom pb-3">
                    {{ post.comments_count || 0 }} comentários
                </div>

                <div class="comments-section mb-3">
                    <PostCommentList
                        :comments="comments"
                        :current-user-id="currentUser?.id"
                        @delete-comment="deleteComment"
                    />

                    <button v-if="commentsPage < commentsLastPage" 
                        @click="loadMoreComments" 
                        class="btn btn-sm btn-link text-muted p-0 text-decoration-none mt-2"
                        :disabled="isLoadingComments">
                        <span v-if="isLoadingComments" class="spinner-border spinner-border-sm me-1" role="status"></span>
                        Carregar mais comentários
                    </button>
                </div>
            </div>

            <div class="card-footer p-0">
                <PostCommentForm v-model="newComment" @submit="submitComment" />
            </div>
        </div>

        <div v-else class="text-center py-5">
            <h4 class="text-muted">Post não encontrado</h4>
            <router-link to="/feed" class="btn btn-primary mt-3">Voltar ao Feed</router-link>
        </div>
    </div>
</template>

<style scoped>
.post-details-card {
    max-width: 600px;
    background-color: var(--bg-main);
    border-color: var(--border) !important;
}

.post-image-container {
    background-color: var(--bg-main);
    min-height: 300px;
    max-height: 600px;
    overflow: hidden;
}

.post-image {
    max-height: 600px;
    object-fit: contain;
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

.form-control:focus {
    box-shadow: none;
}
</style>
