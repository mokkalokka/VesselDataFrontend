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
          <AccordionTab header="Sensor Data">
            <!-- GRAPHS HERE -->

            <div v-for="s of selectedSensors" :key="s.id">
              <p>{{ s.sensorName }}</p>
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

export default defineComponent({
  name: "VesselData",
  setup() {
    const selectedSensors = ref([] as []);
    const { sensorNames, fetchData, getSensorsById } = useSensorData();
    const active = ref(0 as number);

    fetchData();

    const sendSelected = () => {
      const ids: number[] = [];
      selectedSensors.value.map((s) => {
        ids.push(s["id"]);
      });
      const sensordata = getSensorsById(ids);
      active.value = 1;
      console.log(sensordata);
    };

    return { sensorNames, selectedSensors, sendSelected, active };
  },
});
</script>

<style scoped lang="scss">
</style>
