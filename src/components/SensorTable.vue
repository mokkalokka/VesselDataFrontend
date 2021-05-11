<template>
  <div class="row">
    <div class="col-12 col-xxl-8 col-lg-6 my-lg-3">
      <div class="input-group searchgroup">
        <input
          type="text"
          class="form-control border-end-0"
          placeholder="Søk etter sensorer..."
          aria-label="Sensor Name"
          aria-describedby="sensorsearch-addon"
          v-model="input"
        />
        <span class="input-group-text bg-transparent" id="sensorsearch-addon">
          <BIconSearch />
        </span>
      </div>
    </div>
    <div class="col-6 col-xxl-2 col-lg-3 col-md-4 my-3 px-2 d-grid">
      <button
        type="button"
        class="btn btn-primary"
        @click="selectAllSensors"
        :disabled="selectedSensors.length === sensors.length"
      >
        Velg alle sensorer
      </button>
    </div>
    <div class="col-6 col-xxl-2 col-lg-3 col-md-4 my-3 px-2 d-grid">
      <button
        type="button"
        class="btn btn-primary"
        @click="clearSelectedSensors"
        :disabled="selectedSensors.length === 0"
      >
        Fjern valgte sensorer
      </button>
    </div>
  </div>

  <DataTable :id="'sensorTable'" :hoverable="true">
    <thead>
      <tr>
        <th scope="col">
          <button
            type="button"
            class="active sort-btn-hover btn bg-transparent shadow-0 border-0"
            @click="sort"
          >
            Sensornavn <BIconArrowDownUp />
          </button>
        </th>
        <th scope="col">Beskrivelse</th>
      </tr>
    </thead>
    <tbody
      data-link="row"
      class="rowlink"
      v-for="sensor in sensorPages[activePage]"
      :key="sensor.id"
    >
      <tr
        v-bind:id="sensor.id"
        @click="toggleSelectedSensor(sensor)"
        v-bind:class="{ 'table-active': activeRows.includes(sensor.id) }"
        tabindex="0"
        @keypress.enter="toggleSelectedSensor(sensor)"
      >
        <td>{{ sensor.sensorName }}</td>
        <td>{{ sensor.description }}</td>
      </tr>
    </tbody>
  </DataTable>

  <div class="row">
    <div class="col"></div>
    <div class="col">
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center mt-3">
          <li
            v-bind:class="activePage === 0 ? 'page-item disabled' : 'page-item'"
          >
            <a
              class="page-link"
              href="#"
              aria-label="Previous"
              @click.prevent="
                activePage > 0 ? activePage-- : (activePage = activePage)
              "
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <div v-for="page in sensorPages" :key="sensorPages.indexOf(page)">
            <li
              v-bind:class="
                sensorPages.indexOf(page) === activePage
                  ? 'page-item active'
                  : 'page-item'
              "
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="activePage = sensorPages.indexOf(page)"
                >{{ sensorPages.indexOf(page) + 1 }}</a
              >
            </li>
          </div>
          <li
            v-bind:class="
              activePage === sensorPages.length - 1
                ? 'page-item disabled'
                : 'page-item'
            "
          >
            <a
              class="page-link"
              href="#"
              aria-label="Next"
              @click.prevent="
                activePage < sensorPages.length - 1
                  ? activePage++
                  : (activePage = activePage)
              "
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="col my-auto">
      <div class="row">
        <div class="col d-flex justify-content-end my-auto">
          <label for="sensorsPerPageSelect">Sensorer per side:</label>
        </div>
        <div class="col d-flex justify-content-start">
          <select
            id="sensorsPerPageSelect"
            v-model.number="sensorsPerPage"
            class="form-select"
          >
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option :value="sensors.length">Vis alle</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import {
  useSelectedSensors,
  resetSelectedSensors,
} from "@/composables/useSelectedSensors";
import { Sensor } from "@/Interfaces/sensorInterface";
import { useTempGroups, resetTempGroups } from "@/composables/useGroups";
import DataTable from "@/components/reusable/DataTable.vue";

