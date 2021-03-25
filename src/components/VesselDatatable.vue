<template>
  <div class="card mt-4">
    <div class="card-header bg-transparent shadow-0 border-0">
      <div class="row">
        <div class="col-md-9 order-1 order-md-0">
          <button type="button" class="btn btn-outline-primary" @click="sort">
            Navn <BIconArrowDownUp />
          </button>
        </div>
        <div class="col-md-3 mb-2 mb-md-0">
          <input
            type="text"
            class="form-control"
            placeholder="Fartøy navn"
            v-model="input"
          />
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <div
        class="row py-2 boatrow border-top"
        v-for="vessel in vessels"
        :vessel="vessel"
        :key="vessel.name"
        v-show="filter(vessel)"
        @click="routeToVessel(vessel)"
      >
        <div class="col">
          {{ vessel.name }}
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="card mt-4">
    <table class="table m-0 table-bordered table-hover">
      <thead>
        <tr>
          <th>
            <div class="row">
              <div class="col-md-9 order-1 order-md-0">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="sort"
                >
                  Navn <BIconArrowDownUp />
                </button>
              </div>
              <div class="col-md-3 mb-2 mb-md-0">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Fartøy navn"
                  v-model="input"
                />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody data-link="row" class="rowlink">
        <tr v-for="vessel in vessels" :vessel="vessel" :key="vessel.name">
          <td
            scope="row"
            v-show="filter(vessel)"
            @click="routeToVessel(vessel)"
          >
            {{ vessel.name }}
          </td>
        </tr>
      </tbody>
    </table>
  </div> -->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import router from "@/router";

export default defineComponent({
  name: "VesselDataTable",

  setup: () => {
    const vessels = ref([] as Vessel[]);

    // Used for searching the vessels
    const input = ref("" as string);

    const { response, fetchData } = useFetch("http://localhost:3000/vessels");

    fetchData().then(() => {
      vessels.value = response.value;
    });

    /**
     * Checks if the input is in the vessel name
     * @param {Vessel} vessel - The vessel
     * @return {boolean} true or false depending on if the input is in the vessel name
     */
    const filter = (vessel: Vessel): boolean => {
      return vessel.name.toLowerCase().includes(input.value.toLowerCase());
    };

    /**
     * Reverses the array of vessels
     */
    const sort = () => {
      vessels.value = vessels.value.reverse();
    };

    /**
     * Pushes to the clicked vessel
     * @param {Vessel} vessel - The clicked vessel
     */
    const routeToVessel = (vessel: Vessel) => {
      router.push({ name: "VesselData", params: { id: vessel.id } });
    };

    return {
      vessels,
      input,
      sort,
      filter,
      routeToVessel,
    };
  },
});

interface Vessel {
  name: string;
  id: number;
}
</script>

<style lang="scss">
a {
  text-decoration: none;
  color: black;
  font-weight: 400;
}

.boatrow {
  font-size: 20px;
}

.boatrow:hover {
  cursor: pointer;
  background-color: rgb(224, 224, 224);
  border-radius: 5px;
}
</style>