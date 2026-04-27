<script setup>
import { computed } from 'vue';

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    isFollowing: {
        type: Boolean,
        default: false,
    },
    isPending: {
        type: Boolean,
        default: false,
    },
    showFollowButton: {
        type: Boolean,
        default: true,
    },
    compact: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['click', 'toggle-follow']);

const avatarUrl = computed(() =>
    props.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user.name)}&background=random`
);
</script>

<template>
    <div
        class="account-card d-flex align-items-center gap-3 p-3"
        :class="{ 'compact': compact }"
        @click="emit('click', user)"
    >
        <img
            :src="avatarUrl"
            class="rounded-circle border"
            :style="compact ? 'width: 44px; height: 44px; object-fit: cover;' : 'width: 56px; height: 56px; object-fit: cover;'"
            alt="Avatar"
        >
        <div class="flex-grow-1 min-w-0">
            <h5 class="account-name mb-0 text-truncate fw-semibold">{{ user.name }}</h5>
            <p class="account-username text-muted small mb-0">@{{ user.username }}</p>
        </div>

        <button
            v-if="showFollowButton"
            class="btn-sm"
            :class="isFollowing ? 'btn-ig-ghost' : 'btn-ig'"
            :disabled="isPending"
            @click.stop="emit('toggle-follow', user)"
        >
            {{ isFollowing ? 'Seguindo' : 'Seguir' }}
        </button>
    </div>
</template>

<style scoped>
.account-card {
    background-color: var(--bg-main);
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.1s ease;
}

.account-card:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.account-name {
    color: var(--text-primary);
    font-size: 0.875rem;
}

.account-username {
    font-size: 0.875rem;
}

.compact {
    padding: 8px 16px;
}
</style>
