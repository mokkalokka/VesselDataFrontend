import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";

import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

import DataTable from "primevue/datatable"
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import InputText from "primevue/inputtext"
import Card from 'primevue/card';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Chart from 'primevue/chart';
import Slider from 'primevue/slider'
import Calendar from 'primevue/calendar';
import CheckBox from 'primevue/checkbox'

createApp(App)
    .use(router)
    .use(PrimeVue)
    .component("DataTable", DataTable)
    .component("Column", Column)
    .component("Card", Card)
    .component("Button", Button)
    .component("ColumnGroup", ColumnGroup)
    .component("InputText", InputText)
    .component("Accordion", Accordion)
    .component("AccordionTab", AccordionTab)
    .component("Chart", Chart)
    .component("Slider", Slider)
    .component("Calendar", Calendar)
    .component("CheckBox", CheckBox)




    .mount('#app')