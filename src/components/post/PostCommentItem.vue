<script setup>
import { computed } from 'vue';

const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
    currentUserId: {
        type: [Number, String, null],
        default: null,
    },
});

const emit = defineEmits(['delete']);

const canDelete = computed(() => props.currentUserId === props.comment?.user?.id);
const commentContent = computed(() => props.comment?.content ?? props.comment?.body ?? '');

const handleDelete = () => {
    emit('delete');
};
</script>

<template>
    <div class="d-flex justify-content-between mb-2">
        <div>
            <router-link :to="`/profile?user=${comment.user?.username}`" class="fw-bold text-dark text-decoration-none me-2 small">
                {{ comment.user?.username }}
            </router-link>
            <span class="small">{{ commentContent }}</span>
        </div>
        <button
            v-if="canDelete"
            @click="handleDelete"
            class="btn btn-link text-danger p-0 border-0 btn-sm text-decoration-none ms-2"
        >
            <i class="bi bi-x"></i>
        </button>
    </div>
</template>
