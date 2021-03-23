<template>
  <div class="card mt-4">
    <div class="accordion p-0 accordion-flush">
      <div
        class="accordion-item"
        v-for="group in tempGroups"
        :key="group.id"
        v-show="group.sensors.length != 0"
      >
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
            <div class="d-flex justify-content-center">
              <h5 text-center>Instillinger for gruppen</h5>
            </div>
            <div class="table-responsive">
              <table class="table m-0 table-bordered">
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
                        <label class="form-check-label"> Datovisning </label>
                      </div>
                    </td>
                    <td>
                      <input
                        type="date"
                        class="form-control"
                        v-model="group.fromDate"
                        :disabled="!group.groupDate"
                        :max="group.toDate"
                        @change="updateDate(group)"
                      />
                      <input
                        type="time"
                        class="form-control"
                        v-model="group.fromTime"
                        step="1"
                        :disabled="!group.groupDate"
                        :max="group.toTime"
                        @change="updateDate(group)"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        class="form-control"
                        v-model="group.toDate"
                        :disabled="!group.groupDate"
                        :min="group.fromDate"
                        @change="updateDate(group)"
                      />
                      <input
                        type="time"
                        class="form-control"
                        v-model="group.toTime"
                        step="1"
                        :disabled="!group.groupDate"
                        :min="group.fromTime"
                        @change="updateDate(group)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-center">
              <h5>Instillinger for sensorene</h5>
            </div>
            <div class="table-responsive">
              <table class="table m-0 table-bordered">
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
                          :selected="true ? sensor.group == group.id : false"
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
                        :options="filterSensors(sensor, group)"
                        @change="updateCurrent(group, sensor)"
                        @select="removeSelectedSensorFromGroup"
                        @deselect="addDeselectedSensorToGroup"
                      />
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
import { defineComponent, ref } from "vue";
import { useTempGroups } from "@/composables/useGroups";
import { Sensor } from "@/Interfaces/sensorInterface";
import { Group } from "@/Interfaces/groupInterface";
import { useSelectedSensors } from "@/composables/useSelectedSensors";

