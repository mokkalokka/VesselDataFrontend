<template>
  <div class="card p-2 pb-4 shadow-sm h-100">
    <div id="wrapper" class="h-100">
      <p
        class="text-center m-0"
        data-toggle="tooltip"
        data-placement="top"
        :title="sensorNames.toString()"
      >
        {{ getGraphTitle }}
      </p>

      <vue-echarts
        :groupId="currentGroup.id.toString()"
        :option="options"
        style="height: 90%"
        ref="chart"
      />
    </div>
    <div class="container">
      <div class="row">
        <ToggleButton
          v-if="sensorIds.length == 1"
          :id="'flexSwitchCheckStats'"
          :checkedValue="showStatistics"
          @toggle="showStatistics = !showStatistics"
        >
          Vis statistikk
        </ToggleButton>
        <ToggleButton
          v-if="!currentGroup.groupDate || currentGroup.sensors.length == 1"
          :id="'flexSwitchCheckTimeline'"
          :checkedValue="showTimeLine"
          @toggle="showTimeLine = !showTimeLine"
        >
          Vis tidslinje
        </ToggleButton>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, watchEffect } from "vue";
import { VueEcharts } from "vue3-echarts";
import { useSensorData } from "@/composables/useSensorData";
import { std, mean, max, min } from "mathjs";
import { useGroups } from "@/composables/useGroups";
import ToggleButton from "@/components/reusable/ToggleButton.vue";

export default {
  name: "LineGraph",
  components: { ToggleButton, VueEcharts },
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
    pointsPerMinute: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const { getSensorDataById, fetchData } = useSensorData();
    const res = ref([]);
    const showGraphs = ref(false);
    const groups = useGroups();
    const currentGroup = groups.value.find((e) => e.id == props.groupId);
    const showTimeLine = ref(!currentGroup.groupDate);
    const showStatistics = ref(false);
    const updated = ref(0);
    const chartId =
      "chart-group=" +
      currentGroup.id +
      "-sensors=[" +
      props.sensorIds.toString() +
      "]-#";
    const maxVal = ref(0);
    const minVal = ref(0);
    const avarage = ref(0);
    const stdDeviation = ref(0);
    const chart = ref(null);

    const options = computed(() => {
      return {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        grid: {
          left: "3%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            show: showTimeLine.value,
            brushSelect: false,
            xAxisIndex: [0],
            filterMode: "none",
            start: 0,
            end: 100,
          },
          {
            id: "dataZoomY",
            type: "slider",
            brushSelect: false,
            yAxisIndex: [0],
            filterMode: "none",
            start: 0,
            end: 60,
          },
        ],
        series: res.value.slice(1).map((s, index) => {
          {
            return {
              name: props.sensorNames[index],
              type: "line",
              smooth: true,
              symbol: "none",
              lineStyle: {
                width: 1.5,
              },
              data: s.map((e, i) => {
                return [res.value[0][i], e];
              }),

              markLine: showStatistics.value
                ? {
                    data: [
                      {
                        name: "max",
                        yAxis: maxVal.value,
                        label: {
                          formatter: "Maks",
                          position: "middle",
                        },
                      },
                      {
                        name: "min",
                        yAxis: minVal.value,
                        label: {
                          formatter: "Min",
                          position: "insideMiddleBottom",
                        },
                      },
                      {
                        name: "avg",
                        yAxis: avarage.value,
                        label: {
                          formatter: "Gjennomsnitt",
                          position: "start",
                        },
                      },
                    ],
                  }
                : [],
              markArea: showStatistics.value
                ? {
                    silent: true,
                    data: [
                      [
                        {
                          name: "1 standardavvik",
                          label: {
                            formatter: "1 standardavvik",
                            position: "right",
                          },
                          yAxis: avarage.value + stdDeviation.value,
                          itemStyle: {
                            color: "rgb(0, 227, 150, 0.5)",
                          },
                        },
                        {
                          yAxis: avarage.value - stdDeviation.value,
                          itemStyle: {
                            color: "rgb(0, 227, 150, 0.5)",
                          },
                        },
                      ],
                      [
                        {
                          name: "2 standardavvik",
                          label: {
                            formatter: "2 standardavvik",
                            position: "right",
                          },
                          yAxis: avarage.value + stdDeviation.value,
                          itemStyle: {
                            color: "rgb(255, 0, 0, 0.2)",
                          },
                        },
                        {
                          yAxis: avarage.value + 2 * stdDeviation.value,
                          itemStyle: {
                            color: "rgb(255, 0, 0, 0.2)",
                          },
                        },
                      ],
                      [
                        {
                          name: "2 standardavvik",
                          label: {
                            formatter: "2 standardavvik",
                            position: "right",
                          },
                          yAxis: avarage.value - stdDeviation.value,
                          itemStyle: {
                            color: "rgb(255, 0, 0, 0.2)",
                          },
                        },
                        {
                          yAxis: avarage.value - 2 * stdDeviation.value,
                          itemStyle: {
                            color: "rgb(255, 0, 0, 0.2)",
                          },
                        },
                      ],
                    ],
                  }
                : [],
            };
          }
        }),
      };
    });

    const fetchSensorData = () => {
      // Fetching data and setting up the chart
      fetchData().then(() => {
        res.value = getSensorDataById(
          [...props.sensorIds],
          props.pointsPerMinute
        );

        /* Analyse data */
        maxVal.value = max(res.value[1]);
        minVal.value = min(res.value[1]);
        avarage.value = mean(res.value[1]);
        stdDeviation.value = std(res.value[1]);

        /* console.log(chart); 
        VueEcharts.connect("group-" + currentGroup.id); */
      });
    };

    fetchSensorData();

    const getGraphTitle = computed(() => {
      let title = "";
      let sensorOverflow = 0;
      props.sensorNames.map((e, index) => {
        if (index < 2) {
          if (index != props.sensorNames.length - 1) {
            title += e + ", ";
          } else {
            title += e;
          }
        } else {
          sensorOverflow++;
        }
      });
      return title + (sensorOverflow > 0 ? " + " + sensorOverflow : "");
    });

    /**
     * Fetch data from server if props change
     */
    watch(
      () => [props.sensorNames, props.pointsPerMinute],
      () => {
        fetchSensorData();
      }
    );

    /*     watchEffect(() => {
      updated.value;
    }); */
    watchEffect(() => {
      // This effect runs before the DOM is updated, and consequently,
      // the template ref does not hold a reference to the element yet.
      console.log(chart.value);
      console.log(echarts);
      /* chart.value ? chart.value.connect("1") : null; */
      /* chart.value.connect("1"); */
    });

    return {
      options,
      showGraphs,
      groups,
      currentGroup,
      showTimeLine,
      getGraphTitle,
      showStatistics,
      chart,
    };
  },
};
</script>

<style>
</style>