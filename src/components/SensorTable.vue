<template>
  <DataTable
    :value="sensorNames"
    v-model:selection="selectedSensors"
    v-model:filters="sensorFilters"
    dataKey="id"
    editMode="cell"
    class="editable-cells-table p-p-0"
    :scrollable="true"
    scrollHeight="400px"
  >
    <template #header>
      <div class="p-d-flex p-jc-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          class="p-button-outlined"
          @click="clearFilter()"
        />
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="sensorFilters['sensorName']"
            placeholder="Keyword Search"
          />
        </span>
      </div>
    </template>
    <template #empty> No Sensors found. </template>
    <template #loading> Loading sensors. Please wait. </template>

    <Column
      field="sensorName"
      header="Sensors Name"
      sortable
      filterMatchMode="contains"
    ></Column>
    <Column
      field="description"
      header="Description"
      headerStyle="text-align:center"
            bodyStyle="text-align:center"

    ></Column>
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
            <Calendar
              id="min"
              v-model="slotProps.data['startTime']"
              showOnFocus="false"
              :minDate="sensorNames[0].startTime"
              :maxDate="sensorNames[0].endTime"
              :manualInput="false"
            />
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
            <Calendar
              id="max"
              v-model="slotProps.data['endTime']"
              showOnFocus="false"
              :minDate="sensorNames[0].startTime"
              :maxDate="sensorNames[0].endTime"
              :manualInput="false"
            />
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
  setup: () => {
    //component specific
    const sensorFilters = ref({ sensorName: "" });
    const selectedSensors = useSelectedSensors();
    

    const clearFilter = () => {
      sensorFilters.value["sensorName"] = "";
    };

    return {
      selectedSensors,
      sensorFilters,
      clearFilter,
      
    };
  },
});
</script>

<style scoped lang="scss">
p:hover {
  cursor: pointer;
}
</style>