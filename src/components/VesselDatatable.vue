<template>
  
    <div class="container">

        <div>

        <DataTable :value="vessels" v-model:selection="selectedVessel" selectionMode="single" dataKey="id"
            :filters="filters">
            <template #header>
                Vessels
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText type="text" v-model="filters['name']" placeholder="Keyword Search" />
                </span>
            </template>
    
            <Column field="name" header="Name" sortable filterMatchMode="contains"></Column>

        </DataTable>
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";



export default defineComponent({
    
    name: "VesselDataTable",

    setup:  () => {

        const vessels = ref([] as Vessel[])
        const selectedVessel = ref({} as Vessel)
        const filters = ref({

            "name" : ""

        });

        onMounted(() => {

            vessels.value = [
                {"name": "test1", "id": 1} as Vessel,
                {"name": "test2", "id": 2} as Vessel,
                {"name": "test3", "id": 3} as Vessel,
                {"name": "test4", "id": 4} as Vessel,
                {"name": "test5", "id": 5} as Vessel
            ]

        });

        return {vessels, selectedVessel, filters};

    }

});

interface Vessel {

    name: string;
    id: number;

}

</script>

<style>

</style>