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
    variant: {
        type: String,
        default: 'list', // 'list', 'grid', 'sidebar'
        validator: (value) => ['list', 'grid', 'sidebar'].includes(value)
    },
    actionText: {
        type: String,
        default: ''
    },
    avatarSize: {
        type: Number,
        default: 44
    }
});

const emit = defineEmits(['click', 'toggle-follow', 'action-click']);

const avatarUrl = computed(() =>
    props.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user.name)}&background=random`
);

const cardClasses = computed(() => ({
    'account-card': true,
    'd-flex': true,
    'align-items-center': props.variant !== 'grid',
    'flex-column': props.variant === 'grid',
    'justify-content-center': props.variant === 'grid',
    'text-center': props.variant === 'grid',
    'gap-3': props.variant === 'list',
    'gap-2': props.variant === 'grid' || props.variant === 'sidebar',
    'p-3': props.variant !== 'sidebar',
    'compact': props.compact,
    'grid-variant': props.variant === 'grid',
    'sidebar-variant': props.variant === 'sidebar'
}));
</script>

<template>
    <div
        :class="cardClasses"
        @click="emit('click', user)"
    >
        <div class="avatar-container">
            <img
                :src="avatarUrl"
                class="rounded-circle border"
                :style="variant === 'grid' ? 'width: 88px; height: 88px;' : `width: ${avatarSize}px; height: ${avatarSize}px;`"
                style="object-fit: cover;"
                alt="Avatar"
            >
        </div>
        
        <div class="account-info flex-grow-1 min-w-0" :class="{ 'w-100': variant === 'grid', 'ms-2': variant === 'sidebar' }">
            <h5 class="account-username mb-0 text-truncate fw-semibold">
                {{ user.username }}
            </h5>
            <p class="account-name text-muted small mb-0 text-truncate">
                {{ user.name }}
            </p>
        </div>

        <div v-if="actionText" class="action-container ms-auto">
            <button class="btn-action-link" @click.stop="emit('action-click', user)">
                {{ actionText }}
            </button>
        </div>

        <button
            v-else-if="showFollowButton"
            class="mt-1"
            :class="[
                variant === 'sidebar' ? 'btn-action-link ms-auto' : (isFollowing ? 'btn-ig-ghost btn-sm' : 'btn-ig btn-sm'),
                { 'w-100': variant === 'grid' }
            ]"
            :disabled="isPending"
            @click.stop="emit('toggle-follow', user)"
        >
            {{ isFollowing ? 'Seguindo' : 'Seguir' }}
        </button>
    </div>
</template>

<style scoped>
.account-card {
    background-color: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
}

.account-card:not(.sidebar-variant):hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.grid-variant {
    background-color: var(--bg-main);
    border: 1px solid var(--border);
    padding: 24px 16px !important;
}

.grid-variant:hover {
    border-color: #363636;
}

.sidebar-variant {
    padding: 8px 0 !important;
}

.account-username {
    color: var(--text-primary);
    font-size: 0.875rem;
}

.account-name {
    font-size: 0.875rem;
    color: var(--text-secondary) !important;
}

.compact {
    padding: 8px 16px;
}

.avatar-container {
    flex-shrink: 0;
}

.btn-action-link {
    background: none;
    border: none;
    color: #0095f6;
    font-size: 12px;
    font-weight: 600;
    padding: 0;
    cursor: pointer;
}

.btn-action-link:hover {
    color: #ffffff;
}

.ms-2 {
    margin-left: 8px !important;
}
</style>
