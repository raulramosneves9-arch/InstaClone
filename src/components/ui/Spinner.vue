<script setup>
/**
 * Substitui a necessidade de um Spinner.vue isolado para botões.
 * Já inclui o estado de 'loading' do Bootstrap.
 */
defineProps({
    loading: Boolean,
    variant: { type: String, default: 'primary' },
    type: { type: String, default: 'button' },
    disabled: Boolean,
    outline: Boolean
});
</script>

<template>
    <button :type="type" class="btn d-flex align-items-center justify-content-center fw-bold"
        :class="[outline ? `btn-outline-${variant}` : `btn-${variant}`, 'w-100']" :disabled="loading || disabled">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <slot v-else />
        <span v-if="loading">Carregando...</span>
    </button>
</template>