import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        redirect: '/feed'
    },
    {
        path: '/feed',
        name: 'Feed',
        component: () => import('../views/FeedView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/create',
        name: 'CreatePost',
        component: () => import('../views/CreatePostView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/:username',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    // Rota catch-all (404)
    {
        path: '/:pathMatch(.*)*',
        redirect: '/feed'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (!to.meta.requiresAuth && isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
        next('/feed');
    } else {
        next();
    }
});

export default router;