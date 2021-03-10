<template>
  <div class="card my-4">
    <div class="card-header bg-transparent">
        <div class="input-group searchgroup mb-3">
          <input
            type="text"
            class="form-control border-end-0"
            placeholder="Search Sensors..."
            aria-label="Sensor Name"
            aria-describedby="sensorsearch-addon"
            v-model="input"
          >
          <span class="input-group-text bg-transparent" id="sensorsearch-addon">
            <BIconSearch/>
          </span>
        </div>

      </div>
    <div class="table-responsive">
      <table id="sensorTable" class="table table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col"><button type="button" class="active sort-btn-hover btn bg-transparent shadow-0 border-0" @click="sort">Sensor Name <BIconArrowDownUp/></button></th>
            <th scope="col">Description</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
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
            <td>{{ sensor.startTime }}</td>
            <td>{{ sensor.endTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a
            class="page-link"
            aria-label="Previous"
            @click="activePage > 0 ? activePage-- : (activePage = activePage)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <div v-for="page in sensorPages" :key="sensorPages.indexOf(page)">
          <li class="page-item">
            <a
              class="page-link"
              href="#"
              @click.prevent="activePage = sensorPages.indexOf(page)"
              >{{ sensorPages.indexOf(page) + 1 }}</a
            >
          </li>
        </div>
        <li class="page-item">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click="
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
</template>

<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";

export default defineComponent({
  name: "SensorTable",
  props: ["sensorNames"],
  setup: (props) => {

    // array for selected sensors
    const selectedSensors = useSelectedSensors();

    //mutable sensor array
    const sensors = ref([] as []);

    // search string input
    const input = ref("" as string);

    // array for active (selected) rows in table
    const activeRows = ref([] as number[]);
    
    //2D-array containing pages of sensors for paginator 
    const sensorPages = ref([] as {}[][]);

    // number for which page in paginator is active
    const activePage = ref(0 as number);


    //filter-method
    const searchFilter = (sensor: any) => {
      const nameContains = sensor.sensorName.toLowerCase().includes(input.value.toLowerCase());
      const descriptionContains = sensor.description.toLowerCase().includes(input.value.toLowerCase());

      return nameContains || descriptionContains;

    };

    // method for dividing sensor array into pages array
    const fillPagesArray = () => {
      //console.log("Kjører fillpages");

      sensorPages.value.length = 0;
      sensors.value = props.sensorNames.filter((s: {}) => searchFilter(s));

      const size = 10;
      const subArrSize: number = Math.ceil(sensors.value.length / size);
      //console.log(subArrSize);
      for (let i = 0; i < subArrSize; i++) {
        const from: number = size * i;
        const to: number = size * (1 + i);
        const sliced: {}[] = sensors.value.slice(from, to);
        sensorPages.value.push(sliced);
      }

      activePage.value = 0
    };

    watchEffect(()  => {
      fillPagesArray();
    })

    // method for adding/removing sensor from active sensor array depending if clicked or unclicked
    const toggleSelectedSensor = (sensor: any) => {
      if (activeRows.value.includes(sensor.id)) {
        activeRows.value.splice(activeRows.value.indexOf(sensor.id), 1);
        selectedSensors.value.splice(activeRows.value.indexOf(sensor.id), 1);
      } else {
        activeRows.value.push(sensor.id);
        selectedSensors.value.push(sensor);
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

th button{
  font-weight: bold;
}

</style>