<script setup>
import PostCommentItem from './PostCommentItem.vue';

defineProps({
    comments: {
        type: Array,
        default: () => [],
    },
    currentUserId: {
        type: [Number, String, null],
        default: null,
    },
});

const emit = defineEmits(['delete-comment']);

const handleDelete = (commentId, index) => {
    emit('delete-comment', commentId, index);
};
</script>

<template>
    <div>
        <PostCommentItem
            v-for="(comment, index) in comments"
            :key="comment.id"
            :comment="comment"
            :current-user-id="currentUserId"
            @delete="handleDelete(comment.id, index)"
        />
    </div>
</template>
