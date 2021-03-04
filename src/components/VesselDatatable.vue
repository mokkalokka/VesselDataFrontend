<template>
  <div class="card mt-4">
    
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>
            <div class="row">
            <div class="col-md-9 order-1 order-md-0"><button type="button" class="btn btn-outline-primary" @click="sort">Navn <BIconArrowDownUp/> </button> </div>
            <div class="col-md-3 mb-2 mb-md-0">
              <input type="text" class="form-control" placeholder="Fartøy navn" v-model="input">
            </div>
            </div>
          </th>
        </tr> 
      </thead>
      <tbody>
        <tr v-for="vessel in vessels" :vessel="vessel" :key="vessel.name">
          <td v-show="filter(vessel)">
            <th scope="row" ><router-link :to="{  name: 'VesselData', params: { id: vessel.id } }">{{ vessel.name }}</router-link></th>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useFetch } from "@/composables/useFetch";

export default defineComponent({
  name: "VesselDataTable",

  setup: () => {
    const vessels = ref([] as Vessel[]);
    const selectedVessel = ref({} as Vessel);
    const input = ref("" as string);

    const { response, fetchData } = useFetch("http://localhost:3000/vessels");

    fetchData().then(() => {
      vessels.value = response.value;
    });

    const filter = (vessel: Vessel) => {
      return vessel.name.toLowerCase().includes(input.value.toLowerCase());
    };

    const sort = () => {
      vessels.value = vessels.value.reverse();
    };

    return {
      selectedVessel,
      vessels,
      input,
      sort,
      filter,
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
</style>