<script setup>
import { onMounted } from 'vue';
import { useFeedStore } from '@/stores/feed';
import PostCard from '@/components/post/PostCard.vue';

const feedStore = useFeedStore();

onMounted(async () => {
    // Só busca se o feed estiver vazio ou para atualizar
    await feedStore.fetchFeed();
});
</script>

<template>
    <div class="feed-view container py-4">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">

                <div v-if="feedStore.isLoading" class="d-flex justify-content-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>

                <template v-else>
                    <div v-if="feedStore.feedPosts.length > 0">
                        <PostCard v-for="post in feedStore.feedPosts" :key="post.id" :post="post" />
                    </div>

                    <div v-else class="text-center py-5 bg-white border rounded">
                        <i class="bi bi-camera fs-1 text-muted"></i>
                        <h4 class="mt-3">Nenhuma publicação ainda</h4>
                        <p class="text-muted">Siga pessoas ou crie seu primeiro post!</p>
                        <router-link to="/criar" class="btn btn-primary btn-sm mt-2">
                            Criar minha primeira publicação
                        </router-link>
                    </div>
                </template>

            </div>
        </div>
    </div>
</template>

<style scoped>
.feed-view {
    max-width: 100%;
    overflow-x: hidden;
}
</style>