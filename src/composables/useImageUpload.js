import { ref, onUnmounted } from 'vue';

const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function useImageUpload(options = {}) {
    const {
        maxFileSize = 5 * 1024 * 1024,
        allowedTypes = DEFAULT_ALLOWED_TYPES,
        sizeErrorMessage = 'A imagem deve ter no máximo 5 MB.',
        typeErrorMessage = 'Formato inválido. Use JPEG, PNG ou WEBP.'
    } = options;

    const imageFile = ref(null);
    const imagePreview = ref(null);
    const uploadError = ref('');

    const revokePreview = () => {
        if (imagePreview.value) {
            URL.revokeObjectURL(imagePreview.value);
        }
    };

    const clearImage = () => {
        revokePreview();
        imageFile.value = null;
        imagePreview.value = null;
        uploadError.value = '';
    };

    const handleFileChange = (event) => {
        const file = event?.target?.files?.[0];
        uploadError.value = '';

        if (!file) {
            return;
        }

        if (file.size > maxFileSize) {
            uploadError.value = sizeErrorMessage;
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            uploadError.value = typeErrorMessage;
            return;
        }

        clearImage();
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    };

    onUnmounted(() => {
        revokePreview();
    });

    return {
        imageFile,
        imagePreview,
        uploadError,
        clearImage,
        handleFileChange
    };
}
