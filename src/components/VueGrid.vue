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
          :id="'flexSwitchCheckMap'"
          :checkedValue="showMap"
          @toggle="toggleMap"
        >
          Vis kart
        </ToggleButton>
        <!-- <div
          class="form-check form-switch col m-auto d-flex justify-content-center"
        >
          <input
            :checked="currentGroup.groupDate"
            @click="currentGroup.groupDate = !currentGroup.groupDate"
            class="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
          />
          <label class="form-check-label ms-2" for="flexSwitchCheckDefault">
            Syncronize charts</label
          >
        </div> -->
        <ToggleButton
          v-if="currentGroup.sensors.length > 1"
          :id="'flexSwitchCheckSynchronize'"
          :checkedValue="currentGroup.groupDate"
          @toggle="currentGroup.groupDate = !currentGroup.groupDate"
        >
          Synkroniser grafer
        </ToggleButton>
      </div>

      <grid-layout
        :key="updated"
        v-model:layout="layout"
        :col-num="3"
        :row-height="400"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :vertical-compact="compact"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="(item, index) in layout"
          :key="index"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <div class="v-100 h-100" v-if="!draggable">
            <line-graph
              v-if="item.i != 9999999"
              :sensorNames="item.sensorNames"
              :sensorIds="item.sensorIds"
              :groupId="currentGroup.id"
            />
            <div v-if="item.i == 9999999" class="card h-100 v-100">
              <Map :group="currentGroup" />
            </div>
          </div>
          <div class="v-100 h-100" v-else>
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
import { defineComponent, ref, watch } from "vue";
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
    const currentGroup = ref(groups.value[props.groupId - 1]);
    const draggable = ref(false);
    const resizable = ref(false);
    const compact = true;
    const updated = ref(1);
    const showMap = ref(false);

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
          w: 3,
          h: 2,
          i: 9999999,
          sensorName: "map",
        });
      } else {
        // Removes the map from grid
        layout.value.splice(layout.value.indexOf({ sensorName: "map" }), 1);
      }
      showMap.value = !showMap.value;
      updated.value++;
    };

    const setLayout = () => {
      // Mapping trough the group sensors and adds them to the grid

      layout.value = currentGroup.value.sensors.map((e) => {
        return {
          x: 0,
          y: 0,
          w: 3,
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
      () => groups.value[props.groupId - 1].sensors,
      () => {
        currentGroup.value = groups.value[props.groupId - 1];

        setLayout();
        showMap.value = false;
        updated.value++;
      },

      { deep: true }
    );

    return {
      layout,
      draggable,
      resizable,
      compact,
      toggleReorder,
      toggleMap,
      updated,
      currentGroup,
      showMap,
    };
  },
});
</script>

<style>
.content {
  width: 100%;
}

.layoutJSON {
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}

.vue-grid-item > .vue-resizable-handle {
  z-index: 5000;
  position: absolute;
  width: 20%;
  height: 20%;
  bottom: 0;
  background-size: 20%;
  right: 0;
  box-sizing: border-box;
  cursor: se-resize;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 24px;
}

.vue-grid-item .minMax {
  font-size: 12px;
}
</style>
