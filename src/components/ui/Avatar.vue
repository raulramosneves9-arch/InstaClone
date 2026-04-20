<script setup>
import { ref } from 'vue';

const props = defineProps({
    src: String,
    username: { type: String, default: 'U' },
    size: { type: String, default: 'md' } // sm (32px), md (44px), lg (80px)
});

const hasError = ref(false);

const getInitial = () => props.username.charAt(0).toUpperCase();
</script>

<template>
    <div class="avatar" :class="size">
        <img v-if="src && !hasError" :src="src" :alt="username" @error="hasError = true" />
        <div v-else class="avatar-fallback">
            {{ getInitial() }}
        </div>
    </div>
</template>

<style scoped>
.avatar {
    border-radius: var(--radius-full);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-border);
    flex-shrink: 0;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-fallback {
    font-weight: bold;
    color: white;
    background: linear-gradient(45deg, var(--color-gradient-start), var(--color-gradient-end));
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sm {
    width: 32px;
    height: 32px;
    font-size: 12px;
}

.md {
    width: 44px;
    height: 44px;
    font-size: 16px;
}

.lg {
    width: 80px;
    height: 80px;
    font-size: 32px;
}
</style>