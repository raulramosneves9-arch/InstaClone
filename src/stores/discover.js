import { defineStore } from 'pinia';
import api from '../services/api';

export const useDiscoverStore = defineStore('discover', {
    state: () => ({
        suggestions: [],
        followingIds: new Set(),
        currentPage: 1,
        lastPage: 1,
        isLoading: false,
    }),

    actions: {
        async fetchSuggestions(page = 1) {
            this.isLoading = true;
            try {
                const { data } = await api.get(`/users/suggestions?page=${page}`);
                const users = data.data || data;
                this.suggestions = users;
                
                this.currentPage = data.current_page || page;
                this.lastPage = data.last_page || 1;
            } catch (error) {
                console.error("Erro ao carregar sugestões:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchFollowing(viewerId) {
            try {
                const { data } = await api.get(`/users/${viewerId}/following?per_page=100`);
                const following = data.data || data;
                
                const ids = following.map(user => user.id);
                this.followingIds = new Set(ids);
            } catch (error) {
                console.error("Erro ao carregar following:", error);
            }
        },

        async toggleFollow(userId) {
            const isFollowing = this.followingIds.has(userId);
            
            // Optimistic update
            if (isFollowing) {
                this.followingIds.delete(userId);
            } else {
                this.followingIds.add(userId);
            }

            try {
                if (isFollowing) {
                    await api.delete(`/users/${userId}/unfollow`);
                } else {
                    await api.post(`/users/${userId}/follow`);
                }
            } catch (error) {
                // Revert on error
                if (isFollowing) {
                    this.followingIds.add(userId);
                } else {
                    this.followingIds.delete(userId);
                }
                console.error("Erro ao alterar follow:", error);
            }
        }
    }
});
