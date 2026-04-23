<script setup>
import { ref } from 'vue';
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

// Função para processar a imagem selecionada
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const handleSubmit = async () => {
    if (!imageFile.value) {
        errorMsg.value = "Selecione uma imagem primeiro!";
        return;
    }

    loading.value = true;
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
                                <input type="file" class="d-none" accept="image/*" @change="handleFileChange">
                            </label>
                        </div>

                        <div v-else class="mb-3">
                            <img :src="imagePreview" class="img-fluid rounded border mb-3" style="max-height: 400px;">
                            <button class="btn btn-outline-danger btn-sm d-block mx-auto"
                                @click="imagePreview = null">Trocar imagem</button>
                        </div>

                        <div class="mt-4 text-start">
                            <label class="form-label small fw-bold">Legenda</label>
                            <textarea v-model="caption" class="form-control bg-light border-0" rows="3"
                                placeholder="Escreva uma legenda..."></textarea>
                        </div>

                        <button @click="handleSubmit" class="btn btn-primary w-100 mt-4 fw-bold"
                            :disabled="loading || !imageFile">
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