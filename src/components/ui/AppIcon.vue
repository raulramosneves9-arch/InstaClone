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
        create: {
            outline: 'bi-plus-square',
            filled: 'bi-plus-square-fill',
        },
        profile: {
            outline: 'bi-person-circle',
            filled: 'bi-person-circle',
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
