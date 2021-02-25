<template>
  <div class="card my-4">
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
        <InputText
            v-model="graphFilter"
            placeholder="Keyword Search"
          />
          <p>{{graphFilter}}</p>
        <div v-if="showSensorData">
          <div v-for="s of selectedSensors" :key="s.id">
            <div >
              <p>{{ s.sensorName }}</p>
              <line-graph :sensorName="s.sensorName" :sensorId="s.id" />
            </div>
            
          </div>
        </div>
      </AccordionTab>
      <AccordionTab header="Map" v-model:activeIndex="active">
            <Map/>
      </AccordionTab>
    </Accordion>
      <div class="p-d-flex p-jc-center">
        <Button
          label="view selected data"
          icon="pi pi-table"
          class="p-button-rounded p-button-info p-m-4"
          @click="sendSelected"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import LineGraph from "@/components/LineGraph.vue";
import SensorTable from "@/components/SensorTable.vue";
import Map from "@/components/Map.vue";

export default defineComponent({
  components: { LineGraph, SensorTable, Map },
  name: "VesselData",
  setup() {
    const selectedSensors = useSelectedSensors();
    const showSensorData = ref(false);
    const active = ref(2 as number);
    const graphFilter = ref("")
    const filteredSensors = ref([])
    

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

    return {
      active,
      showSensorData,
      sensorNames,
      selectedSensors,
      sendSelected,
      graphFilter
    };
  },
});
</script>

<style scoped lang="scss">
</style>
