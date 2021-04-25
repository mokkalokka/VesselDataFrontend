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

      <ECharts
        :group="currentGroup.id.toString()"
        :option="options"
        :autoresize="true"
        @dataZoom="zoomHandler"
        @restore="resetZoomedPosition"
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

<script lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import ECharts from "vue-echarts";
import * as echarts from "echarts";
import { useSensorData } from "@/composables/useSensorData";
import { std, mean, max, min } from "mathjs";
import { useGroups } from "@/composables/useGroups";
import ToggleButton from "@/components/reusable/ToggleButton.vue";
import { Group } from "@/Interfaces/groupInterface";

export default {
  name: "Echarts",
  components: { ToggleButton, ECharts },
  props: {
    sensorNames: {
      type: Array,
      required: true,
    },
    sensorIds: {
      type: Array,
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
    const showGraphs = ref(false as boolean);
    const groups = useGroups();
    const currentGroup = groups.value.find(
      (e) => e.id == props.groupId
    ) as Group;
    const showTimeLine = ref(!currentGroup.groupDate as boolean);
    const showStatistics = ref(false as boolean);
    const maxVal = ref(0 as number);
    const minVal = ref(0 as number);
    const avarage = ref(0 as number);
    const stdDeviation = ref(0 as number);
    const chart = ref(null);

    // Sets the Echart graph options as a computed value for reactivity
    const options = computed(() => {
      return {
        tooltip: {
          trigger: "axis",
          position: function (pt, params) {
            // sets the hover position for map position
            currentGroup.hoverIndex = params[0].dataIndex;
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
              title: {
                zoom: "Zoom",
                back: "Zoom ut",
              },
            },
            restore: {
              title: "Tilbakestill",
            },
            saveAsImage: {
              title: "lagre bilde",
            },
            /* magicType: {
              type: ["line", "bar"],
            }, */
          },
        },
        xAxis: {
          type: "time",
          /* boundaryGap: false,
          axisPointer: {
            triggerTooltip: false,
          }, */
        },
        yAxis: {
          type: "value",
          /* boundaryGap: [0, 0], */
          /* min: "dataMin",
          max: "dataMax", */
          /* min: null,
          max: null, */
          min: parseFloat(
            (
              minVal.value +
              Math.sign(minVal.value) * -minVal.value * 0.005
            ).toFixed(2)
          ),
          max: parseFloat(
            (
              maxVal.value +
              Math.sign(maxVal.value) * maxVal.value * 0.005
            ).toFixed(2)
          ),
        },
        legend: {},
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            show: showTimeLine.value,
            brushSelect: false,
            /* xAxisIndex: [0], */
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
            end: 100,
          },
        ],
        /* emphasis: {
          lineStyle: { opacity: 0.9 },
        }, */
        series: res.value.slice(1).map((s, index) => {
          {
            return {
              name: props.sensorNames[index],
              type: "line",
              smooth: true,
              symbol: "none",
              lineStyle: {
                width: 1.0,
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
                          position: "end",
                        },
                      },
                      {
                        name: "min",
                        yAxis: minVal.value,
                        label: {
                          formatter: "Min",
                          position: "end",
                        },
                      },
                      {
                        name: "avg",
                        yAxis: avarage.value,
                        label: {
                          formatter: "Gjennomsnitt ",
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

    /**
     * Fetching the sensor data and analyse statistics
     */
    const fetchSensorData = () => {
      res.value = [];
      // Fetching data and setting up the chart
      fetchData().then(() => {
        res.value = getSensorDataById(
          [...props.sensorIds] as number[],
          props.pointsPerMinute
        );

        /* Analyse data */
        maxVal.value = max(res.value.slice(1)) as number;
        minVal.value = min(res.value.slice(1)) as number;
        avarage.value = mean(res.value[1]) as number;
        stdDeviation.value = std(res.value[1]) as number;
      });
    };

    fetchSensorData();

    /**
     * Computed value for graph title
     */
    const getGraphTitle = computed(() => {
      let title = "" as string;
      let sensorOverflow = 0 as number;
      props.sensorNames.map((sensorName: string, index: number) => {
        if (index < 2) {
          if (index != props.sensorNames.length - 1) {
            title += sensorName + ", ";
          } else {
            title += sensorName;
          }
        } else {
          sensorOverflow++;
        }
      });
      return (title +
        (sensorOverflow > 0 ? " + " + sensorOverflow : "")) as string;
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

    /* watchEffect(() => {
      console.log(props.sensorNames, props.pointsPerMinute);
      fetchSensorData();
    }); */

    /**
     * Watches for changes in syncronization setting in current group. connects or disconnects according to this value
     */
    watchEffect(() => {
      if (currentGroup.groupDate) {
        echarts.connect(currentGroup.id.toString());
      } else {
        echarts.disconnect(currentGroup.id.toString());
      }
    });

    /**
     * Handles zoom events and updates current groups zoom date. This is for connecting the map to the graph
     * @param {event} e - zoom event from Echarts
     */
    const zoomHandler = (e) => {
      // Check if the zoom event is comming from toolbar zoom or from timeline
      if (e.batch) {
        //Zoom is from toolbar
        /* console.log(new Date(e.batch[0].startValue)); */
        currentGroup.zoomedFromDateTime = new Date(e.batch[0].startValue);
        currentGroup.zoomedToDateTime = new Date(e.batch[0].endValue);
      } else if (e.dataZoomId == "dataZoomX") {
        // Zoom is from timeline (dataZoom)
        const fromIndex = Math.floor(
          (e.start / 100) * (res.value[0].length - 1)
        ) as number;
        const toIndex = Math.floor(
          (e.end / 100) * (res.value[0].length - 1)
        ) as number;
        currentGroup.zoomedFromDateTime = res.value[0][fromIndex];
        currentGroup.zoomedToDateTime = res.value[0][toIndex];
      }
    };

    /**
     * Resets the current group zoom dates to undefined (no red line on map)
     *
     */
    const resetZoomedPosition = () => {
      console.log(typeof chart.value);

      chart.value.setOption(options.value, true);
      currentGroup.zoomedFromDateTime = undefined;
      currentGroup.zoomedToDateTime = undefined;
    };

    /**
     * Reset the map zoomed position if showTimeLine is false
     */
    watch(
      () => showTimeLine.value,
      () => {
        if (!showTimeLine.value) {
          resetZoomedPosition();
        }
      }
    );

    return {
      options,
      showGraphs,
      groups,
      currentGroup,
      showTimeLine,
      getGraphTitle,
      showStatistics,
      chart,
      zoomHandler,
      resetZoomedPosition,
    };
  },
};
</script>

<style>
</style>