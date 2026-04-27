import { defineStore } from 'pinia';
import api from '../services/api';

export const useFollowsStore = defineStore('follows', {
    state: () => ({
        followingIds: new Set(),
        pendingIds: new Set(),
    }),

    actions: {
        async fetchFollowing(viewerId) {
            const { data } = await api.get(`/users/${viewerId}/following?per_page=100`);
            const following = data.data || data;
            this.followingIds = new Set(following.map((user) => user.id));
        },

        async follow(userId) {
            if (this.pendingIds.has(userId) || this.followingIds.has(userId)) return;

            this.pendingIds.add(userId);
            this.followingIds.add(userId);

            try {
                await api.post(`/users/${userId}/follow`);
            } catch (error) {
                this.followingIds.delete(userId);
                throw error;
            } finally {
                this.pendingIds.delete(userId);
            }
        },

        async unfollow(userId) {
            if (this.pendingIds.has(userId) || !this.followingIds.has(userId)) return;

            this.pendingIds.add(userId);
            this.followingIds.delete(userId);

            try {
                await api.delete(`/users/${userId}/unfollow`);
            } catch (error) {
                this.followingIds.add(userId);
                throw error;
            } finally {
                this.pendingIds.delete(userId);
            }
        },

        async toggleFollow(userId) {
            if (this.followingIds.has(userId)) {
                await this.unfollow(userId);
                return;
            }

            await this.follow(userId);
        },
    },
});
