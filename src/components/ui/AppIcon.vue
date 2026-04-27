<script setup>
import { computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    filled: {
        type: Boolean,
        default: false,
    },
    sizeClass: {
        type: String,
        default: 'fs-4',
    },
});

const iconClass = computed(() => {
    const iconMap = {
        home: {
            outline: 'bi-house-door',
            filled: 'bi-house-door-fill',
        },
        search: {
            outline: 'bi-search',
            filled: 'bi-search',
        },
        reels: {
            outline: 'bi-play-btn',
            filled: 'bi-play-btn-fill',
        },
        messages: {
            outline: 'bi-chat-dots',
            filled: 'bi-chat-dots-fill',
        },
        explore: {
            outline: 'bi-compass',
            filled: 'bi-compass-fill',
        },
        notifications: {
            outline: 'bi-heart',
            filled: 'bi-heart-fill',
        },
        create: {
            outline: 'bi-plus-square',
            filled: 'bi-plus-square-fill',
        },
        dashboard: {
            outline: 'bi-graph-up',
            filled: 'bi-graph-up-fill',
        },
        profile: {
            outline: 'bi-person-circle',
            filled: 'bi-person-circle',
        },
        more: {
            outline: 'bi-list',
            filled: 'bi-list',
        },
        meta: {
            outline: 'bi-infinity',
            filled: 'bi-infinity',
        },
        instagram: {
            outline: 'bi-instagram',
            filled: 'bi-instagram',
        },
        settings: {
            outline: 'bi-gear-wide',
            filled: 'bi-gear-wide',
        },
        posts: {
            outline: 'bi-grid-3x3',
            filled: 'bi-grid-3x3',
        },
        saved: {
            outline: 'bi-bookmark',
            filled: 'bi-bookmark-fill',
        },
        tagged: {
            outline: 'bi-person-square',
            filled: 'bi-person-square',
        },
    };

    const config = iconMap[props.name];
    if (!config) {
        return `bi bi-question-circle ${props.sizeClass}`;
    }

    const iconName = props.filled ? config.filled : config.outline;
    return `bi ${iconName} ${props.sizeClass}`;
});
</script>

<template>
    <i :class="iconClass" aria-hidden="true"></i>
</template>
