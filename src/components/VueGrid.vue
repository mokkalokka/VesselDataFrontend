<template>
  <div class="h-100 w-100">
    <!-- style="width: 100% height: 100%" -->
    <div class="content">
      <h1 class="text-center">Group {{ group }}</h1>

      <div class="form-check form-switch d-flex justify-content-center">
        <input
          @click="toggleReorder"
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault">
          Manual reordering</label
        >
      </div>
      <div class="form-check form-switch d-flex justify-content-center">
        <input
          @click="toggleMap"
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault">
          Toggle map</label
        >
      </div>
      <grid-layout
        :key="updated"
        v-model:layout="layout"
        :col-num="12"
        :row-height="200"
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
          <line-graph
            v-if="item.i != 9999999"
            :sensorName="item.sensorName"
            :sensorIds="item.sensorIds"
          />
          <div v-if="item.i == 9999999" class="card h-100 v-100">
            <Map />
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { useSelectedSensors } from "@/composables/useSelectedSensors";
import LineGraph from "@/components/LineGraph.vue";
import Map from "@/components/Map.vue";

export default defineComponent({
  name: "VueGrid",
  components: { LineGraph, Map },
  props: {
    group: {
      type: Number,
      default: 1,
    },
  },

  setup(props) {
    const selectedSensors = useSelectedSensors();
    const layout = ref([]);

    selectedSensors.value.map((e) => {
      if (e.group == props.group) {
        layout.value.push({
          x: 0,
          y: 0,
          w: 12,
          h: 2,
          i: e.id,
          sensorIds: e.grahpsToCompare.concat(e.id),
          sensorName: e.sensorName,
        });
      }
    });


    const draggable = ref(false);
    const resizable = ref(false);
    const compact = true;
    const updated = ref(1);
    const showMap = ref(false);

    const toggleReorder = () => {
      draggable.value = !draggable.value;
      resizable.value = !resizable.value;
    };

    const increaseWidth = () => {
      let width = document.getElementById("content").offsetWidth;
      width += 20;
      document.getElementById("content").style.width = width + "px";
    };

    const decreaseWidth = () => {
      let width = document.getElementById("content").offsetWidth;
      width -= 20;
      document.getElementById("content").style.width = width + "px";
    };

    const toggleMap = () => {
      if (!showMap.value) {
        layout.value.push({
          x: 0,
          y:
            layout.value[layout.value.length - 1].y +
            layout.value[layout.value.length - 1].h,
          w: 12,
          h: 3,
          i: 9999999,
          sensorName: "map",
        });
      } else {
        layout.value.splice(layout.value.indexOf({ sensorName: "map" }), 1);
      }
      showMap.value = !showMap.value;
      updated.value++;
    };

    return {
      increaseWidth,
      decreaseWidth,
      layout,
      draggable,
      resizable,
      compact,
      toggleReorder,
      toggleMap,
      updated,
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

.vue-resizable-handle {
  z-index: 5000;
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
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
