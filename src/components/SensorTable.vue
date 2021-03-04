<template>
  <div class="card my-4">
    <div class="table table-responsive">
      <table id="sensorTable" class="table table-bordered table-hover">
        <thead>
          <tr class="table-secondary">
            <th scope="col">Sensor Name</th>
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
              @click="activePage = sensorPages.indexOf(page)"
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
import { defineComponent, ref, watch } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";

export default defineComponent({
  name: "SensorTable",
  props: ["sensorNames"],
  setup: (props) => {
    const sensorFilters = ref({
      sensorName: "",
    });
    const selectedSensors = useSelectedSensors();

    const activeRows = ref([] as number[]);
    const sensorPages = ref([] as {}[][]);
    const activePage = ref(0 as number);

    const fillPagesArray = () => {
      //console.log("Kjører fillpages");

      const sensors = ref(props.sensorNames as []);
      const size = 10;
      const subArrSize: number = Math.ceil(sensors.value.length / size);
      console.log(subArrSize);
      for (let i = 0; i < subArrSize; i++) {
        const from: number = size * i;
        const to: number = size * (1 + i);
        const sliced: {}[] = sensors.value.slice(from, to);
        sensorPages.value.push(sliced);
      }
    };

    watch(
      () => props.sensorNames,
      (sensorPages) => {
        sensorPages.value = fillPagesArray();
        console.log(activePage.value);
      }
    );

    const toggleSelectedSensor = (sensor: any) => {
      if (activeRows.value.includes(sensor.id)) {
        activeRows.value.splice(activeRows.value.indexOf(sensor.id), 1);
        selectedSensors.value.splice(activeRows.value.indexOf(sensor.id), 1);
      } else {
        activeRows.value.push(sensor.id);
        selectedSensors.value.push(sensor);
      }
    };

    const clearFilter = () => {
      sensorFilters.value["sensorName"] = "";
    };

    return {
      selectedSensors,
      sensorFilters,
      clearFilter,
      toggleSelectedSensor,
      activeRows,
      sensorPages,
      activePage,
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
</style>