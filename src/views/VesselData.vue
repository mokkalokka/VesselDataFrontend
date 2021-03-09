<template>
  <!--
<div class="container">
  <div class="card my-4">
    <div class="p-d-flex p-jc-center"></div>
    <Accordion :activeIndex="active" :multiple="true">
      <AccordionTab header="Sensor table">
         SENSOR TABLE HERE
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
        GRAPHS HERE
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
  -->

  <div class="container">
    <div class="card my-4">
      <div class="accordion accordion-flush open" id="accordionFlushExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              Sensor
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            class="accordion-collapse collapse multi-collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div class="accordion-body">
              <div class="table table-responsive">
                <SensorTable
                  :sensorNames="sensorNames"
                  :selectedSensors="selectedSensors"
                />
                <div class="" v-if="selectedSensors.length != 0">
                  <button
                    class="btn btn-primary"
                    data-bs-target=".multi-collapse"
                    data-bs-toggle="collapse"
                    aria-controls="flush-collapseOne flush-collapseTwo"
                    @click="setSensorsToRender"
                  >
                    Select Graph layout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingTwo">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              Sensor data
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            class="accordion-collapse collapse multi-collapse"
            aria-labelledby="flush-headingTwo"
          >
            <div class="accordion-body">
              Sensor data for selected sensors here ;)
            </div>
          </div>
        </div>
        <div class="accordion-item" disabled="!showSensorData">
          <h2 class="accordion-header" id="flush-headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseThree"
              aria-expanded="false"
              aria-controls="flush-collapseThree"
            >
              Graphs
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            class="accordion-collapse collapse"
            aria-labelledby="flush-headingThree"
          >
            <div class="accordion-body">
              <div v-if="showSensorData">
                <vue-grid  :key="sensorListUpdated"/>
                <!-- <div v-for="s in sensorsToRender" :key="s.id">
                  <line-graph :sensorName="s.sensorName" :sensorId="s.id" />
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingFour">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseFour"
              aria-expanded="true"
              aria-controls="flush-collapseFour"
            >
              Map
            </button>
          </h2>
          <div
            id="flush-collapseFour"
            class="accordion-collapse collapse show"
            aria-labelledby="flush-headingFour"
          >
            <div class="accordion-body">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
/* import LineGraph from "@/components/LineGraph.vue"; */
import SensorTable from "@/components/SensorTable.vue";
import Map from "@/components/Map.vue";
import VueGrid from "@/components/VueGrid.vue"

interface SensorName {
  id: number;
  filterkey: string;
  sensorName: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export default defineComponent({
  components: { /* LineGraph, */ SensorTable, Map, VueGrid },
  name: "VesselData",
  setup() {
    const selectedSensors = useSelectedSensors();
    const showSensorData = ref(false);
    const active = ref([0, 2] as number[]);
    const graphFilter = ref("");
    const graphActive = ref([0] as number[]);
    const sensorsToRender = ref([] as SensorName[]);
    const sensorListUpdated = ref(1)

    const setSensorsToRender = () => {
      sensorListUpdated.value ++
      showSensorData.value = true;
      sensorsToRender.value = [...selectedSensors.value];
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
      sensorsToRender,
      sensorListUpdated
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
