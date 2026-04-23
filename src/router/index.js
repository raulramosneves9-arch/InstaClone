import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/LoginView.vue'),
        meta: { layout: 'AuthLayout', requiresGuest: true }
    },
    {
        path: '/cadastro',
        name: 'cadastro',
        component: () => import('../views/auth/CadastroView.vue'),
        meta: { layout: 'AuthLayout', requiresGuest: true }
    },
    {
        path: '/feed',
        name: 'feed',
        component: () => import('../views/FeedView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/criar',
        name: 'criar',
        component: () => import('../views/CriarPostView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/perfil',
        name: 'perfil',
        component: () => import('../views/PerfilView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/',
        redirect: '/feed'
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

    // Tenta restaurar sessão se houver token mas não houver user
    if (authStore.token && !authStore.user) {
        try {
            await authStore.fetchMe();
        } catch (e) {
            authStore.logout();
        }
    }

    const isAuth = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuth) {
        next('/login');
    } else if (to.meta.requiresGuest && isAuth) {
        next('/feed');
    } else {
        next();
    }
});

export default router;