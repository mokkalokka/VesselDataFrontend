<template>
  <div class="my-5 ">
    <div v-if="data.data.labels.length > 1">
      <Chart type="line" :data="data.data" />
      <Slider
        v-model="sliderValue"
        :step="1"
        :min="min"
        :max="max"
        :range="true"
      />
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
  name: "LineGraph",
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

      min.value = 0;
      max.value = sensorData.value[0].length - 1;
      sliderValue.value = [min.value, max.value];

      data.data = { ...data.data };
    };

    watchEffect(() => {
      //console.log(sliderValue.value);
      data.data.labels = time.value.slice(
        sliderValue.value[0],
        sliderValue.value[1]
      );
      data.data = { ...data.data };
    });

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
    };
  },
});
</script>

<style>
</style>