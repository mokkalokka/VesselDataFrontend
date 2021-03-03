<template>
  <div class="card">
    
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>
            <div class="row">
            <div class="col">Name </div>
            <div class="col"><button type="button" class="btn btn-primary" @click="sort">sort</button></div>
            <div class="col"><input type="text" class="form-control" placeholder="Vessel name" v-model="input"></div>
            </div>
            </th>
            
        </tr>
      </thead>
      <tbody>
        <tr v-for="vessel in vessels" :vessel="vessel" :key="vessel.name">
          <td v-show="filter(vessel)">
              <!-- <th scope="row"><a href="#awdawdawd" class="stretched-link">wadwawad</a> </th> -->
            <th scope="row" ><router-link :to="{  name: 'VesselData', params: { id: vessel.id } }">{{ vessel.name }}</router-link></th>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { defineComponent, ref } from "vue";
import { useFetch } from "@/composables/useFetch";

export default defineComponent({
  name: "VesselDataTable",

  setup: () => {
    const vessels = ref([] as Vessel[]);
    const selectedVessel = ref({} as Vessel);
    const input = ref("" as string);

    const { response, error, fetching, fetchData } = useFetch(
      "http://localhost:3000/vessels"
    );
    
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
.card {
  margin: 20px;
}
</style>