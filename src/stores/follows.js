import { defineStore } from 'pinia';
import api from '../services/api';

export const useFollowsStore = defineStore('follows', {
    state: () => ({
        followingIds: new Set(),
        followingUsers: [],
        pendingIds: new Set(),
    }),

    actions: {
        async fetchFollowing(viewerId) {
            const { data } = await api.get(`/users/${viewerId}/following?per_page=100`);
            const following = data.data || data;
            this.followingUsers = following;
            this.followingIds = new Set(following.map((user) => user.id));
        },

        async follow(userId) {
            if (this.pendingIds.has(userId) || this.followingIds.has(userId)) return;

            this.pendingIds.add(userId);
            this.followingIds.add(userId);

            try {
                const { data } = await api.post(`/users/${userId}/follow`);
                // Se a API retornar o usuário, adicionamos à lista
                if (data && data.user) {
                    this.followingUsers.push(data.user);
                } else {
                    // Fallback: se não retornar, talvez devêssemos recarregar ou apenas ignorar se for só para o feed
                }
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
            this.followingUsers = this.followingUsers.filter(u => u.id !== userId);

            try {
                await api.delete(`/users/${userId}/unfollow`);
            } catch (error) {
                this.followingIds.add(userId);
                // Aqui seria ideal recuperar o usuário, mas vamos deixar assim por enquanto
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
