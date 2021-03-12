<template>
  <div class="card mt-4">
    <div class="accordion accordion-flush">
      <div
        v-for="group in tempGroups"
        :key="group.id"
        v-show="group.sensors.length != 0"
      >
        <div class="accordion-item">
          <h2 class="accordion-header" :id="'heading' + group.id">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#collapse' + group.id"
              aria-expanded="true"
              :aria-controls="'collapse' + group.id"
            >
              Gruppe {{ group.id }}
            </button>
          </h2>
          <div
            :id="'collapse' + group.id"
            class="accordion-collapse collapse show"
            :aria-labelledby="'heading' + group.id"
          >
            <div class="accordion-body p-0">
              <div class="card my-2">
                <div class="card-body p-2">
                  <h5 class="card-title">Instillinger for gruppen</h5>
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>Datovisning</th>
                        <th>Dato fra</th>
                        <th>Dato til</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              checked
                              @click="group.groupDate = !group.groupDate"
                            />
                            <label class="form-check-label">
                              Datovisning {{ group.groupDate }}
                            </label>
                          </div>
                        </td>
                        <td>
                          <input
                            type="date"
                            class="form-control"
                            value="2021-03-10"
                            disabled
                          />
                          <input
                            type="time"
                            class="form-control"
                            value="11:11:11"
                            step="1"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            class="form-control"
                            value="2021-03-10"
                            disabled
                          />
                          <input
                            type="time"
                            class="form-control"
                            value="12:12:12"
                            step="1"
                            disabled
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="card my-2">
                <div class="card-body p-2">
                  <h5 class="card-title">Instillinger for sensorene</h5>
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
                      <!-- <tr
                        v-for="sensor in selectedSensors"
                        :key="sensor.id"
                        v-show="group.id == sensor.group"
                      > -->
                      <tr v-for="sensor in group.sensors" :key="sensor.id">
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
                            :value="
                              sensor.startTime.toLocaleTimeString('en-GB')
                            "
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
                          <select @change="addSensorToGroup(sensor, $event)">
                            <option
                              :value="group.id"
                              v-for="group in tempGroups"
                              :key="group.id"
                              :selected="
                                true ? sensor.group == group.id : false
                              "
                            >
                              {{ group.id }}
                            </option>
                            <option :value="tempGroups.length + 1">
                              Legg til ny gruppe
                            </option>
                          </select>
                        </td>
                        <td>
                          <Multiselect
                            :searchable="true"
                            :createTag="false"
                            mode="tags"
                            v-model="sensor.grahpsToCompare"
                            :options="filterSensors(sensor)"
                          />
                        </td>
                        <td>
                          <select
                            class="form-select"
                            v-model="sensor.graphType"
                          >
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import { useGroups } from "@/composables/useGroups";
import { Sensor } from "@/Interfaces/sensorInterface";
import { Group } from "@/Interfaces/groupInterface";

export default defineComponent({
  name: "AddedSensorTable",

  setup: () => {
    const selectedSensors = useSelectedSensors();
    const graphTypes = [
      { type: "Linje", value: "Linje" },
      { type: "Bar", value: "Bar" },
      { type: "Pai", value: "Pai" },
    ];

    const groups = useGroups();
    const tempGroups = ref([] as Group[]);

    tempGroups.value.push({
      id: 1,
      sensors: [],
      groupDate: true,
      fromDate: null,
      toDate: null,
    });

    const addSensorToGroup = (sensor: Sensor, event: any) => {
      const newGroupNumber = parseInt(event.target.value);

      // Remove the sensor from the group it was in
      tempGroups.value[sensor.group - 1].sensors.splice(
        tempGroups.value[sensor.group - 1].sensors.indexOf(sensor),
        1
      );

      // Change the sensor object to contain right id
      sensor.group = newGroupNumber;

      // Check if group exits. If it exits add sensor to the group, if not create the group and add sensor
      if (tempGroups.value[newGroupNumber - 1] === undefined) {
        tempGroups.value.push({
          id: tempGroups.value.length + 1,
          sensors: [sensor],
          groupDate: true,
          fromDate: null,
          toDate: null,
        });
      } else {
        tempGroups.value[newGroupNumber - 1].sensors.push(sensor);
      }
    };

    watch(
      selectedSensors,
      (selectedSensors: Sensor[], prevSelectedSensors: Sensor[]) => {
        tempGroups.value[0].sensors = selectedSensors.filter(
          (sensor) => sensor.group == 1
        );
      },
      { deep: true }
    );

    const filterSensors = (sensor: Sensor) => {
      return selectedSensors.value
        .filter((s) => s.id != sensor.id)
        .map((s) => ({ value: s.id, label: s.sensorName }));
    };

    return {
      graphTypes,
      selectedSensors,
      filterSensors,
      tempGroups,
      addSensorToGroup,
    };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>