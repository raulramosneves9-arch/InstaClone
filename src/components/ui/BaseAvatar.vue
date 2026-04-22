<script setup>
/**
 * Substitui o antigo Avatar.vue.
 * Usa classes nativas do Bootstrap para o círculo e bordas.
 */
defineProps({
    src: String,
    size: { type: Number, default: 32 },
    alt: { type: String, default: 'Usuário' }
});
</script>

<template>
    <div class="avatar-wrapper d-inline-block rounded-circle overflow-hidden border bg-light"
        :style="{ width: size + 'px', height: size + 'px' }">
        <img v-if="src" :src="src" :alt="alt" class="w-100 h-100 object-fit-cover" />
        <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center">
            <span class="text-secondary fw-bold" :style="{ fontSize: (size / 2.5) + 'px' }">
                {{ alt.charAt(0).toUpperCase() }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.avatar-wrapper {
    flex-shrink: 0;
}
</style>