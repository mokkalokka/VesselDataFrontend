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
                              Datovisning
                            </label>
                          </div>
                        </td>
                        <td>
                          <input
                            type="date"
                            class="form-control"
                            v-model="group.fromDate"
                            :disabled="!group.groupDate"
                            :max="group.toDate"
                            @change="updateSensorsInGroup(group)"
                          />
                          <input
                            type="time"
                            class="form-control"
                            v-model="group.fromTime"
                            step="1"
                            :disabled="!group.groupDate"
                            :max="group.toTime"
                            @change="updateSensorsInGroup(group)"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            class="form-control"
                            v-model="group.toDate"
                            :disabled="!group.groupDate"
                            :min="group.fromDate"
                            @change="updateSensorsInGroup(group)"
                          />
                          <input
                            type="time"
                            class="form-control"
                            v-model="group.toTime"
                            step="1"
                            :disabled="!group.groupDate"
                            :min="group.fromTime"
                            @change="updateSensorsInGroup(group)"
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
                      <tr v-for="sensor in group.sensors" :key="sensor.id">
                        <td>{{ sensor.sensorName }}</td>
                        <td>
                          <input
                            type="date"
                            class="form-control"
                            v-model="sensor.fromDate"
                            :disabled="group.groupDate"
                            :max="sensor.toDate"
                          />
                          <input
                            type="time"
                            class="form-control"
                            v-model="sensor.fromTime"
                            step="1"
                            :disabled="group.groupDate"
                            :max="sensor.fromTime"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            class="form-control"
                            v-model="sensor.toDate"
                            :disabled="group.groupDate"
                            :min="sensor.toDate"
                          />
                          <input
                            type="time"
                            class="form-control"
                            v-model="sensor.toTime"
                            step="1"
                            :disabled="group.groupDate"
                            :min="sensor.toTime"
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
import { defineComponent, watch } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import { useTempGroups } from "@/composables/useGroups";
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

    const tempGroups = useTempGroups();

    if (tempGroups.value.length === 0) {
      const currentDate = new Date();
      tempGroups.value.push({
        id: 1,
        sensors: [],
        groupDate: true,
        fromDate: currentDate.toISOString().slice(0, 10),
        fromTime: currentDate.toLocaleTimeString("en-GB"),
        toDate: currentDate.toISOString().slice(0, 10),
        toTime: currentDate.toLocaleTimeString("en-GB"),
        fromDateTime: currentDate,
        toDateTime: currentDate,
      });
    }

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
          fromDate: sensor.startTime.toISOString().slice(0, 10),
          fromTime: sensor.startTime.toLocaleTimeString("en-GB"),
          toDate: sensor.endTime.toISOString().slice(0, 10),
          toTime: sensor.endTime.toLocaleTimeString("en-GB"),
          fromDateTime: sensor.startTime,
          toDateTime: sensor.endTime,
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

    const updateSensorsInGroup = (group: Group) => {
      group.sensors.map((sensor) => {
        sensor.fromDate = group.fromDate;
        sensor.fromTime = group.fromTime;
        sensor.toDate = group.toDate;
        sensor.toTime = group.toTime;
      });
    };

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
      updateSensorsInGroup,
    };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>