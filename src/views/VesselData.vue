<template>
  <div class="p-d-flex p-p-3 card">
    <Card>
      <template #title> Sensors </template>
      <template #content>
        <DataTable
          :value="sensors"
          v-model:selection="selectedSensor"
          selectionMode="multiple"
          dataKey="sensors"
          @row-select="onRowSelect"
        >
        <Column field="code" header="Code"></Column>        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {

setup() {
    const selectedSensors = ref([]);
    const sensors: string[] = ["position", "velocity", "acceleration", "fuel", "torque"]

    const onRowSelect = () => {
      console.log("row selected");
    };

    return { sensors, onRowSelect, selectedSensors };
  },

};
</script>

<style scoped lang="scss">

</style>