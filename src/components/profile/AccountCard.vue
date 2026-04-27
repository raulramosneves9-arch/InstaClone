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
        class="card border cursor-pointer rounded-3 account-card"
        :class="compact ? 'account-card-compact' : 'h-100 text-center'"
        @click="emit('click', user)"
    >
        <div class="card-body" :class="compact ? 'd-flex align-items-center gap-3' : 'd-flex flex-column align-items-center'">
            <img
                :src="avatarUrl"
                class="rounded-circle border"
                :class="compact ? '' : 'mb-3'"
                :style="compact ? 'width: 56px; height: 56px; object-fit: cover;' : 'width: 80px; height: 80px; object-fit: cover;'"
                alt="Avatar"
            >
            <div :class="compact ? 'flex-grow-1 min-w-0' : 'w-100'">
                <h5 class="card-title mb-0 text-truncate w-100 fw-semibold">{{ user.name }}</h5>
                <p class="card-text text-muted small mb-0" :class="compact ? '' : 'mb-3'">@{{ user.username }}</p>
            </div>

            <button
                v-if="showFollowButton"
                class="btn btn-sm"
                :class="[isFollowing ? 'btn-outline-secondary' : 'btn-primary', compact ? 'ms-auto' : 'mt-auto']"
                :disabled="isPending"
                @click.stop="emit('toggle-follow', user)"
            >
                {{ isFollowing ? 'Seguindo' : 'Seguir' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
}

.cursor-pointer:hover {
    opacity: 0.85;
}

.account-card-compact.cursor-pointer:hover {
    opacity: 0.92;
}

.account-card {
    background-color: var(--bg-secondary);
    border-color: var(--border) !important;
}

.card-title {
    color: var(--text-primary);
}
</style>
