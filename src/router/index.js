import { createRouter, createWebHistory } from 'vue-router';

// Definimos as rotas como um array de objetos
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
        redirect: '/feed',
        component: () => import('../layouts/MainLayout.vue'),
        children: [
            {
                path: 'feed',
                name: 'Feed',
                component: () => import('../views/FeedView.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'explore',
                name: 'Explore',
                component: () => import('../views/ExploreView.vue'),
                meta: { requiresAuth: true }
            },
            // Rota dinâmica para o perfil
            {
                path: 'profile/:username',
                name: 'Profile',
                component: () => import('../views/ProfileView.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    // Rota 404 - Caso o usuário digite algo que não existe
    {
        path: '/:pathMatch(.*)*',
        redirect: '/feed'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

/**
 * Navigation Guard:
 * Antes de cada troca de rota, verificamos se o usuário tem permissão.
 */
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const isAuthRequired = to.matched.some(record => record.meta.requiresAuth);

    if (isAuthRequired && !token) {
        // Tenta acessar página protegida sem token -> vai pro Login
        next('/login');
    } else if (!isAuthRequired && token) {
        // Tenta acessar Login/Register já estando logado -> vai pro Feed
        next('/feed');
    } else {
        // Segue viagem normalmente
        next();
    }
});

export default router;