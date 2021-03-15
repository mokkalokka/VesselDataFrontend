<template>
  <div class="container">
    <h1 class="d-flex justify-content-center">"Båtnavn"</h1>
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
              Sensorer for "Båtnavn"
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            class="accordion-collapse collapse multi-collapse show"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div class="accordion-body">
              <div class="table table-responsive">
                <SensorTable
                  :sensorNames="sensorNames"
                  :selectedSensors="selectedSensors"
                />
                <!-- <div  v-if="selectedSensors.length != 0">
                  <button
                    class="btn btn-danger"
                    @click="clearSelectedSensors"
                  >
                    Fjern valgte sensorer
                  </button>
                </div> -->
                <div v-show="selectedSensors.length != 0">
                  <div class="d-flex justify-content-center">
                    <h2>Valgte sensorer</h2>
                  </div>
                  <AddedSensorTable />
                  <div class="d-flex justify-content-center mt-4">
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      data-bs-target=".multi-collapse"
                      data-bs-toggle="collapse"
                      aria-controls="flush-collapseOne flush-collapseTwo"
                      @click="setSensorsToRender"
                    >
                      Vis grafer
                    </button>
                  </div>
                </div>
              </div>
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
              Grafer
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            class="accordion-collapse collapse multi-collapse"
            aria-labelledby="flush-headingThree"
          >
            <div class="accordion-body">
              <div v-if="showGraphs" :key="sensorListUpdated">
                <div v-for="group in groups" :key="group.id">
                  <vue-grid v-show="group.sensors.length != 0" :group="group" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="accordion-item">
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
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import {
  resetSelectedSensors,
  useSelectedSensors,
} from "@/composables/useSelectedSensors";
import { useGroups, useTempGroups, resetGroups } from "@/composables/useGroups";
/* import LineGraph from "@/components/LineGraph.vue"; */
import SensorTable from "@/components/SensorTable.vue";
import AddedSensorTable from "@/components/AddedSensorTable.vue";
import Map from "@/components/Map.vue";
/* import Map from "@/components/Map.vue"; */
import VueGrid from "@/components/VueGrid.vue";

interface SensorName {
  id: number;
  filterkey: string;
  sensorName: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export default defineComponent({
  components: {
    /* LineGraph, */ SensorTable,
    /* Map */ VueGrid,
    AddedSensorTable,
  },
  name: "VesselData",
  setup() {
    const selectedSensors = useSelectedSensors();
    const showSensorData = ref(false as boolean);
    const showGraphs = ref(false as boolean);
    const graphFilter = ref("" as string);
    const graphActive = ref([0] as number[]);
    const sensorListUpdated = ref(1 as number);
    const groups = useGroups();
    const tempGroups = useTempGroups();

    resetGroups();
    resetSelectedSensors();

    const setSensorsToRender = () => {
      sensorListUpdated.value++;
      groups.value = tempGroups.value;
      showGraphs.value = true;
    };

    const filter = (sensorName: string) => {
      return sensorName.toLowerCase().includes(graphFilter.value.toLowerCase());
    };

    // From server
    const { sensorNames, initialize } = useSensorData();

    initialize();

    return {
      showSensorData,
      showGraphs,
      sensorNames,
      selectedSensors,
      setSensorsToRender,
      graphFilter,
      graphActive,
      filter,
      sensorListUpdated,
      groups,
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
