import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';

// 1. Bootstrap primeiro
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 2. Nosso tema depois (para poder sobrescrever o Bootstrap se necessário)
import './assets/styles/theme.css';

import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');