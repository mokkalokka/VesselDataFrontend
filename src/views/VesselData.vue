<template>
  <div class="container">
    <h1 class="d-flex justify-content-center">"Båtnavn"</h1>
    <div class="accordion" id="sensorAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sensorTableCollapse"
            aria-expanded="false"
            aria-controls="sensorTableCollapse"
          >
            Sensorer for "Båtnavn"
          </button>
        </h2>
        <div
          id="sensorTableCollapse"
          class="accordion-collapse collapse multi-collapse show"
          aria-labelledby="flush-headingOne"
          data-bs-parent="#sensorAccordion"
        >
          <div class="accordion-body">
            <SensorTable :sensorNames="sensorNames" />
            <div v-show="selectedSensors.length != 0">
              <AddedSensorTable />
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-item" disabled="!showSensorData">
        <h2 class="accordion-header" id="flush-headingThree">
          <button
            class="accordion-button collapsed"
            type="button"
            :disabled="groups.length == 0"
            data-bs-toggle="collapse"
            data-bs-target="#graphCollapse"
            aria-expanded="false"
            aria-controls="graphCollapse"
            v-bind:class="groups.length == 0 ? 'bg-light' : 'bg-default'"
          >
            Grafer
          </button>
        </h2>
        <div
          id="graphCollapse"
          aria-labelledby="flush-headingThree"
          v-bind:class="graphToggleClass"
        >
          <div class="accordion-body">
            <Accordion>
              <AccordionItem
                v-for="group in groups"
                :key="group.id"
                v-show="group.sensors.length != 0"
              >
                <AccordionHeader
                  :item="group"
                  :headerId="group.id"
                  :tabHeader="'Gruppe'"
                />
                <AccordionBody :item="group" :multiCollapse="false">
                  <vue-grid :groupId="group.id" />
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import {
  resetSelectedSensors,
  useSelectedSensors,
} from "@/composables/useSelectedSensors";
import {
  resetGroups,
  resetTempGroups,
  useGroups,
  useTempGroups,
} from "@/composables/useGroups";
import SensorTable from "@/components/SensorTable.vue";
import AddedSensorTable from "@/components/AddedSensorTable.vue";
import VueGrid from "@/components/VueGrid.vue";
import lodash from "lodash";
import Accordion from "@/components/reusable/accordion/Accordion.vue";
import AccordionItem from "@/components/reusable/accordion/AccordionItem.vue";
import AccordionHeader from "@/components/reusable/accordion/AccordionHeader.vue";
import AccordionBody from "@/components/reusable/accordion/AccordionBody.vue";

export default defineComponent({
  components: {
    /* LineGraph, */ SensorTable,
    /* Map */ VueGrid,
    AddedSensorTable,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
  },
  name: "VesselData",
  setup() {
    // array of selected sensors
    const selectedSensors = useSelectedSensors();

    // boolean variable to determine if sensor layout selection should be shown
    const showSensorData = ref(false as boolean);

    // search query for graphs
    const graphFilter = ref("" as string);

    // ??
    const graphActive = ref([0] as number[]);

    // ??
    const sensorListUpdated = ref(1 as number);

    // array of groups to render graphs in
    const groups = useGroups();

    //array of temporary groups i selection phase, before rendering graphs
    const tempGroups = useTempGroups();

    // bootstrap class for accordion, changes depending on open-/close-state of graph accordion tab
    const graphToggleClass = ref("accordion-collapse collapse multi-collapse");

    resetTempGroups();
    resetGroups();
    resetSelectedSensors();

    // when component is mounted, sett accordion tab to collapse, without multi-collapse property
    onMounted(() => {
      document
        .getElementById("graphCollapse")
        .addEventListener("show.bs.collapse", function () {
          graphToggleClass.value = "accordion-collapse collapse";
        });
    });

    /**
     * Method for filtering graphs on sensorName
     * @param {string} sensorName - sensor name to match search query on
     * @returns {boolean} result of string match
     */
    const filter = (sensorName: string): boolean => {
      return sensorName.toLowerCase().includes(graphFilter.value.toLowerCase());
    };

    // From server
    const { sensorNames, initialize } = useSensorData();

    initialize();

    return {
      showSensorData,
      sensorNames,
      selectedSensors,
      graphFilter,
      graphActive,
      filter,
      sensorListUpdated,
      groups,
      graphToggleClass,
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
