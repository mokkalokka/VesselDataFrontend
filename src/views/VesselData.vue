<template>
  <div class="p-md-12 p-p-3 card">
    <Card>
      <template #header>
        <h1><i class="pi pi-compass"></i></h1>
      </template>
      <template #title> Sensors </template>
      <template #content>
        <Accordion v-model:activeIndex="active">
          <AccordionTab header="Sensor table">
            <!-- SENSOR TABLE HERE -->
            <SensorTable
              :sensorNames="sensorNames"
              :selectedSensors="selectedSensors"
            />
          </AccordionTab>
          <AccordionTab :disabled="!showSensorData" header="Sensor Data">
            <!-- GRAPHS HERE -->
            <div v-if="showSensorData">
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
import { defineComponent, ref, watchEffect } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import LineGraph from "@/components/LineGraph.vue";
import SensorTable from "@/components/SensorTable.vue";

export default defineComponent({
  components: { LineGraph, SensorTable },
  name: "VesselData",
  setup() {
    const selectedSensors = useSelectedSensors();
    const showSensorData = ref(false);
    const active = ref(0 as number);
    

    const sendSelected = () => {
      showSensorData.value = true;
      const ids: number[] = [];
      selectedSensors.value.map((s) => {
        ids.push(s["id"]);
        console.log(s["startTime"], s["endTime"]);
        
      });
      /* sensordata.value = getSensorDataById(ids); */
      active.value = 1;
      /* console.log(sensordata); */
    };

    // From server
    const { sensorNames, initialize } = useSensorData();

    initialize();


    
    return { active, showSensorData, sensorNames, selectedSensors, sendSelected };
  },
});
</script>

<style scoped lang="scss">
</style>