export default defineComponent({
  name: "AddedSensorTable",

  setup: () => {
    // selected sensors from SensorTable.
    const selectedSensors = useSelectedSensors();

    // Different graph rendering options.
    const graphTypes = [
      { type: "Linje", value: "Linje" },
      { type: "Bar", value: "Bar" },
      { type: "Pai", value: "Pai" },
    ];

    // temp groups for changing things and not effetcing the rendering at once.
    const tempGroups = useTempGroups();

    /**
     * Add selected sensor to seletced group.
     * @param {Sensor} sensor - The selected sensor.
     * @param {any} event - The event which is the new group number.
     */
    const addSensorToGroup = (sensor: Sensor, event: any) => {
      const newGroupNumber = parseInt(event.target.value);

      // Remove the sensor from the group it was in
      tempGroups.value[sensor.group - 1].sensors.splice(
        tempGroups.value[sensor.group - 1].sensors.indexOf(sensor),
        1
      );

      // Change the sensor object to contain right id
      sensor.group = newGroupNumber;

      // Change the group number for the sensor to compare with
      sensor.grahpsToCompare.map(
        (s) =>
          (selectedSensors.value.find((e) => e.id == s).group = newGroupNumber)
      );

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

    /**
     * Update the date for the group and the sensor when it changes in the group
     * @param {Group} group - The group the date and time changed in
     */
    const updateDate = (group: Group) => {
      group.sensors.map((sensor) => {
        sensor.fromDate = group.fromDate;
        sensor.fromTime = group.fromTime;
        sensor.toDate = group.toDate;
        sensor.toTime = group.toTime;
      });

      const fromYear = parseInt(group.fromDate.substring(0, 4));
      const fromMonth = parseInt(group.fromDate.substring(5, 7)) - 1;
      const fromDay = parseInt(group.fromDate.substring(8, 10));

      const fromHours = parseInt(group.fromTime.substring(0, 2));
      const fromMinutes = parseInt(group.fromTime.substring(3, 5));
      const fromSeconds = parseInt(group.fromTime.substring(6, 8));

      const toYear = parseInt(group.toDate.substring(0, 4));
      const toMonth = parseInt(group.toDate.substring(5, 7)) - 1;
      const toDay = parseInt(group.toDate.substring(8, 10));

      const toHours = parseInt(group.toTime.substring(0, 2));
      const toMinutes = parseInt(group.toTime.substring(3, 5));
      const toSeconds = parseInt(group.toTime.substring(6, 8));

      group.fromDateTime = new Date(
        fromYear,
        fromMonth,
        fromDay,
        fromHours,
        fromMinutes,
        fromSeconds
      );
      group.toDateTime = new Date(
        toYear,
        toMonth,
        toDay,
        toHours,
        toMinutes,
        toSeconds
      );
    };

    /**
     * Filters the sensors a current sensor can be compared with
     * @param {Sensor} sensor - The currenct sensor
     * @param {Group} group - The group used for only comparing sensors in the same group
     * @return {{}[]} Array of objects in a format that works with vueform multiselect
     */
    const filterSensors = (sensor: Sensor, group: Group): {}[] => {
      return selectedSensors.value
        .filter((s) => s.id != sensor.id && group.id == s.group) // array of sensors that is not the currenct sensor and in the same group
        .map((s) => ({ value: s.id, label: s.sensorName }));
    };

    // Used for saving the current group and sesnor because vueform multiselect would not let take it in as a parameter.
    const currentGroup = ref(null as Group);
    const currentSensor = ref(null as Sensor);

    /**
     * Update the current group with the group that is being worked on
     * Needed because of reason mentioned above
     * @param {Group} group - The group used for setting the new current group
     * @param {Sensor} senor - The group used for setting the new current group
     */
    const updateCurrent = (group: Group, sensor: Sensor) => {
      currentGroup.value = group;
      currentSensor.value = sensor;
    };

    /**
     * Removes the sensor selected for comparison from the group so that it dosent get rendered twice.
     * Also merges the two arrays of graphToCompare into the current sensor.
     * Runs on select in vueform multiselect.
     * @param {any} value - the sensor id
     */
    const removeSelectedSensorFromGroup = (value) => {
      const selectedSensor = selectedSensors.value.find((s) => s.id == value);

      // Creates a new array that contains all the sensors for comparison with set, so that duplicates get removed.
      currentSensor.value.grahpsToCompare = [
        ...new Set(
          selectedSensor.grahpsToCompare.concat(
            currentSensor.value.grahpsToCompare
          )
        ),
      ];
      selectedSensor.grahpsToCompare = [];

      currentGroup.value.sensors = currentGroup.value.sensors.filter(
        (s) => s.id != value
      );
    };

    /**
     * Add the sensor removed from comparison so that it gets rendered again.
     * Runs on deselect in vueform multiselect
     * @param {any} value - the sensor id
     */
    const addDeselectedSensorToGroup = (value) => {
      let contains = false as boolean;

      // check if the sensor already is in the group array.
      //So that we dont get duplicates if the same sensor is compared with multiple other sensors.
      for (let i = 0; i < currentGroup.value.sensors.length; i++) {
        if (currentGroup.value.sensors[i].id == value) {
          contains = true;
          break;
        }
      }
      // if not already in the array of sensors in the group, add it.
      if (!contains) {
        currentGroup.value.sensors.push(
          selectedSensors.value.filter((s) => s.id == value)[0]
        );
      }
    };

    return {
      graphTypes,
      filterSensors,
      tempGroups,
      addSensorToGroup,
      updateDate,
      removeSelectedSensorFromGroup,
      addDeselectedSensorToGroup,
      updateCurrent,
    };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>