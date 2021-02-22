<template>
  <div class="container">
    <Chart type="line" :data="data.data" />
    <Slider
      v-model="sliderValue"
      :step="1"
      :min="getRange().min"
      :max="getRange().max"
      :range="true"
    />
    <button class="btn btn-primary m-3" @click="getData">Get data</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watchEffect } from "vue";
import { useSensorData } from "@/composables/useSensorData";

export interface Data {
  basicData: {
    labels: number[];
    datasets: [
      {
        label: string;
        data: number[] | null[];
        fill: boolean;
        borderColor: string;
      }
    ];
  };
}

interface SensorTypes{
    [key: string]: number[] | null[];
}

export default defineComponent({
  name: "LineGraph",

  setup() {
    const sensorId = 84
    const {getSensorsById, fetchData} = useSensorData();
    fetchData()

    const sensorData = ref([])
    const sliderValue = ref([0, 10]);

    
    
    const data = reactive({
      data: {
        labels: [1,2,3,4],
        datasets: [
          {
            label: "test",
            data: [1,2,3,4],
            fill: true,
            borderColor: "#42A5F5",
          },
        ],
      },
    } );


    const getData = () => {
      sensorData.value = getSensorsById([0, sensorId]) as any
      data.data.labels = sensorData.value[0]
      data.data.datasets[0].data = sensorData.value[1]
      data.data = {...data.data} 

    };

    const getRange = () => {
      return {
        min: Math.min(...data.data.labels),
        max: Math.max(...data.data.labels),
      };
    };

    watchEffect(() =>{
        console.log(sliderValue.value);
        console.log(data);
        
      /* sliderValue
      data.basicData.labels = json.time.slice(sliderValue.value[0], sliderValue.value[1])
      data.basicData = {...data.basicData} */
    })

    /* const addData = () => {
      data.basicData.datasets[0].data.push(Math.random());
      data.basicData.labels.push(data.basicData.labels.length);
      data.basicData = {...data.basicData}

      sliderValue.value[1] = data.basicData.labels.length -1
      console.log(data.basicData.labels);
    }; */

    /*    watch(() => value.value,
      (value, prevValue) => {
        data.basicData.labels = labels.value.slice(value[0], value[1])
        data.basicData.datasets[0].data = dataPoints.value.slice(value[0], value[1])
        console.log(dataPoints.value);
        console.log(labels.value);
        console.log(value);
        
        componentKey.value ++
    }) */

    return {
      data,
      getRange,
      sliderValue,
      getData
      

    };
  },
});
</script>

<style>
</style>