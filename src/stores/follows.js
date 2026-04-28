import { defineStore } from 'pinia';
import api from '../services/api';

export const useFollowsStore = defineStore('follows', {
    state: () => ({
        followingIds: new Set(),
        followingUsers: [],
        pendingIds: new Set(),
    }),

    actions: {
        // Carrega lista de usuários seguidos e atualiza tanto Set quanto Array
        async fetchFollowing(viewerId) {
            const { data } = await api.get(`/users/${viewerId}/following?per_page=100`);
            const following = data.data || data;
            this.followingUsers = following;
            this.followingIds = new Set(following.map((user) => user.id));
        },

        // Adiciona usuário aos seguidos de forma otimista, depois confirma com API
        async follow(userId) {
            if (this.pendingIds.has(userId) || this.followingIds.has(userId)) return;

            this.pendingIds.add(userId);
            this.followingIds.add(userId); // Atualização otimista

            try {
                const { data } = await api.post(`/users/${userId}/follow`);
                // Adiciona objeto do usuário ao array se API retornar
                if (data && data.user) {
                    this.followingUsers.push(data.user);
                }
            } catch (error) {
                this.followingIds.delete(userId); // Reverte em caso de erro
                throw error;
            } finally {
                this.pendingIds.delete(userId);
            }
        },

        // Remove usuário dos seguidos de forma otimista, depois confirma com API
        async unfollow(userId) {
            if (this.pendingIds.has(userId) || !this.followingIds.has(userId)) return;

            this.pendingIds.add(userId);
            this.followingIds.delete(userId); // Atualização otimista
            this.followingUsers = this.followingUsers.filter(u => u.id !== userId);

            try {
                await api.delete(`/users/${userId}/unfollow`);
            } catch (error) {
                this.followingIds.add(userId); // Reverte em caso de erro
                throw error;
            } finally {
                this.pendingIds.delete(userId);
            }
        },

        // Alterna seguir/deixar de seguir baseado no estado atual
        async toggleFollow(userId) {
            if (this.followingIds.has(userId)) {
                await this.unfollow(userId);
                return;
            }

            await this.follow(userId);
        },
    },
});
