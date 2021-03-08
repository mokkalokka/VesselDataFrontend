<template>
  <div class="card mt-4">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Sensor</th>
          <th>Dato fra</th>
          <th>Dato til</th>
          <th>Gruppe</th>
          <th>Sammenlign med</th>
          <th>Graftype</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sensor in selectedSensors" :key="sensor.id">
          <td>{{ sensor.sensorName }}</td>
          <td>
            <input
              type="date"
              class="form-control"
              :value="sensor.startTime.toISOString().slice(0, 10)"
            />
            <input
              type="time"
              class="form-control"
              :value="sensor.startTime.toLocaleTimeString('en-GB')"
              step="1"
            />
          </td>
          <td>
            <input
              type="date"
              class="form-control"
              :value="sensor.endTime.toISOString().slice(0, 10)"
            />
            <input
              type="time"
              class="form-control"
              :value="sensor.endTime.toLocaleTimeString('en-GB')"
              step="1"
            />
          </td>
          <td>
            <input
              type="text"
              class="form-control"
              placeholder="sensor.group"
              v-model="sensor.group"
            />
          </td>
          <td>
            <Multiselect
              :searchable="true"
              :createTag="false"
              mode="tags"
              v-model="sensor.grahpsToCompare"
              :options="filterSensors(sensor)"
            />
            <!-- <select v-model="sensor.grahpsToCompare" multiple>
              <option v-for="s in filterSensors(sensor)" :key="s.id">
                {{ s.sensorName }}
              </option>
            </select> -->
          </td>
          <td>
            <select class="form-select" v-model="sensor.graphType">
              <option v-for="graphType in graphTypes" :key="graphType.value">
                {{ graphType.type }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import { Sensor } from "@/composables/sensorInterface";

export default defineComponent({
  name: "AddedSensorTable",

  setup: () => {
    const selectedSensors = useSelectedSensors();
    const graphTypes = [
      { type: "Linje", value: "Linje" },
      { type: "Bar", value: "Bar" },
      { type: "Pai", value: "Pai" },
    ];

    const value = ref(null);
    const options = ["test1", "test2"];

    /*
    const filterSensors = (sensor: Sensor) => {
      return selectedSensors.value.filter(
        (s) => s.sensorName != sensor.sensorName
      );
    };*/

    const filterSensors = (sensor: Sensor) => {
      return selectedSensors.value
        .filter((s) => s.sensorName != sensor.sensorName)
        .map((s) => ({ value: s.id, label: s.sensorName }));
    };

    return { graphTypes, selectedSensors, filterSensors, value, options };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>