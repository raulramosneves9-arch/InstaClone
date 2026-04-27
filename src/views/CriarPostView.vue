<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';
import { useImageUpload } from '@/composables/useImageUpload';
import Spinner from '@/components/ui/Spinner.vue';

const feedStore = useFeedStore();
const router = useRouter();

const caption = ref('');
const loading = ref(false);
const errorMsg = ref('');

const { imageFile, imagePreview, uploadError, handleFileChange, clearImage } = useImageUpload();

const handleSubmit = async () => {
    if (!imageFile.value || !caption.value.trim()) {
        errorMsg.value = "Imagem e legenda são obrigatórias!";
        return;
    }

    if (caption.value.length > 2200) {
        errorMsg.value = "A legenda deve ter no máximo 2200 caracteres.";
        return;
    }

    loading.value = true;
    errorMsg.value = '';
    const formData = new FormData();
    formData.append('image', imageFile.value);
    formData.append('caption', caption.value);

    try {
        await feedStore.createPost(formData);
        router.push('/feed'); // Volta para o feed após postar
    } catch (err) {
        errorMsg.value = err;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="container py-5 mt-5 mt-md-0">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card shadow-sm border-0">
                    <div class="card-header border-bottom py-3">
                        <h5 class="mb-0 text-center fw-bold">Criar nova publicação</h5>
                    </div>

                    <div class="card-body p-4 text-center">
                        <div v-if="!imagePreview"
                            class="upload-placeholder border rounded p-5 mb-3 d-flex flex-column align-items-center">
                            <i class="bi bi-images display-4 text-muted mb-3"></i>
                            <p class="text-muted">Selecione fotos aqui</p>
                            <label class="btn btn-primary btn-sm fw-bold">
                                Selecionar do computador
                                <input type="file" class="d-none" accept="image/jpeg, image/jpg, image/png, image/webp" @change="handleFileChange">
                            </label>
                        </div>

                        <div v-else class="mb-3">
                            <img :src="imagePreview" class="img-fluid rounded border mb-3 preview-image" style="max-height: 400px;">
                            <button class="btn btn-outline-danger btn-sm d-block mx-auto"
                                @click="clearImage">Trocar imagem</button>
                        </div>

                        <div class="mt-4 text-start">
                            <div class="d-flex justify-content-between align-items-center">
                                <label class="form-label small fw-bold">Legenda</label>
                                <small :class="{'text-danger': caption.length > 2200, 'text-muted': caption.length <= 2200}">
                                    {{ caption.length }} / 2200
                                </small>
                            </div>
                            <textarea v-model="caption" class="form-control border-0" rows="3"
                                placeholder="Escreva uma legenda..."></textarea>
                        </div>

                        <button @click="handleSubmit" class="btn btn-primary w-100 mt-4 fw-bold"
                            :disabled="loading || !imageFile || !caption.trim() || caption.length > 2200">
                            <Spinner v-if="loading" />
                            <span v-else>Compartilhar</span>
                        </button>

                        <div v-if="errorMsg || uploadError" class="text-danger small mt-2">{{ errorMsg || uploadError }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.upload-placeholder {
    border-style: dashed !important;
    border-width: 2px !important;
    background-color: var(--bg-secondary);
    border-color: var(--border) !important;
}

.card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border) !important;
}

.preview-image {
    border-color: var(--border) !important;
}
</style>