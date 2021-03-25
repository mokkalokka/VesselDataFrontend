<template>
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
      <AccordionBody :item="group">
        <h5 class="card-title">Instillinger for gruppen</h5>
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
        </DataTable>
        <h5 class="card-title">Instillinger for sensorene</h5>
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
                  @change="updateCurrentGroup(group)"
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
      </AccordionBody>
    </AccordionItem>
  </Accordion>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import { useTempGroups } from "@/composables/useGroups";
import { Sensor } from "@/Interfaces/sensorInterface";
import { Group } from "@/Interfaces/groupInterface";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import Accordion from "@/components/reusable/accordion/Accordion.vue";
import AccordionItem from "@/components/reusable/accordion/AccordionItem.vue";
import AccordionHeader from "@/components/reusable/accordion/AccordionHeader.vue";
import AccordionBody from "@/components/reusable/accordion/AccordionBody.vue";
import DataTable from "@/components/reusable/DataTable.vue";

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

    /**
     * Add selected sensor to seletced group.
     * @param {Sensor} sensor - The selected sensor.
     * @param {any} author - The event which is the new group number.
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
     * Update the the sensor time and date when the group date and time changes
     * @param {Group} group - The group the date and time changed in
     */
    const updateSensorsInGroup = (group: Group) => {
      group.sensors.map((sensor) => {
        sensor.fromDate = group.fromDate;
        sensor.fromTime = group.fromTime;
        sensor.toDate = group.toDate;
        sensor.toTime = group.toTime;
      });
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

    // Used for saving the current group because vueform multiselect would not let take it in as a parameter.
    const currentGroup = ref(null as Group);

    /**
     * Update the current group with the group that is being worked on
     * Needed because of reason mentioned above
     * @param {Group} group - The group used for setting the new current group
     */
    const updateCurrentGroup = (group) => {
      currentGroup.value = group;
    };

    /**
     * Removes the sensor selected for comparison from the group so that it dosent get rendered twice
     * @param {any} value - the sensor id
     */
    const removeSelectedSensorFromGroup = (value) => {
      currentGroup.value.sensors = currentGroup.value.sensors.filter(
        (s) => s.id != value
      );
    };

    /**
     * Add the sensor removed from comparison so that it gets rendered again
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
      updateSensorsInGroup,
      removeSelectedSensorFromGroup,
      addDeselectedSensorToGroup,
      updateCurrentGroup,
    };
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>