<script setup>
/**
 * Substitui o ConfirmModal.vue manual por uma estrutura 
 * compatível com os Modais do Bootstrap.
 */
defineProps({
    id: { type: String, required: true },
    title: String,
    showFooter: { type: Boolean, default: true }
});

defineEmits(['confirm']);
</script>

<template>
    <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot />
                </div>
                <div class="modal-footer border-0 pt-0" v-if="showFooter">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" @click="$emit('confirm')">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
</template>