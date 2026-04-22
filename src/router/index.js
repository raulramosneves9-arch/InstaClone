import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { layout: 'AuthLayout', requiresGuest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue'),
        meta: { layout: 'AuthLayout', requiresGuest: true }
    },
    {
        path: '/',
        component: () => import('../views/FeedView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/post/create',
        name: 'post.create',
        component: () => import('../views/CreatePostView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/profile/:username',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../views/NotFoundView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 })
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Se tem token mas não tem user, tenta buscar o user (F5/Refresh)
    if (authStore.token && !authStore.user) {
        try {
            await authStore.fetchMe();
        } catch (e) {
            authStore.logout();
        }
    }

    const isAuth = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuth) {
        next({ name: 'login' });
    } else if (to.meta.requiresGuest && isAuth) {
        next({ path: '/' });
    } else {
        next();
    }
});

export default router;