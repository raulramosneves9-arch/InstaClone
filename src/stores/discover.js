import { defineStore } from 'pinia';
import api from '../services/api';

export const useDiscoverStore = defineStore('discover', {
    state: () => ({
        suggestions: [],
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
    }
});
