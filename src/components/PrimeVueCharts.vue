<template>
  <div class="my-5 ">
    <div v-if="data.data.labels.length > 1">
      <Chart type="line" :data="data.data" />

      <Slider
        @mouseup="changeInterval"
        class="mx-2"
        v-model="sliderValue"
        :step="1"
        :min="min"
        :max="max"
        :range="true"
      />
      
      <div class="p-d-flex p-jc-center graphSearch p-3">
            <div class="p-3"><InputText v-on:keyup.enter="changeInterval" v-model="sliderValue[0]" /></div>
            <div class="p-3"><InputText v-on:keyup.enter="changeInterval" v-model="sliderValue[1]" /></div>
            <div class="p-3"><button @click="changeInterval" class="btn btn-primary">Update interval</button> </div>
            <!-- <Calendar 
            v-model="sliderTime[0]" 
            id="min"
            :showTime="true" 
            :timeOnly="true"
            :minDate="minTime" 
            :maxDate="maxTime"
            :showSeconds="true" />

        
            <Calendar 
            v-model="sliderTime[1]" 
            id="max"
            :showTime="true" 
            :timeOnly="true" 
            :showSeconds="true"
            :minDate="minTime" 
            :maxDate="maxTime"/> -->
            
        </div>
    </div>
  </div>
  
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watchEffect } from "vue";
import { useSensorData } from "@/composables/useSensorData";

export interface Data {
  data: {
    labels: string[];
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

interface SensorTypes {
  [key: string]: number[] | null[];
}

export default defineComponent({
  name: "PrimeVueCharts",
  props: {
    sensorName: {
      type: String,
      required: true,
    },
    sensorId: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const { fetching, getSensorDataById, fetchData } = useSensorData();
    const sensorData = ref([[], []] as [string[], number[]]);
    const sliderValue = ref([0, 1]);
    const min = ref(0);
    const max = ref(1);
    const time = ref([] as string[]);
    const sliderTime = ref([new Date, new Date])
    /* const minTime = ref(new Date)
    const maxTime = ref(new Date) */

    const data = reactive({
      data: {
        labels: [],
        datasets: [
          {
            label: props.sensorName,
            data: [],
            fill: true,
            borderColor: "#42A5F5",
          },
        ],
      },
    } as Data);

    const getData = () => {
      sensorData.value = getSensorDataById([props.sensorId]) as [
        string[],
        number[]
      ];

      time.value = sensorData.value[0].map((e) => {
        const date = new Date(parseInt(String(e))).toLocaleTimeString();
        //console.log(date);
        return date;
      });
      data.data.labels = time.value;

      data.data.datasets[0].data = sensorData.value[1];

      min.value = 0 ;
      max.value = sensorData.value[0].length - 1;
      sliderValue.value = [min.value, max.value];
      sliderTime.value = [
        new Date(parseInt(String(sensorData.value[0][0]))),
        new Date(parseInt(String(sensorData.value[0][sensorData.value[0].length - 1])))]
      
      /* minTime.value = sliderTime.value[0]
      maxTime.value = sliderTime.value[1] */

      data.data = { ...data.data };
    };

/*     watchEffect(() => {
      //console.log(sliderValue.value);
      data.data.labels = time.value.slice(
        sliderValue.value[0],
        sliderValue.value[1]
      );
      data.data = { ...data.data };
    }); */


    const changeInterval = () =>{
        console.log("slider has changed!");
        
        data.data.labels = time.value.slice(
        sliderValue.value[0],
        sliderValue.value[1]
      );
      data.data = { ...data.data };
    }

    const onTimeChange = () =>{
     /*  const tempTime = parseInt((sliderTime.value[0].getTime() / 1000).toFixed(0)) + "778"
      console.log(tempTime);
      console.log(sensorData.value[0][1]);
      console.log(sensorData.value[0].indexOf(tempTime)); */
      
    }

    onMounted(() => {
      //console.log(props.sensorId);
      //console.log("Kjører");

      fetchData().then(() => {
        getData();
      });
    });

    return {
      data,
      sliderValue,
      getData,
      min,
      max,
      fetching,
      changeInterval,
      sliderTime,
      onTimeChange
    };
  },
});
</script>

<style>
</style>