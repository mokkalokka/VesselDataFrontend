<template>
  <div class="card p-2 pb-4 shadow-sm h-100">
    <div id="wrapper" class="h-100" v-if="showGraphs">
      <div
        :key="updated"
        id="chart-line2"
        v-bind:class="{
          'h-100':
            !showTimeLine ||
            (currentGroup.groupDate && currentGroup.sensors.length != 1),
          'h-75':
            showTimeLine &&
            (!currentGroup.groupDate || currentGroup.sensors.length == 1),
        }"
      >
        <apexchart
          type="line"
          height="100%"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
      <div
        v-if="
          showTimeLine &&
          (!currentGroup.groupDate || currentGroup.sensors.length == 1)
        "
        id="chart-line"
        class="h-25 container"
      >
        <div class="row">
          <div class="col m-auto">
            <button
              class="btn btn-outline-primary"
              data-toggle="tooltip"
              data-placement="top"
              title="Hent 1 time tilbake"
            >
              <BIconPlus />
            </button>
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
            <button
              class="btn btn-outline-primary"
              data-toggle="tooltip"
              data-placement="top"
              title="Hent 1 time frem"
            >
              <BIconPlus />
            </button>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <ToggleButton
            :id="'flexSwitchCheckStats'"
            :checkedValue="false"
            :click="toggleStatistics"
            v-if="numberOfSensors == 1"
          >
            Vis statistikk
          </ToggleButton>
          <ToggleButton
            :id="'flexSwitchCheckTimeline'"
            :checkedValue="showTimeLine"
            :click="toggleTimeLine"
            v-if="!currentGroup.groupDate || currentGroup.sensors.length == 1"
          >
            Vis tidslinje
          </ToggleButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSensorData } from "@/composables/useSensorData";
import { ref, watchEffect } from "vue";
import { std, mean, max, min } from "mathjs";
import { useGroups } from "@/composables/useGroups";
import ToggleButton from "@/components/reusable/ToggleButton.vue";

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
    groupId: {
      type: Number,
      required: true,
    },
  },
  components: { ToggleButton },

  setup(props) {
    const { getSensorDataById, fetchData } = useSensorData();
    const groups = useGroups();
    const currentGroup = groups.value.find((e) => e.id == props.groupId);
    const res = ref([[], []]);
    const series = ref([]);
    const showTimeLine = ref(!currentGroup.groupDate);
    const showStatistics = ref(false);
    const showGraphs = ref(false);
    const time = ref([]);
    const numberOfSensors = ref(0);
    const updated = ref(0);
    const chartId =
      "chart-group=" +
      currentGroup.id +
      "-sensors=[" +
      props.sensorIds.toString() +
      "]-#";
    let maxVal = 0;
    let minVal = 0;
    let avarage = 0;
    let stdDeviation = 0;

    /* const forceZoom = (xaxis) => {
      console.log("zooming!");
      console.log("From: " + new Date(xaxis.min));
      console.log("To: " + new Date(xaxis.max));
      window.ApexCharts.exec(chartId + "1", "zoomX", (xaxis.min, xaxis.max));
    } */

    // Setting up the chart options
    const chartOptions = ref({
      chart: {
        events: {
          zoomed: function (chartContext, { xaxis, yaxis }) {
            currentGroup.zoomedFromDateTime = new Date(xaxis.min);
            currentGroup.zoomedToDateTime = new Date(xaxis.max);
          },
          beforeZoom: function (chartContext, { xaxis, yaxis }) {
            if (
              new Date(xaxis.min) < new Date(time.value[0]) ||
              new Date(xaxis.max) > new Date(time.value[-1])
            ) {
              return {
                // dont zoom out any further
                xaxis: {
                  min: time.value[0],
                  max: time.value[-1],
                },
              };
            } else {
              return {
                xaxis: {
                  min: xaxis.min,
                  max: xaxis.max,
                },
              };
            }
          },
          mouseMove: function (event, chartContext, config) {
            currentGroup.hoverIndex = config.dataPointIndex;
          },
        },
        id: chartId + "1",
        /* group: "group-" + currentGroup.id, */
        type: "line",
        toolbar: {
          autoSelected: "zoom",
          show: true,
        },
        animations: {
          enabled: false,
        },
      },
      legend: {
        show: false,
        showForSingleSeries: true,
      },

      stroke: {
        width: 1,
      },
      title: {
        text: props.sensorNames.map((e) => e.toString()),
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
      },
      yaxis: {
        tickAmount: 4,
        decimalsInFloat: 2,
        labels: {
          minWidth: "100%",
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
          format: "dd MMM - HH:mm:ss",
        },
        y: {
          show: false,
        },
        /* marker: {
            show: false,
        }, */
      },
      /* theme: {
        mode: "dark"
      } */
    });
    // Setting up the time line charts
    const chartOptionsLine = ref({
      chart: {
        events: {
          brushScrolled: function (chartContext, { xaxis, yaxis }) {
            if (currentGroup.sensors.length == 1) {
              currentGroup.zoomedFromDateTime = new Date(xaxis.min);
              currentGroup.zoomedToDateTime = new Date(xaxis.max);
            }
          },
        },
        id: chartId + "2",
        /* id: "timeline", */
        type: "area",
        brush: {
          target: chartId + "1",

          enabled: true,
        },
        selection: {
          enabled: true,
        },
        /* toolbar: {
          autoSelected: "selection",
          show: false,
        }, */
      },
      legend: {
        show: false,
      },
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
        show: false,
        tooltip: {
          enabled: false,
        },
        labels: {
          minWidth: "100%",
        },
      },
      tooltip: {
        enabled: false,
      },
      dataLabels: {
        enabled: false,
      },
    });

    watchEffect(() => {
      /* console.log(currentGroup.groupDate); */
      if (currentGroup.groupDate) {
        chartOptions.value.chart = {
          ...chartOptions.value.chart,
          ...{ group: "group-" + currentGroup.id + "-1" },
        };
        chartOptions.value = {
          ...chartOptions.value,
        };
      } else {
        delete chartOptions.value.chart.group;
        chartOptions.value = {
          ...chartOptions.value,
        };
        //group: "group-" + currentGroup.id + "-1",
      }
      updated.value++;
    });

    // Fetching data and setting up the chart
    fetchData().then(() => {
      res.value = getSensorDataById([...props.sensorIds]);
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

    /**
     * Toggles the graph statistics.
     * Note: this is only enabled when there is one sensor to show in the graph
     */
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

    /**
     * Toggles the timeline graph
     */
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
      updated,
      currentGroup,
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