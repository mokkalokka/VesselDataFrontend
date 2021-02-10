import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";

import PrimeVue from 'primevue/config';

createApp(App)
    .use(router)
    .use(PrimeVue)
    .mount('#app')