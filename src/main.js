import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 1. Bootstrap primeiro
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// 2. Tema customizado depois (para sobrescrever o Bootstrap se necessário)
import './assets/styles/theme.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');