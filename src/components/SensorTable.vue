<template>
  <DataTable
    :value="sensorNames"
    v-model:selection="selectedSensors"
    dataKey="id"
    :paginator="true"
    :rows="10"
    editMode="cell"
    class="editable-cells-table"
  >
    <Column field="sensorName" header="Sensors Name" sortable="true"></Column>
    <Column
      field="startTime"
      header="Start time"
      headerStyle="text-align:center"
      bodyStyle="text-align:center"
    >
      <template #body="slotProps">
        <p>
          <i class="pi pi-calendar"></i>
          {{ slotProps.data["startTime"].toLocaleDateString("en-GB") }}
        </p>
      </template>

      <template #editor="slotProps">
        <div class="p-fluid p-grid p-formgrid">
          <div class="p-field p-col-12 p-md-4">
            <Calendar
              id="min"
              v-model="slotProps.data['startTime']"
              showOnFocus="false"
              :minDate="sensorNames[0].startTime"
              :maxDate="sensorNames[0].endTime"
              :manualInput="false"
            />
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="endTme"
      header="End time"
      headerStyle="text-align:center"
      bodyStyle="text-align:center"
    >
      <template #body="slotProps">
        <p>
          <i class="pi pi-calendar"></i>
          {{ slotProps.data["endTime"].toLocaleDateString("en-GB") }}
        </p>
      </template>

      <template #editor="slotProps">
        <div class="p-fluid p-grid p-formgrid">
          <div class="p-field p-col-12 p-md-4">
            <Calendar
              id="max"
              v-model="slotProps.data['endTime']"
              showOnFocus="false"
              :minDate="sensorNames[0].startTime"
              :maxDate="sensorNames[0].endTime"
              :manualInput="false"
            />
          </div>
        </div>
      </template>
    </Column>
    <Column
      selectionMode="multiple"
      headerStyle="width: 3em"
      bodyStyle="width: 3em"
    ></Column>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import { useSelectedSensors } from "@/composables/useSelectedSensors";

export default defineComponent({
  name: "SensorTable",
  props: ["sensorNames"],
  setup: (props) => {
    //component specific
    const selectedSensors = useSelectedSensors();

    return {
      selectedSensors,
    };
  },
});
</script>

<style scoped lang="scss">
p:hover {
  cursor: pointer;
}
</style>