<script setup>
defineProps(['title', 'message', 'confirmLabel', 'cancelLabel']);
defineEmits(['confirm', 'cancel']);
</script>

<template>
    <div class="modal-overlay" @click.self="$emit('cancel')">
        <div class="modal-content">
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <div class="modal-actions">
                <button class="btn-confirm" @click="$emit('confirm')">
                    {{ confirmLabel || 'Confirmar' }}
                </button>
                <button class="btn-cancel" @click="$emit('cancel')">
                    {{ cancelLabel || 'Cancelar' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: var(--color-surface);
    padding: 24px;
    border-radius: var(--radius-md);
    max-width: 300px;
    text-align: center;
}

.modal-actions {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    gap: 10px;
}

.btn-confirm {
    color: var(--color-danger);
    font-weight: bold;
}

.btn-cancel {
    color: var(--color-text);
}
</style>