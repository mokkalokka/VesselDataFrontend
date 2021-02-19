<template>
  <div>
      <!-- <h1>SensorNames:</h1>
      <ul>
          <li v-for="(sensorName, index) in sensorNames" :key="index">
              {{sensorName}}
          </li>
          
      </ul> -->
      <h1 class="m-5">Selected sensors:</h1>
      <!-- <p>{{getSelectedSensors(['CommonVesselInfo.machinery.auxCons'])}}</p> -->
      <p>{{sensors}}</p>
      
      <h1>Error:</h1>
      <p>{{error}}</p>
      <h1>Loading:</h1>
      <p>{{fetching}}</p>
      
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { useSensorData } from "@/composables/useSensorData"

export default defineComponent({
    name: "ApiTest",
    setup(){
       /*  const data = ref('hello!') */
        const {sensors, sensorNames, error, fetching, fetchData} = useSensorData();
        
        fetchData()

        return{
            sensors,
            sensorNames,
            /* getSelectedSensors, */
            error, 
            fetching,
            
        }
    }

})
</script>

<style>

</style>