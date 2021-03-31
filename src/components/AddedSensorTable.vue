<template>
  <div class="d-flex justify-content-center">
    <h2>Valgte sensorer</h2>
  </div>
  <form @submit.prevent="setSensorsToRender" id="form">
    <Accordion>
      <AccordionItem
        v-for="group in tempGroups"
        :key="group.id"
        v-show="group.sensors.length != 0"
      >
        <AccordionHeader
          :item="group"
          :headerId="group.id"
          :tabHeader="'Gruppe'"
        />
        <AccordionBody :item="group" :multiCollapse="false">
          <div class="d-flex justify-content-center">
            <h5 class="my-3" text-center>Instillinger for gruppen</h5>
          </div>
          <DataTable :id="'groupSettingsTable'" :hoverable="false">
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
                      :disabled="group.sensors.length == 1"
                    />
                    <label class="form-check-label"> Datovisning </label>
                  </div>
                  <!-- <ToggleButton
                          :id="'formCheckShowDate' + group.id"
                          :checkedValue="true"
                          :click="toggleDate(group)"
                        >
                          Datovisning
                        </ToggleButton> -->
                </td>
                <td>
                  <input
                    type="date"
                    class="form-control"
                    v-model="group.fromDate"
                    :disabled="!group.groupDate"
                    :max="group.toDate"
                    @change="
                      updateGroupSensorsDateTime(group);
                      validateGroupTime(group);
                      checkIfValidInput();
                    "
                    :required="group.groupDate"
                  />
                  <input
                    type="time"
                    :id="'groupFromTime' + group.id"
                    class="form-control"
                    v-model="group.fromTime"
                    step="1"
                    :disabled="!group.groupDate"
                    :max="group.fromDate == group.toDate ? group.toTime : ''"
                    @blur="
                      updateGroupSensorsDateTime(group);
                      validateGroupTime(group);
                      checkIfValidInput();
                    "
                    :required="group.groupDate"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    class="form-control"
                    v-model="group.toDate"
                    :disabled="!group.groupDate"
                    :min="group.fromDate"
                    @change="
                      updateGroupSensorsDateTime(group);
                      validateGroupTime(group);
                      checkIfValidInput();
                    "
                    :required="group.groupDate"
                  />
                  <input
                    type="time"
                    :id="'groupToTime' + group.id"
                    class="form-control"
                    v-model="group.toTime"
                    step="1"
                    :disabled="!group.groupDate"
                    :min="group.fromDate == group.toDate ? group.fromTime : ''"
                    @blur="
                      updateGroupSensorsDateTime(group);
                      validateGroupTime(group);
                      checkIfValidInput();
                    "
                    :required="group.groupDate"
                  />
                </td>
              </tr>
            </tbody>
          </DataTable>
          <!-- </table>
              </div> -->
          <div class="d-flex justify-content-center">
            <h5 class="my-3" text-center>Instillinger for sensorene</h5>
          </div>
          <!-- <div class="table-responsive">
                <table class="table m-0 table-bordered"> -->
          <DataTable :id="'sensorSettingsTable'" :hoverable="false">
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
                    :required="!group.groupDate"
                    @change="
                      updateDateTime(sensor);
                      checkIfValidInput();
                      validateSensorTime(sensor);
                    "
                  />
                  <input
                    type="time"
                    :id="'sensorFromTime' + sensor.id"
                    class="form-control"
                    v-model="sensor.fromTime"
                    step="1"
                    :disabled="group.groupDate"
                    :max="sensor.fromDate == sensor.toDate ? sensor.toTime : ''"
                    :required="!group.groupDate"
                    @blur="
                      updateDateTime(sensor);
                      checkIfValidInput();
                      validateSensorTime(sensor);
                    "
                  />
                </td>
                <td>
                  <input
                    type="date"
                    class="form-control"
                    v-model="sensor.toDate"
                    :disabled="group.groupDate"
                    :min="sensor.fromDate"
                    :required="!group.groupDate"
                    @change="
                      updateDateTime(sensor);
                      checkIfValidInput();
                      validateSensorTime(sensor);
                    "
                  />
                  <input
                    type="time"
                    :id="'sensorToTime' + sensor.id"
                    class="form-control"
                    v-model="sensor.toTime"
                    step="1"
                    :disabled="group.groupDate"
                    :min="
                      sensor.fromDate == sensor.toDate ? sensor.fromTime : ''
                    "
                    :required="!group.groupDate"
                    @blur="
                      updateDateTime(sensor);
                      checkIfValidInput();
                      validateSensorTime(sensor);
                    "
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
                    v-model="sensor.sensorsToCompare"
                    :options="filterSensors(sensor, group)"
                    @change="updateCurrent(sensor, group)"
                    @input="addAllDeselectedSensorsToGroup"
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
          </DataTable>
          <!-- </table>
              </div> -->
        </AccordionBody>
        <!-- </div>
          </div> -->
      </AccordionItem>
    </Accordion>
    <div class="d-flex justify-content-center mt-4">
      <button
        type="submit"
        class="btn btn-outline-primary"
        :data-bs-target="isInputsValid ? '.multi-collapse' : ''"
        :data-bs-toggle="isInputsValid ? 'collapse' : ''"
        :aria-controls="
          isInputsValid ? 'sensorTableCollapse graphCollapse' : ''
        "
      >
        Vis grafer
      </button>
    </div>
  </form>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import { useGroups, useTempGroups } from "@/composables/useGroups";
