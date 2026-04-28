import { defineStore } from 'pinia';
import api from '../services/api';

export const useDiscoverStore = defineStore('discover', {
    state: () => ({
        suggestions: [],
        searchResults: [],
        searchQuery: '',
        currentPage: 1,
        lastPage: 1,
        isLoading: false,
    }),

    actions: {
        async fetchSuggestions(page = 1) {
            this.isLoading = true;
            this.searchQuery = '';
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

        async searchUsers(query, page = 1) {
            if (!query) {
                this.searchResults = [];
                return;
            }
            this.isLoading = true;
            this.searchQuery = query;
            try {
                const { data } = await api.get(`/users/search?q=${query}&page=${page}`);
                this.searchResults = data.data || data;
                this.currentPage = data.current_page || page;
                this.lastPage = data.last_page || 1;
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            } finally {
                this.isLoading = false;
            }
        }
    }
});