export default defineComponent({
  name: "SensorTable",
  props: ["sensors"],
  components: { DataTable },

  setup: (props) => {
    // array for selected sensors
    const selectedSensors = useSelectedSensors();

    //mutable sensor array
    const sensors = ref([] as Sensor[]);

    // search string input
    const input = ref("" as string);

    // array for active (selected) rows in sensor table
    const activeRows = ref([] as number[]);

    //2D-array containing pages of sensors for paginator
    const sensorPages = ref([] as Sensor[][]);

    // number for which page in paginator is active
    const activePage = ref(0 as number);

    // temporary groups for settings
    const tempGroups = useTempGroups();

    // sensors per page
    const sensorsPerPage = ref(10);

    /**
     * Method for filtering sensors
     * @param {Sensor} sensor - sensor to match filter string on (match on either name or description).
     * @returns {boolean} true if name, description or both match query
     */
    const searchFilter = (sensor: Sensor): boolean => {
      const nameContains: boolean = sensor.sensorName
        .toLowerCase()
        .includes(input.value.toLowerCase());
      const descriptionContains: boolean = sensor.description
        .toLowerCase()
        .includes(input.value.toLowerCase());

      return nameContains || descriptionContains;
    };

    /**
     * method for dividing sensor array into pages array for pagination
     */
    const fillPagesArray = () => {
      sensorPages.value.length = 0;
      sensors.value = props.sensors.filter((s: Sensor) => searchFilter(s));

      const size = sensorsPerPage.value;
      const subArrSize: number = Math.ceil(sensors.value.length / size);

      for (let i = 0; i < subArrSize; i++) {
        const from: number = size * i;
        const to: number = size * (1 + i);
        const sliced: Sensor[] = sensors.value.slice(from, to);
        sensorPages.value.push(sliced);
      }
      activePage.value = 0;
    };

    // to fill sensors in pagination-array when props have been loaded
    watchEffect(() => {
      fillPagesArray();
    });

    /**
     * method for adding/removing sensor from activeSensor-array, selectedSensors-array and tempGroups-array depending on if clicked or unclicked in GUI
     * @param {Sensor} sensor - sensor that is clicked in sensor table
     */
    const toggleSelectedSensor = (sensor: Sensor) => {
      if (activeRows.value.includes(sensor.id)) {
        activeRows.value.splice(activeRows.value.indexOf(sensor.id), 1);
        selectedSensors.value.splice(selectedSensors.value.indexOf(sensor), 1);

        // If the sensor is in the group remove it
        if (tempGroups.value[sensor.group - 1].sensors.includes(sensor)) {
          const indexOfSensor = tempGroups.value[
            sensor.group - 1
          ].sensors.indexOf(sensor);

          // Add the back the sensors to the group from the removed sensors sensorToCompare array
          sensor.sensorsToCompare.map((id) => {
            tempGroups.value[0].sensors.push(
              selectedSensors.value.find((s) => s.id == id)
            );
          });

          sensor.sensorsToCompare = [];

          tempGroups.value[sensor.group - 1].sensors.splice(indexOfSensor, 1);
        }
        // If the sensor is not in the group remove it from sensorsToCompare
        else {
          tempGroups.value[sensor.group - 1].sensors.map((s) => {
            const temp = new Set(s.sensorsToCompare);
            if (temp.has(sensor.id)) {
              temp.delete(sensor.id);
              s.sensorsToCompare = [...temp];
            }
          });
        }
        sensor.group = 1;
      } else {
        activeRows.value.push(sensor.id);
        selectedSensors.value.push(sensor);
        tempGroups.value[0].sensors.push(sensor);
      }
    };

    /**
     * Method for clearing all selected sensors
     */
    const clearSelectedSensors = () => {
      resetSelectedSensors();
      resetTempGroups();
      activeRows.value.length = 0;
    };

    /**
     * Method for selecting all sensors. If sensors are filtered, only matching sensors will be selected
     */
    const selectAllSensors = () => {
      clearSelectedSensors();
      sensorPages.value.map((p: Sensor[]) => {
        p.map((s: Sensor) => {
          toggleSelectedSensor(s);
        });
      });
    };

    return {
      selectedSensors,
      toggleSelectedSensor,
      activeRows,
      sensorPages,
      activePage,
      input,
      searchFilter,
      clearSelectedSensors,
      selectAllSensors,
      sensorsPerPage,
    };
  },
});
</script>


<style scoped lang="scss">
td:hover {
  cursor: pointer;
}

a:focus.page-link {
  border-color: dotted black;
}

a:hover.page-link {
  cursor: pointer;
}

th button {
  font-weight: bold;
}

tbody tr:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(160, 208, 255);
}
</style>