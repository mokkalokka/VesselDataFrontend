<template>
  <div class="card p-2 pb-4 shadow-sm h-100">
    <div id="wrapper" class="h-100" v-if="sensorData[0].data.length > 2">
      <div
        :key="showStatistics"
        id="chart-line2"
        v-bind:class="{ 'h-100': !showTimeLine, 'h-75': showTimeLine }"
      >
        <apexchart
          type="line"
          height="100%"
          :options="chartOptions"
          :series="sensorData"
        ></apexchart>
      </div>
      <div v-if="showTimeLine" id="chart-line" class="h-25">
        <apexchart
          type="area"
          height="100%"
          :options="chartOptionsLine"
          :series="sensorData"
        ></apexchart>
      </div>
      <div class="container">
        <div class="row ">
          <div
            class="form-check form-switch col d-flex justify-content-center"
          >
            <input
              @click="toggleStatistics"
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">
              Show Statistics</label
            >
          </div>
          <div
            class="form-check form-switch col d-flex justify-content-center"
          >
            <input
              checked
              @click="toggleTimeLine"
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">
              Show Timeline</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSensorData } from "@/composables/useSensorData";
import { ref } from "vue";
import { std, mean, max, min } from "mathjs";

export default {
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
    const { getSensorDataById, fetchData } = useSensorData();
    const res = ref([[], []]);
    const sensorData = ref([{ data: [[], []] }]);
    const showTimeLine = ref(true);
    const showStatistics = ref(false);
    let maxVal = 0;
    let minVal = 0;
    let avarage = 0;
    let stdDeviation = 0;

    const chartOptions = ref({
      chart: {
        id: "chart" + props.sensorId + "1",
        type: "line",
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
        animations: {
         enabled: false
         },
      },
       
      stroke: {
        width: 1,
      },
      title: {
        text: props.sensorName,
        align: "center",
      },

      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
        tickAmount: 15,
      },
      yaxis: {
        tickAmount: 4,
        decimalsInFloat: 2,
      },
    });
    const chartOptionsLine = ref({
      chart: {
        id: "chart" + props.sensorId + "2",
        /* height: 100, */
        type: "area",
        brush: {
          target: "chart" + props.sensorId + "1",
          enabled: true,
        },
        selection: {
          enabled: true,
        },
      },
      colors: ["#008FFB"],
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.91,
          opacityTo: 0.1,
        },
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        tickAmount: 2,
        decimalsInFloat: 2,
      },
    });

    fetchData().then(() => {
      res.value = getSensorDataById([props.sensorId]);

      sensorData.value[0].data = res.value[0].map((e, index) => {
        return [new Date(res.value[0][index]), res.value[1][index]];
      });
      sensorData.value[0].name = props.sensorName;

      /* Analyse data */
      maxVal = max(res.value[1]);
      minVal = min(res.value[1]);
      avarage = mean(res.value[1]);
      stdDeviation = std(res.value[1]);
    });

    const toggleStatistics = () => {
      showStatistics.value = !showStatistics.value;

      if (showStatistics.value) {
        chartOptions.value = chartOptions.value = {
          ...chartOptions.value,
          ...{
            annotations: {
              yaxis: [
                {
                  y: maxVal,
                  strokeDashArray: 10,
                  borderColor: "#00E396",
                  label: {
                    borderColor: "#00E396",
                    style: {
                      color: "#fff",
                      background: "#00E396",
                    },
                    text: "Maks",
                  },
                },
                {
                  y: minVal,
                  strokeDashArray: 10,
                  borderColor: "#00E396",
                  label: {
                    borderColor: "#00E396",
                    style: {
                      color: "#fff",
                      background: "#00E396",
                    },
                    text: "Minimum",
                  },
                },
                {
                  y: avarage,
                  strokeDashArray: 10,
                  borderColor: "#775DD0",
                  label: {
                    borderColor: "#775DD0",
                    style: {
                      color: "#fff",
                      background: "#775DD0",
                    },
                    text: "Gjennomsnitt",
                  },
                },
                {
                  y: avarage + stdDeviation,
                  y2: avarage - stdDeviation,
                  strokeDashArray: 10,
                  borderColor: "#00E396",
                  fillColor: "#00E396",
                  opacity: 0.1,
                  label: {
                    borderColor: "#00E396",
                    position: "left",
                    offsetX: 50,
                    style: {
                      color: "#fff",
                      background: "#00E396",
                    },
                    text: "1 standardavvik",
                  },
                },
                {
                  y: avarage - stdDeviation,
                  y2: avarage - 2 * stdDeviation,
                  strokeDashArray: 10,
                  borderColor: "#FF0000",
                  fillColor: "#FF0000",
                  opacity: 0.1,
                  label: {
                    borderColor: "#FF0000",
                    position: "left",
                    offsetX: 50,
                    style: {
                      color: "#fff",
                      background: "#FF0000",
                    },
                    text: "2 standardavvik",
                  },
                },
                {
                  y: avarage + stdDeviation,
                  y2: avarage + 2 * stdDeviation,
                  strokeDashArray: 10,
                  borderColor: "#FF0000",
                  fillColor: "#FF0000",
                  opacity: 0.1,
                },
              ],
            },
          },
        };
      } else {
        delete chartOptions.value.annotations
        chartOptions.value = {
          ...chartOptions.value,
        };
      }
    };

    const toggleTimeLine = () => {
      showTimeLine.value = !showTimeLine.value;
    };

    return {
      chartOptions,
      chartOptionsLine,
      sensorData,
      showTimeLine,
      toggleTimeLine,
      toggleStatistics,
      showStatistics
    };
  },
};
</script>

<style>
.timeLine {
  height: 25%;
}
.mainGraph {
  height: 70%;
}
</style>