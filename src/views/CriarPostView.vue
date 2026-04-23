<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';
import Spinner from '@/components/ui/Spinner.vue';

const feedStore = useFeedStore();
const router = useRouter();

const caption = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);
const loading = ref(false);
const errorMsg = ref('');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const clearImage = () => {
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
    imageFile.value = null;
    imagePreview.value = null;
    errorMsg.value = '';
};

onUnmounted(() => {
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
});

const handleFileChange = (e) => {
    const file = e.target.files[0];
    errorMsg.value = '';

    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            errorMsg.value = "A imagem deve ter no máximo 5 MB.";
            // Limpa o input se necessário para permitir selecionar a mesma imagem se o erro for ignorado, mas como limpamos as refs está tudo bem.
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            errorMsg.value = "Formato inválido. Use JPEG, PNG ou WEBP.";
            return;
        }

        clearImage(); // Revogar a anterior se existir
        
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

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
                    <div class="card-header bg-white border-bottom py-3">
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
                            <img :src="imagePreview" class="img-fluid rounded border mb-3" style="max-height: 400px;">
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
                            <textarea v-model="caption" class="form-control bg-light border-0" rows="3"
                                placeholder="Escreva uma legenda..."></textarea>
                        </div>

                        <button @click="handleSubmit" class="btn btn-primary w-100 mt-4 fw-bold"
                            :disabled="loading || !imageFile || !caption.trim() || caption.length > 2200">
                            <Spinner v-if="loading" />
                            <span v-else>Compartilhar</span>
                        </button>

                        <div v-if="errorMsg" class="text-danger small mt-2">{{ errorMsg }}</div>
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
}
</style>