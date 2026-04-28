import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ROUTE_NAMES } from './routeNames';

const routes = [
    {
        path: '/login',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('../views/auth/LoginView.vue'),
        meta: { layout: 'AuthLayout', requiresGuest: true }
    },
    {
        path: '/cadastro',
        name: ROUTE_NAMES.CADASTRO,
        component: () => import('../views/auth/CadastroView.vue'),
        meta: { layout: 'AuthLayout', requiresGuest: true }
    },
    {
        path: '/feed',
        name: ROUTE_NAMES.FEED,
        component: () => import('../views/FeedView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/create',
        alias: '/criar',
        name: ROUTE_NAMES.CRIAR,
        component: () => import('../views/CriarPostView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/profile',
        alias: '/perfil',
        name: ROUTE_NAMES.PERFIL,
        component: () => import('../views/PerfilView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/profile/edit',
        alias: '/perfil/editar',
        name: ROUTE_NAMES.PERFIL_EDITAR,
        component: () => import('../views/EditarPerfilView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/profile/list/:type',
        alias: '/perfil/lista/:type',
        name: ROUTE_NAMES.PERFIL_LISTA,
        component: () => import('../views/ListaConexaoView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/discover',
        alias: '/descobrir',
        name: ROUTE_NAMES.DESCOBRIR,
        component: () => import('../views/DescobrirView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/posts/:postId',
        name: ROUTE_NAMES.POST_DETAILS,
        component: () => import('../views/PostDetailsView.vue'),
        meta: { layout: 'AppLayout', requiresAuth: true }
    },
    {
        path: '/',
        redirect: '/feed'
    },
    {
        path: '/:pathMatch(.*)*',
        name: ROUTE_NAMES.NOT_FOUND,
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
            await authStore.logout();
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