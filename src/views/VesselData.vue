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
      :value="sensorNames"
      v-model:selection="selectedSensors"
      selectionMode="multiple"
      dataKey="id"
      :metaKeySelection="false"
      :scrollable="true" scrollHeight="400px"
      
    >
      <Column field="sensorName" header="Sensors Name" sortable="true"></Column>
    </DataTable>
      </template>
      <template #footer>
        <div v-for="s of selectedSensors" :key="s.id">
          <p>{{ s["id"] }}</p>
        </div>
        <Button label="view selected data" class="p-button-rounded p-button-info" @click="sendSelected"/>
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
    const selectedSensors = ref([] as []);
    const { sensorNames, fetchData, getSensorsById } = useSensorData();

    fetchData()
  
    const sendSelected = () => {
      const ids: number[] = []
      selectedSensors.value.map((s) => {
        ids.push(s["id"])
      })
      const sensordata = getSensorsById(ids)
      console.log(sensordata)
    }

    return { sensorNames, selectedSensors, sendSelected };
  },
});
</script>
