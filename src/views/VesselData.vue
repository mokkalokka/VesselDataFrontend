<template>
  <div class="card my-4">
    <div class="p-d-flex p-jc-center"></div>
    <Accordion :activeIndex="active" :multiple="true">
      <AccordionTab header="Sensor table">
        <!-- SENSOR TABLE HERE -->
        <SensorTable
          :sensorNames="sensorNames"
          :selectedSensors="selectedSensors"
        />
        <div class="p-d-flex p-jc-center" v-if="selectedSensors.length != 0">
          <Button
            label="view selected data"
            icon="pi pi-table"
            class="p-button-rounded p-button-info p-m-4"
            @click="sendSelected"
          />
        </div>
      </AccordionTab>

      <AccordionTab :disabled="!showSensorData" header="Sensor Data">
        <!-- GRAPHS HERE -->
        <div class="p-d-flex p-jc-center pt-2">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="graphFilter" placeholder="Keyword Search" />
          </span>
        </div>

        <div v-if="showSensorData">
          <div v-for="s of selectedSensors" :key="s.id">
            <div v-if="s.sensorName.includes(graphFilter)">
              <!-- <h1>{{ s.sensorName }}</h1> -->
              <line-graph :sensorName="s.sensorName" :sensorId="s.id" />
            </div>
          </div>
        </div>
      </AccordionTab>
      <AccordionTab header="Map">
        <Map />
      </AccordionTab>
    </Accordion>
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
    const active = ref([0, 2] as number[]);
    const graphFilter = ref("");

    const sendSelected = () => {
      showSensorData.value = true;
      const ids: number[] = [];
      selectedSensors.value.map((s) => {
        ids.push(s["id"]);
        console.log(s["startTime"], s["endTime"]);
      });
      /* sensordata.value = getSensorDataById(ids); */
      active.value = [1];
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
      graphFilter,
    };
  },
});
</script>

<style lang="scss">
.p-accordion .p-accordion-content {
  padding: 0;
}
</style>
