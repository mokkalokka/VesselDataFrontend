import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";

import PrimeVue from 'primevue/config';
import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

import DataTable from "primevue/datatable"
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import InputText from "primevue/inputtext"


createApp(App)
    .use(router)
    .use(PrimeVue)
    .component("DataTable", DataTable)
    .component("Column", Column)
    .component("ColumnGroup", ColumnGroup)
    .component("InputText", InputText)
    .mount('#app')