import { Sensor } from "@/Interfaces/sensorInterface";
import { Group } from "@/Interfaces/groupInterface";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import lodash from "lodash";
import Accordion from "@/components/reusable/accordion/Accordion.vue";
import AccordionItem from "@/components/reusable/accordion/AccordionItem.vue";
import AccordionHeader from "@/components/reusable/accordion/AccordionHeader.vue";
import AccordionBody from "@/components/reusable/accordion/AccordionBody.vue";
import DataTable from "@/components/reusable/DataTable.vue";
//import ToggleButton from '@/components/reusable/ToggleButton.vue';

export default defineComponent({
  name: "AddedSensorTable",
  components: {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
    DataTable,
  },

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

    // array of groups to render graphs in
    const groups = useGroups();

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
      sensor.sensorsToCompare.map(
        (s) =>
          (selectedSensors.value.find((e) => e.id == s).group = newGroupNumber)
      );

      // Check if group exits. If it exits add sensor to the group, if not create the group and add sensor
      if (tempGroups.value[newGroupNumber - 1] === undefined) {
        tempGroups.value.push({
          id: tempGroups.value.length + 1,
          sensors: [sensor],
          groupDate: true,
          fromDate: sensor.fromDateTime.toISOString().slice(0, 10),
          fromTime: sensor.fromDateTime.toLocaleTimeString("en-GB"),
          toDate: sensor.toDateTime.toISOString().slice(0, 10),
          toTime: sensor.toDateTime.toLocaleTimeString("en-GB"),
          fromDateTime: sensor.fromDateTime,
          toDateTime: sensor.toDateTime,
        });
      } else {
        tempGroups.value[newGroupNumber - 1].sensors.push(sensor);
      }
    };
    /**
     * Updates the datetime attribute for either the sensor or the group
     */
    const updateDateTime = (object: Sensor | Group) => {
      const fromYear = parseInt(object.fromDate.substring(0, 4));
      const fromMonth = parseInt(object.fromDate.substring(5, 7)) - 1;
      const fromDay = parseInt(object.fromDate.substring(8, 10));

      const fromHours = parseInt(object.fromTime.substring(0, 2));
      const fromMinutes = parseInt(object.fromTime.substring(3, 5));
      const fromSeconds = parseInt(object.fromTime.substring(6, 8));

      const toYear = parseInt(object.toDate.substring(0, 4));
      const toMonth = parseInt(object.toDate.substring(5, 7)) - 1;
      const toDay = parseInt(object.toDate.substring(8, 10));

      const toHours = parseInt(object.toTime.substring(0, 2));
      const toMinutes = parseInt(object.toTime.substring(3, 5));
      const toSeconds = parseInt(object.toTime.substring(6, 8));

      object.fromDateTime = new Date(
        fromYear,
        fromMonth,
        fromDay,
        fromHours,
        fromMinutes,
        fromSeconds
      );
      object.toDateTime = new Date(
        toYear,
        toMonth,
        toDay,
        toHours,
        toMinutes,
        toSeconds
      );
    };

    /**
     * Update the date for the group and the sensor when it changes in the group
     * @param {Group} group - The group the date and time changed in
     */
    const updateGroupSensorsDateTime = (group: Group) => {
      group.sensors.map((sensor) => {
        sensor.fromDate = group.fromDate;
        sensor.fromTime = group.fromTime;
        sensor.toDate = group.toDate;
        sensor.toTime = group.toTime;
        updateDateTime(sensor);
      });
      updateDateTime(group);
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
     * @param {Sensor} senor - The group used for setting the new current group
     * @param {Group} group - The group used for setting the new current group
     */
    const updateCurrent = (sensor: Sensor, group: Group) => {
      currentGroup.value = group;
      currentSensor.value = sensor;
    };

    /**
     * Removes the sensor selected for comparison from the group so that it dosent get rendered twice.
     * Also merges the two arrays of graphToCompare into the current sensor.
     * Runs on select in vueform multiselect.
     * @param {number} value - the sensor id deselected for comparison
     */
    const removeSelectedSensorFromGroup = (value: number) => {
      const selectedSensor = selectedSensors.value.find((s) => s.id == value);

      // Creates a new array that contains all the sensors for comparison with set, so that duplicates get removed.
      currentSensor.value.sensorsToCompare = [
        ...new Set(
          selectedSensor.sensorsToCompare.concat(
            currentSensor.value.sensorsToCompare
          )
        ),
      ];
      selectedSensor.sensorsToCompare = [];

      currentGroup.value.sensors = currentGroup.value.sensors.filter(
        (s) => s.id != value
      );
    };

    /**
     * Add the sensor removed from comparison back to the group.
     * Runs on deselect in vueform multiselect
     * @param {number} value - the sensor id selected for comparison
     */
    const addDeselectedSensorToGroup = (value: number) => {
      let contains = false as boolean;

      // check if the sensor already is in the group array.
      //So that we dont get duplicates if the same sensor is compared with multiple other sensors.
      if (
        currentGroup.value.sensors.some(
          (s) =>
            s.id == value ||
            (s.sensorsToCompare.includes(value) &&
              s.id != currentSensor.value.id)
        )
      ) {
        contains = true;
      }
      // if not already in the array of sensors in the group, add it.
      if (!contains) {
        currentGroup.value.sensors.push(
          selectedSensors.value.filter((s) => s.id == value)[0]
        );
      }
    };

    /**
     * Adds the all the deselected sensors from comparsion back to the group.
     * Runs on input on multiselect, but runs only when every sensor is removed at once
     * @param {[]} value - array of sensors ids selected or deselected for comparsion
     */
    const addAllDeselectedSensorsToGroup = (value: number[]) => {
      if (value.length == 0) {
        currentSensor.value.sensorsToCompare.map((id) => {
          addDeselectedSensorToGroup(id);
        });
      }
    };

    // Used for storing if the inputs are valid or not
    const isInputsValid = ref(true);

    /**
     * Checks if the time is equal for the group
     */
    const validateGroupTime = (group: Group) => {
      const groupFromTime = document.getElementById(
        "groupFromTime" + group.id
      ) as HTMLFormElement;
      const groupToTime = document.getElementById(
        "groupToTime" + group.id
      ) as HTMLFormElement;

      if (group.toTime == group.fromTime && group.toDate == group.fromDate) {
        groupFromTime.setCustomValidity(
          "Tiden kan ikke være den samme i begge felt når det er samme dato"
        );
        groupToTime.setCustomValidity(
          "Tiden kan ikke være den samme i begge felt når det er samme dato"
        );
      } else {
        groupFromTime.setCustomValidity("");
        groupToTime.setCustomValidity("");
      }
    };

    /**
     * Checks if the time is equal for the sensor.
     */
    const validateSensorTime = (sensor: Sensor) => {
      const sensorFromTime = document.getElementById(
        "sensorFromTime" + sensor.id
      ) as HTMLFormElement;
      const sensorToTime = document.getElementById(
        "sensorToTime" + sensor.id
      ) as HTMLFormElement;

      if (
        sensor.toTime == sensor.fromTime &&
        sensor.toDate == sensor.fromDate
      ) {
        sensorFromTime.setCustomValidity(
          "Tiden kan ikke være den samme i begge felt når det er samme dato"
        );
        sensorToTime.setCustomValidity(
          "Tiden kan ikke være den samme i begge felt når det er samme dato"
        );
      } else {
        sensorFromTime.setCustomValidity("");
        sensorToTime.setCustomValidity("");
      }
    };

    /**
     * Checks if all the form inputs are valid.
     */
    const checkIfValidInput = () => {
      const form = document.getElementById("form") as HTMLFormElement;
      if (form.checkValidity()) {
        isInputsValid.value = true;
      } else {
        isInputsValid.value = false;
      }
    };

    /**
     * Takes the sensors and group settings from tempGroups and set it equal to groups.
     */
    const setSensorsToRender = () => {
      groups.value = lodash.cloneDeep(tempGroups.value);
    };

    const toggleDate = (group: Group) => {
      if (group.groupDate) {
        group.groupDate = false;
      } else {
        group.groupDate = true;
      }
    };

    return {
      graphTypes,
      filterSensors,
      tempGroups,
      addSensorToGroup,
      updateGroupSensorsDateTime,
      updateDateTime,
      removeSelectedSensorFromGroup,
      addDeselectedSensorToGroup,
      updateCurrent,
      addAllDeselectedSensorsToGroup,
      setSensorsToRender,
      checkIfValidInput,
      isInputsValid,
      validateGroupTime,
      validateSensorTime,
      toggleDate,
    };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>