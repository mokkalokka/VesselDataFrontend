<template>
  <div class="card p-2 pb-4 shadow-sm h-100">
    <div id="wrapper" class="h-100" v-if="showGraphs">
      <div
        :key="showStatistics"
        id="chart-line2"
        v-bind:class="{ 'h-100': !showTimeLine, 'h-75': showTimeLine }"
      >
        <apexchart
          type="line"
          height="100%"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
      <div v-if="showTimeLine" id="chart-line" class="h-25 container">
        <div class="row">
        <div class="col m-auto">
          <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="Hent 1 time tilbake"><BIconPlus /></button>
        </div>
        <div class="col-10">
          <apexchart
            type="area"
            height="60%"
            :options="chartOptionsLine"
            :series="series"
          ></apexchart>
        </div>
        <div class="col m-auto">
          <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="Hent 1 time frem"><BIconPlus /></button>
        </div>
      </div>
      </div>
      <div class="container">
        <div class="row">
          <div
            v-if="numberOfSensors == 1"
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
          <div class="form-check form-switch col d-flex justify-content-center">
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
    sensorNames: {
      type: Array[String],
      required: true,
    },
    sensorIds: {
      type: Array[Number],
      required: true,
    },
  },

  setup(props) {
    const { getSensorDataById, fetchData } = useSensorData();
    const res = ref([[], []]);
    const series = ref([]);
    const showTimeLine = ref(true);
    const showStatistics = ref(false);
    const showGraphs = ref(false);
    const time = ref([]);
    const numberOfSensors = ref(0);
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
          enabled: false,
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
        type: "area",
        brush: {
          target: "chart" + props.sensorId + "1",
          enabled: true,
        },
        selection: {
          enabled: true,
        },
      },
      /* colors: ["#008FFB"], */
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
        /* show: false, */
        floating: false,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          show: false,
        },
      },
    });

    fetchData().then(() => {
      res.value = getSensorDataById(props.sensorIds);
      time.value = res.value[0];

      // adding all the sensors into the series
      res.value.map((s, index) => {
        if (index != 0) {
          numberOfSensors.value++;
          series.value.push({
            name: props.sensorNames[index - 1],
            data: time.value.map((e, i) => {
              return [time.value[i], s[i]];
            }),
          });
        }
      });

      showGraphs.value = true;

      /* Analyse data */
      maxVal = max(res.value[1]);
      minVal = min(res.value[1]);
      avarage = mean(res.value[1]);
      stdDeviation = std(res.value[1]);
    });

    const toggleStatistics = () => {
      showStatistics.value = !showStatistics.value;

      if (showStatistics.value) {
        chartOptions.value = {
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
        delete chartOptions.value.annotations;
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
      series,
      showTimeLine,
      toggleTimeLine,
      toggleStatistics,
      showStatistics,
      showGraphs,
      numberOfSensors,
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