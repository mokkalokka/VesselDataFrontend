<template>
  <div class="card">
    <!-- <table class="table table-striped table-bordered table-hover">
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
              awdawdawdadth scope="row"><a href="#awdawdawd" class="stretched-link">wadwawad</a></th> 
            <th scope="row" ><router-link class="strecthed-link" :to="{  name: 'VesselData', params: { id: vessel.id } }">{{ vessel.name }}</router-link></th>
          </td>
        </tr>
      </tbody>
    </table> -->

    <DataTable
      :value="vessels"
      v-model:selection="selectedVessel"
      selectionMode="single"
      dataKey="id"
      filterDisplay="menu"
      @row-select="onRowSelect"
      :filters="filters"
    >
      <template #header>
        <div class="p-d-flex p-ai-center p-jc-between">
          <h5 class="p-m-0">Vessels</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['name']" placeholder="Vessel name" />
          </span>
        </div>
      </template>

      <Column
        field="name"
        header="Name"
        sortable
        filterMatchMode="contains"
      ></Column>
    </DataTable>
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
    const filters = ref({
      name: "",
    });
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

    function onRowSelect() {
      router.push({
        name: "VesselData",
        params: { id: selectedVessel.value.id },
      });
    }

    return {
      selectedVessel,
      filters,
      onRowSelect,
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