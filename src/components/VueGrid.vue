<template>
  <div class="h-100 w-100">
    <div class="content pt-3">
      <div class="row">
        <ToggleButton
          :id="'flexSwitchCheckReorder'"
          :checkedValue="false"
          @toggle="toggleReorder"
        >
          Manuell omorganisering
        </ToggleButton>

        <ToggleButton
          v-if="!resizable"
          :id="'flexSwitchCheckMap'"
          :checkedValue="showMap"
          @toggle="toggleMap"
        >
          Vis kart
        </ToggleButton>
        <ToggleButton
          v-if="currentGroup.sensors.length > 1"
          :id="'flexSwitchCheckSynchronize'"
          :checkedValue="currentGroup.groupDate"
          @toggle="currentGroup.groupDate = !currentGroup.groupDate"
        >
          Synkroniser grafer
        </ToggleButton>
        <div class="col">
          <div class="row">
            <div class="col d-flex justify-content-end my-auto">
              <label for="pointsPerMinuteSelect">Punkter per minutt:</label>
            </div>
            <div class="col mx-3 d-flex justify-content-start">
              <select
                id="pointsPerMinuteSelect"
                v-model.number="pointsPerMinute"
                class="form-select"
              >
                <option>5</option>
                <option>15</option>
                <option>30</option>
                <option :value="60">Vis alle</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <grid-layout
        v-model:layout="layout"
        :col-num="GRID_COLUMNS"
        :row-height="GRID_HEIGHT"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :vertical-compact="true"
        :margin="[GRID_MARGIN, GRID_MARGIN]"
        v-bind:style="{ height: gridLayoutHeight + 'px' }"
      >
        <!-- :use-css-transforms="true" -->
        <grid-item
          v-for="(item, index) in layout"
          :key="index"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <div class="v-100 h-100" v-show="!draggable">
            <line-graph
              v-if="item.i != 9999999"
              :sensorNames="item.sensorNames"
              :sensorIds="item.sensorIds"
              :groupId="currentGroup.id"
              :pointsPerMinute="pointsPerMinute"
            />
            <div v-if="item.i == 9999999" class="card h-100 v-100">
              <Map :group="currentGroup" :pointsPerMinute="pointsPerMinute" />
            </div>
          </div>
          <div class="v-100 h-100" v-show="draggable">
            <div
              class="w-100 h-100 card bg-light d-flex justify-content-center"
            >
              <h1 class="text-center">
                {{ item.i != 9999999 ? item.sensorNames[0] : "Map" }}
              </h1>
            </div>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import LineGraph from "@/components/LineGraph.vue";
import Map from "@/components/Map.vue";
import { Group } from "@/Interfaces/groupInterface";
import { useGroups } from "@/composables/useGroups";
import ToggleButton from "@/components/reusable/ToggleButton.vue";

export default defineComponent({
  name: "VueGrid",
  components: { LineGraph, Map, ToggleButton },

  props: {
    groupId: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const selectedSensors = useSelectedSensors();
    const layout = ref([]);
    const groups = useGroups();
    const currentGroup = ref(groups.value[(props.groupId as number) - 1]);
    const draggable = ref(false);
    const resizable = ref(false);
    const showMap = ref(false);
    const pointsPerMinute = ref(60);

    // Grid setup
    const GRID_HEIGHT = 400;
    const GRID_MARGIN = 10;
    const GRID_COLUMNS = 4;

    /**
     * Computed value for grid height in terms of number of grids and map + margins
     */
    const gridLayoutHeight = computed(() => {
      if (layout.value.length > 0) {
        const numberOfGridsHeights =
          layout.value[layout.value.length - 1].y + (showMap.value ? 2 : 1);
        const marginOffset = GRID_MARGIN * (numberOfGridsHeights + 1);

        return numberOfGridsHeights * GRID_HEIGHT + marginOffset;
      } else {
        return GRID_HEIGHT;
      }
    });
    /**
     * Toggles the ability to reorder and resize grids.
     */
    const toggleReorder = () => {
      draggable.value = !draggable.value;
      resizable.value = !resizable.value;
    };

    /**
     * Toggles map and adds it to the bottom of the grid if it should render.
     */
    const toggleMap = () => {
      if (!showMap.value) {
        currentGroup.value.hoverIndex = 0;
        //Calculates the bottom of the grid and adds the map
        layout.value.push({
          x: 0,
          y:
            layout.value[layout.value.length - 1].y +
            layout.value[layout.value.length - 1].h,
          w: GRID_COLUMNS,
          h: 2,
          i: 9999999,
          sensorName: "map",
        });
      } else {
        // Removes the map from grid
        layout.value.splice(layout.value.indexOf({ sensorName: "map" }), 1);
      }
      showMap.value = !showMap.value;
    };

    const setLayout = () => {
      // Mapping trough the group sensors and adds them to the grid

      layout.value = currentGroup.value.sensors.map((e) => {
        return {
          x: 0,
          y: 0,
          w: GRID_COLUMNS,
          h: 1,
          i: e.id,
          sensorIds: [...e.sensorsToCompare].concat(e.id),
          sensorNames: selectedSensors.value
            .filter((s) => [...e.sensorsToCompare].concat(e.id).includes(s.id))
            .map((f) => {
              return f.sensorName;
            }),
        };
      });
    };
    setLayout();

    watch(
      () => groups.value[(props.groupId as number) - 1].sensors,
      () => {
        currentGroup.value = groups.value[(props.groupId as number) - 1];

        setLayout();
        showMap.value = false;
      },

      { deep: true }
    );

    return {
      layout,
      draggable,
      resizable,
      toggleReorder,
      toggleMap,
      currentGroup,
      showMap,
      gridLayoutHeight,
      GRID_HEIGHT,
      GRID_MARGIN,
      GRID_COLUMNS,
      pointsPerMinute,
    };
  },
});
</script>

<style>
.vue-grid-item > .vue-resizable-handle {
  z-index: 5000;
  position: absolute;
  width: 1vw;
  height: 1vw;
  bottom: 0;
  background-size: 1vw;
  right: 0;
  box-sizing: border-box;
  cursor: se-resize;
}
</style>
