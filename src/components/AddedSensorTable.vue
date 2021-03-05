<template>
  <div class="card mt-4">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Sensor</th>
          <th>Dato fra</th>
          <th>Dato til</th>
          <th>Gruppe</th>
          <th>Graf nummer</th>
          <th>Graftype</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>sensor1</td>
          <td>dato1</td>
          <td>dato2</td>
          <td>gruppe 1</td>
          <td>graf nummer 1 {{selectedGraphType}}</td>
          <td>
            <select class="form-select" v-model="selectedGraphType">
              <option v-for="graphType in graphTypes" :key="graphType.value"> {{graphType.type}} </option>
            </select>
          </td>
        </tr>

        <!-- <tr v-for="vessel in vessels" :vessel="vessel" :key="vessel.name">
          <td v-show="filter(vessel)">
            <th scope="row" ><router-link :to="{  name: 'VesselData', params: { id: vessel.id } }">{{ vessel.name }}</router-link></th>
          </td>
        </tr>-->
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AddedSensorTable",

  setup: () => {
    const selectedGraphType = ref("Linje")
    const graphTypes = [
        { type: 'Linje', value: 'Linje' },
        { type: 'Bar', value: 'Bar' },
        { type: 'Pai', value: 'Pai' }
      ]

    return {selectedGraphType, graphTypes};
  },
});
</script>

<style lang="scss">
</style>