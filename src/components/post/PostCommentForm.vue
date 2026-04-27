<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const isSubmitDisabled = computed(() => props.disabled || !props.modelValue.trim());

const handleInput = (event) => {
    emit('update:modelValue', event.target.value);
};

const handleSubmit = () => {
    emit('submit');
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="d-flex align-items-center p-3 comment-form">
        <input
            :value="modelValue"
            @input="handleInput"
            type="text"
            class="form-control border-0 shadow-none ps-0"
            placeholder="Adicione um comentário..."
        >
        <button
            type="submit"
            class="btn btn-link text-primary fw-bold text-decoration-none px-2"
            :disabled="isSubmitDisabled"
        >
            Publicar
        </button>
    </form>
</template>

<style scoped>
.comment-form {
    border-top: 1px solid var(--border);
}
</style>
