import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueGridLayout from 'vue-grid-layout'
import Multiselect from "@vueform/multiselect";
import VueApexCharts from "vue3-apexcharts";
import { BIconArrowDownUp, BIconSearch } from 'bootstrap-icons-vue';

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App)
    .use(router)
    .use(VueApexCharts)
    .use(VueGridLayout)
    .component("Multiselect", Multiselect)
    .component("BIconArrowDownUp", BIconArrowDownUp)
    .component("BIconSearch", BIconSearch)
    .mount('#app')