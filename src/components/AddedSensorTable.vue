<template>
  <div class="card mt-4">
    <div class="accordion accordion-flush">
      <div v-for="number in groups" :key="number">
        <div class="accordion-item">
          <h2 class="accordion-header" :id="'heading' + number">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#collapse' + number"
              aria-expanded="true"
              :aria-controls="'collapse' + number"
            >
              Gruppe {{ number }}
            </button>
          </h2>
          <div
            :id="'collapse' + number"
            class="accordion-collapse collapse show"
            :aria-labelledby="'heading' + number"
          >
            <div class="accordion-body">
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
                  <tr
                    v-for="sensor in selectedSensors"
                    :key="sensor.id"
                    v-show="number == sensor.group"
                  >
                    <td>{{ sensor.sensorName }}</td>
                    <td>
                      <input
                        type="date"
                        class="form-control"
                        :value="sensor.startTime.toISOString().slice(0, 10)"
                        disabled
                      />
                      <input
                        type="time"
                        class="form-control"
                        :value="sensor.startTime.toLocaleTimeString('en-GB')"
                        step="1"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        class="form-control"
                        :value="sensor.endTime.toISOString().slice(0, 10)"
                        disabled
                      />
                      <input
                        type="time"
                        class="form-control"
                        :value="sensor.endTime.toLocaleTimeString('en-GB')"
                        step="1"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control"
                        :placeholder="sensor.group"
                        v-model.number="sensor.group"
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
                        <option
                          v-for="graphType in graphTypes"
                          :key="graphType.value"
                        >
                          {{ graphType.type }}
                        </option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
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

    const groups = ref([] as number[]);

    watch(
      selectedSensors.value,
      (selectedSensors: Sensor[], prevSelectedSensors: Sensor[]) => {
        groups.value = [
          ...new Set(
            selectedSensors
              .map((s) => s.group)
              .filter((input) => typeof input === "number")
          ),
        ];
      }
    );

    /*
    const filterSensors = (sensor: Sensor) => {
      return selectedSensors.value.filter(
        (s) => s.sensorName != sensor.sensorName
      );
    };*/

    const filterSensors = (sensor: Sensor) => {
      return selectedSensors.value
        .filter((s) => s.id != sensor.id)
        .map((s) => ({ value: s.id, label: s.sensorName }));
    };

    return { graphTypes, selectedSensors, filterSensors, groups };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>