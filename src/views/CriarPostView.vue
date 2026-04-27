<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';
import { useImageUpload } from '@/composables/useImageUpload';
import { useAuthStore } from '@/stores/auth';
import Spinner from '@/components/ui/Spinner.vue';
import Avatar from '@/components/ui/Avatar.vue';

const authStore = useAuthStore();
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
        router.push('/feed');
    } catch (err) {
        errorMsg.value = err;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="create-post-wrapper d-flex align-items-center justify-content-center py-4 px-2">
        <div class="create-post-container mx-auto">
            <!-- Header -->
            <div class="create-post-header d-flex align-items-center justify-content-between border-bottom px-3">
                <div class="header-action-left">
                    <button v-if="imagePreview" @click="clearImage" class="btn-back" title="Voltar">
                        <i class="bi bi-arrow-left fs-4"></i>
                    </button>
                </div>
                <h5 class="mb-0 fw-bold">Criar nova publicação</h5>
                <div class="header-action-right">
                    <button @click="handleSubmit" class="btn-share fw-bold"
                        :disabled="loading || !imageFile || !caption.trim() || caption.length > 2200">
                        {{ loading ? '...' : 'Compartilhar' }}
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="create-post-content d-flex flex-column flex-md-row">
                <!-- Image Side -->
                <div class="create-post-image-side d-flex align-items-center justify-content-center">
                    <div v-if="!imagePreview" class="upload-placeholder p-4 text-center">
                        <div class="icon-wrapper mb-3">
                            <svg aria-label="Ícone representativo de mídia, como imagens ou vídeos" color="currentColor" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c.1 0 .2.1.2.1l11.9 11.9c.1.1.1.2.1.3v27.3c0 .1-.1.2-.1.3l-11.9 11.9c-.1.1-.2.1-.3.1h-.3c-.1 0-.2-.1-.2-.1l-11.9-11.9c-.1-.1-.1-.2-.1-.3V36.2c0-.1.1-.2.1-.3l11.9-11.9c.1-.1.2-.1.3-.1zm65.2 0h.3c.1 0 .2.1.2.1l11.9 11.9c.1.1.1.2.1.3v27.3c0 .1-.1.2-.1.3l-11.9 11.9c-.1.1-.2.1-.3.1h-.3c-.1 0-.2-.1-.2-.1l-11.9-11.9c-.1-.1-.1-.2-.1-.3V36.2c0-.1.1-.2.1-.3l11.9-11.9c.1-.1.2-.1.3-.1zm-32.5 0h.3c.1 0 .2.1.2.1l11.9 11.9c.1.1.1.2.1.3v27.3c0 .1-.1.2-.1.3l-11.9 11.9c-.1.1-.2.1-.3.1h-.3c-.1 0-.2-.1-.2-.1l-11.9-11.9c-.1-.1-.1-.2-.1-.3V36.2c0-.1.1-.2.1-.3l11.9-11.9c.1-.1.2-.1.3-.1z"></path></svg>
                        </div>
                        <h4 class="mb-4">Arraste as fotos e os vídeos aqui</h4>
                        <label class="btn-ig py-2 px-3">
                            Selecionar do computador
                            <input type="file" class="d-none" accept="image/jpeg, image/jpg, image/png, image/webp"
                                @change="handleFileChange">
                        </label>
                    </div>
                    <div v-else class="preview-wrapper">
                        <img :src="imagePreview" class="preview-image animate-fade-in" alt="Preview">
                    </div>
                </div>

                <!-- Info Side -->
                <div class="create-post-info-side d-flex flex-column">
                    <div class="user-header p-3 d-flex align-items-center gap-3">
                        <Avatar :src="authStore.user?.avatar_url" :size="28" />
                        <span class="fw-bold fs-6">{{ authStore.user?.username }}</span>
                    </div>

                    <div class="textarea-container flex-grow-1 px-3">
                        <textarea v-model="caption" class="ig-textarea" 
                            placeholder="Escreva uma legenda..."
                            maxlength="2200"></textarea>
                    </div>

                    <div class="footer-meta p-3 border-top mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button class="btn-icon-secondary">
                                <i class="bi bi-emoji-smile"></i>
                            </button>
                            <span class="text-muted small-text">{{ caption.length.toLocaleString() }} / 2,200</span>
                        </div>
                        
                        <div v-if="errorMsg || uploadError" class="error-toast animate-slide-up">
                            <i class="bi bi-exclamation-circle-fill me-2"></i>
                            {{ errorMsg || uploadError }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Fullscreen Loading Overlay -->
        <div v-if="loading" class="loading-overlay animate-fade-in">
            <Spinner size="lg" />
            <p class="mt-3 fw-medium">Compartilhando...</p>
        </div>
    </div>
</template>

<style scoped>
.create-post-wrapper {
    min-height: calc(100vh - 100px);
}

.create-post-container {
    width: 100%;
    max-width: 900px; /* Increased for better desktop experience */
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
}

.create-post-header {
    height: 48px;
    background-color: var(--bg-secondary);
    z-index: 10;
}

.create-post-header h5 {
    font-size: 1rem;
    color: var(--text-primary);
}

.btn-back {
    color: var(--text-primary);
    padding: 4px;
    transition: transform 0.2s;
}

.btn-back:hover {
    transform: translateX(-2px);
}

.btn-share {
    color: var(--accent);
    background: none;
    border: none;
    font-size: 0.875rem;
    transition: opacity 0.2s;
}

.btn-share:hover:not(:disabled) {
    color: #fff;
}

.btn-share:disabled {
    opacity: 0.3;
    cursor: default;
}

.create-post-content {
    height: 600px; /* Fixed height for consistent look */
}

@media (max-width: 768px) {
    .create-post-content {
        height: auto;
    }
    .create-post-image-side {
        aspect-ratio: 1/1;
    }
}

.create-post-image-side {
    flex: 1 1 60%;
    background-color: #000;
    border-right: 1px solid var(--border);
    overflow: hidden;
}

.upload-placeholder {
    color: var(--text-primary);
}

.upload-placeholder h4 {
    font-weight: 300;
    font-size: 1.3rem;
}

.icon-wrapper {
    opacity: 0.8;
}

.preview-wrapper {
    width: 100%;
    height: 100%;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.create-post-info-side {
    flex: 0 0 40%;
    background-color: var(--bg-secondary);
    min-width: 340px;
}

.ig-textarea {
    width: 100%;
    height: 100%;
    min-height: 150px;
    background: transparent;
    border: none;
    color: var(--text-primary);
    resize: none;
    font-size: 1rem;
    outline: none;
    padding: 0;
}

.btn-icon-secondary {
    color: var(--text-secondary);
    font-size: 1.25rem;
    padding: 0;
    transition: color 0.2s;
}

.btn-icon-secondary:hover {
    color: var(--text-primary);
}

.small-text {
    font-size: 0.75rem;
    letter-spacing: 0.5px;
}

.error-toast {
    background-color: rgba(237, 73, 86, 0.15);
    color: var(--danger);
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.8125rem;
    margin-top: 10px;
    border: 1px solid rgba(237, 73, 86, 0.2);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Animations */
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

.animate-slide-up {
    animation: slideUp 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
</style>