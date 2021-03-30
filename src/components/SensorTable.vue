<template>
  <div class="input-group searchgroup mb-3">
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

  <DataTable :id="'sensorTable'" :hoverable="true" :clickRows="true">
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
      >
        <td>{{ sensor.sensorName }}</td>
        <td>{{ sensor.description }}</td>
      </tr>
    </tbody>
  </DataTable>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li v-bind:class="activePage === 0 ? 'page-item disabled' : 'page-item'">
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
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import { Sensor } from "@/Interfaces/sensorInterface";
import { useTempGroups } from "@/composables/useGroups";
import DataTable from "@/components/reusable/DataTable.vue";

export default defineComponent({
  name: "SensorTable",
  components: { DataTable },
  props: ["sensorNames"],

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
      sensors.value = props.sensorNames.filter((s: Sensor) => searchFilter(s));

      const size = 10;
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
        tempGroups.value[sensor.group - 1].sensors.splice(
          tempGroups.value[sensor.group - 1].sensors.indexOf(sensor),
          1
        );
        sensor.group = 1;
      } else {
        activeRows.value.push(sensor.id);
        selectedSensors.value.push(sensor);
        tempGroups.value[0].sensors.push(sensor);
      }
    };

    return {
      selectedSensors,
      toggleSelectedSensor,
      activeRows,
      sensorPages,
      activePage,
      input,
      searchFilter,
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
</style>