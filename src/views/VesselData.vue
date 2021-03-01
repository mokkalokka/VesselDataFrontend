<template>
<div class="container">
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
            @click="setSensorsToRender"
          />
        </div>
      </AccordionTab>

      <AccordionTab :disabled="!showSensorData" header="Sensor Data">
        <!-- GRAPHS HERE -->
        <div class="p-d-flex p-jc-end graphSearch p-3">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="graphFilter" placeholder="Keyword Search" />
          </span>
        </div>

        <div v-if="showSensorData">
          <Accordion
            v-for="s in sensorsToRender"
            :key="s.id"
            :activeIndex="graphActive"
            :multiple="true"
            v-show="filter(s.sensorName)"
          >
            <AccordionTab :header="s.sensorName">
              <line-graph :sensorName="s.sensorName" :sensorId="s.id" />
            </AccordionTab>
          </Accordion>
        </div>
      </AccordionTab>
      <AccordionTab header="Map">
        <Map />
      </AccordionTab>
    </Accordion>
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


interface SensorName {
    id: number;
    filterkey: string;
    sensorName: string;
    description: string;
    startTime: Date;
    endTime: Date;
}

export default defineComponent({
  components: { LineGraph, SensorTable, Map },
  name: "VesselData",
  setup() {
    const selectedSensors = useSelectedSensors();
    const showSensorData = ref(false);
    const active = ref([0, 2] as number[]);
    const graphFilter = ref("");
    const graphActive = ref([0] as number[]);
    const sensorsToRender = ref([] as SensorName[])

    const setSensorsToRender = () => {
      showSensorData.value = true;
      sensorsToRender.value = [...selectedSensors.value]
      active.value = [1];
    };

    const filter = (sensorName: string) => {
      return sensorName.toLowerCase().includes(graphFilter.value.toLowerCase());
    };

    // From server
    const { sensorNames, initialize } = useSensorData();

    initialize();

    return {
      active,
      showSensorData,
      sensorNames,
      selectedSensors,
      setSensorsToRender,
      graphFilter,
      graphActive,
      filter,
      sensorsToRender
    };
  },
});
</script>

<style lang="scss">
.p-accordion .p-accordion-content {
  padding: 0;
}

.graphSearch {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}
</style>
