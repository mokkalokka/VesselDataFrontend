<template>
  <div class="p-d-flex p-p-3 card">
    <Card>
      <template #header>
        <h1>Header here</h1>
      </template>
      <template #title> Sensors </template>
      <template #content>
        <Accordion v-model:activeIndex="active">
          <AccordionTab header="Sensor table">
            <DataTable
              :value="sensorNames"
              v-model:selection="selectedSensors"
              selectionMode="multiple"
              dataKey="id"
              :metaKeySelection="false"
              :scrollable="true"
              scrollHeight="400px"
            >
              <Column
                field="sensorName"
                header="Sensors Name"
                sortable="true"
              ></Column>
            </DataTable>
          </AccordionTab>
          
          <AccordionTab :disabled="!showSensorData"  header="Sensor Data">
            <!-- GRAPHS HERE -->
            <div v-if="showSensorData" >
              <div v-for="s of selectedSensors" :key="s.id">
              <p>{{ s.sensorName }}</p>
              <line-graph :sensorName="s.sensorName" :sensorId="s.id" />
            </div>
            </div>
            
          </AccordionTab>
          
        </Accordion>
      </template>
      <template #footer>
      
        <Button
          label="view selected data"
          icon="pi pi-table"
          class="p-button-rounded p-button-info"
          @click="sendSelected"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import LineGraph from "@/components/LineGraph.vue";

export default defineComponent({
  components: { LineGraph },
  name: "VesselData",
  setup() {
    const selectedSensors = ref([] as []);
    const { sensorNames, fetchData, setSensorNames, initialize } = useSensorData();
    const active = ref(0 as number);
    const showSensorData = ref(false)
    const sensordata = ref([] as any)

    initialize()

    const sendSelected = () => {
      showSensorData.value = true
      const ids: number[] = [];
      selectedSensors.value.map((s) => {
        ids.push(s["id"]);
      });
      /* sensordata.value = getSensorDataById(ids); */
      active.value = 1;
      /* console.log(sensordata); */
    };

    return { sensorNames, selectedSensors, sendSelected, active, showSensorData };
  },
});
</script>

<style scoped lang="scss">
</style>
