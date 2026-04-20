<script setup>
defineProps({
    size: { type: String, default: 'md' }, // sm, md, lg
    color: { type: String, default: 'currentColor' }
});
</script>

<template>
    <div class="spinner" :class="size" :style="{ borderTopColor: color }"></div>
</template>

<style scoped>
.spinner {
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.sm {
    width: 16px;
    height: 16px;
    border-width: 2px;
}

.md {
    width: 24px;
    height: 24px;
    border-width: 3px;
}

.lg {
    width: 40px;
    height: 40px;
    border-width: 4px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>