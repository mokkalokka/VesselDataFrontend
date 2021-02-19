<template>
  
  <div class="p-d-flex p-p-3 card">
    <Card>
      <template #header>
        <img
          alt="user header"
          src="https://st4.depositphotos.com/3903847/25303/v/950/depositphotos_253033396-stock-illustration-speed-boat.jpg"
        />
      </template>
      <template #title> Sensors </template>
      <template #content>
        <DataTable
      :value="sensors"
      v-model:selection="selectedSensors"
      selectionMode="multiple"
      dataKey="id"
      @row-select="onRowSelect"
    >

      <Column field="name" header="Sensors Name" sortable="true"></Column>
      <Column field="numpoints" header="Number of points" sortable=true></Column>
    </DataTable>
      </template>
      <template #footer>
        <h3>footer</h3>
      </template>
    </Card>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSensorData } from "@/composables/useSensorData"

export default defineComponent({
  name: "VesselData",
  setup() {
    const selectedSensors = ref([]);
    const { sensors, fetchData } = useSensorData();

    fetchData()

    const onRowSelect = () => {
      console.log("row selected", selectedSensors);
    };

    return { sensors, onRowSelect, selectedSensors };
  },
});
</script>
