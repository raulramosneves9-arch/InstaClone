import { defineStore } from 'pinia';
import { MOCK_POSTS } from '../data/mockData';

export const useFeedStore = defineStore('feed', {
    state: () => ({
        posts: []
    }),

    actions: {
        init() {
            const savedPosts = localStorage.getItem('local_posts');
            // Semeia com MOCK_POSTS se o localStorage estiver vazio
            this.posts = savedPosts ? JSON.parse(savedPosts) : MOCK_POSTS;

            if (!savedPosts) {
                this.persistPosts();
            }
        },

        persistPosts() {
            localStorage.setItem('local_posts', JSON.stringify(this.posts));
        },

        getPaginatedFeed(page, perPage = 5) {
            // Ordena por data (mais recentes primeiro)
            const sorted = [...this.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const start = (page - 1) * perPage;
            const end = start + perPage;

            return {
                data: sorted.slice(start, end),
                hasMore: end < sorted.length
            };
        },

        toggleLike(postId, userId) {
            const post = this.posts.find(p => p.id === postId);
            if (!post) return;

            const index = post.likedBy.indexOf(userId);
            if (index === -1) {
                post.likedBy.push(userId);
                post.likesCount++;
            } else {
                post.likedBy.splice(index, 1);
                post.likesCount--;
            }
            this.persistPosts();
        },

        addComment(postId, text, user) {
            const post = this.posts.find(p => p.id === postId);
            if (!post) return;

            const newComment = {
                id: Date.now(),
                userId: user.id,
                username: user.username,
                text,
                createdAt: new Date().toISOString()
            };

            post.comments.push(newComment);
            this.persistPosts();
        },

        createPost(user, imageBase64, caption, location) {
            const newPost = {
                id: Date.now(),
                authorId: user.id,
                username: user.username,
                userAvatar: user.avatar,
                imageUrl: imageBase64,
                caption,
                location,
                likesCount: 0,
                likedBy: [],
                createdAt: new Date().toISOString(),
                comments: []
            };

            this.posts.unshift(newPost);
            this.persistPosts();
        }
    }
});