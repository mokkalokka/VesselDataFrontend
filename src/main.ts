import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";

import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';

createApp(App)
    .use(router)
    .use(PrimeVue)
    .component("DataTable", DataTable)
    .component("Column", Column)
    .component("Card", Card)
    .mount('#app')