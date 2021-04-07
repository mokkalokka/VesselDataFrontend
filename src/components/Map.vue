<template>
  <div style="height: 100%; width: 100%">
    <div :key="zoomedPositionUpdated" :style="'height: 90%; width: 100%'">
      <l-map
        v-model="zoom"
        v-model:zoom="zoom"
        :center="[60.390075, 1.94950166666667]"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <l-control-layers />

        <div v-if="showPosition">
          <l-polyline
            v-if="!fetching"
            v-model:lat-lngs="position"
            color="green"
          ></l-polyline>
          <l-polyline
            v-if="zoomedPositionUpdated"
            v-model:lat-lngs="zoomedPosition"
            color="red"
          ></l-polyline>
          <l-marker :lat-lng="position[sliderValue]"> </l-marker>
        </div>
      </l-map>
    </div>
    <div
      v-if="showPosition"
      class="text-center"
      style="height: 20%; width: 100%"
    >
      <div>
        <p>{{ new Date(position[sliderValue][2]).toLocaleString() }}</p>
      </div>

      <Slider
        class="mx-4"
        v-model="sliderValue"
        :tooltips="false"
        :disabled="true"
        :min="min"
        :max="max"
      />
    </div>
    <div v-else>
      <p class="text-center">Ingen posisjon for dette tidsintervallet</p>
    </div>
  </div>
</template>
<script>
import {
  LMap,
  LTileLayer,
  LControlLayers,
  LPolyline,
  LMarker,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { ref, watchEffect } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import Slider from "@vueform/slider";

export default {
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LPolyline,
    LMarker,
    Slider,
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const zoom = ref(7);
    const { getPosition, fetching, fetchData } = useSensorData();
    const position = ref([[60], [2]]);
    const sliderValue = ref(0);
    const min = ref(0);
    const max = ref(1);
    const zoomedPosition = ref([60], [2]);
    const zoomedPositionUpdated = ref(0);
    const showPosition = ref(false);
    const dataLoaded = ref(false);

    /**
     * Fetches data and sets the position array, max and min position
     */
    fetchData().then(() => {
      position.value = getPosition(
        props.group.fromDateTime,
        props.group.toDateTime
      ).value;
      min.value = 0;
      max.value = position.value.length - 1;
      if (position.value.length > 1) {
        showPosition.value = true;
        dataLoaded.value = true;
      }
    });

    /**
     * Watches for changes in zoomedDateTime to make a line of the zoomed position
     */
    watchEffect(() => {
      if (props.group.zoomedFromDateTime && dataLoaded.value) {
        zoomedPositionUpdated.value++;
        zoomedPosition.value = getPosition(
          props.group.zoomedFromDateTime,
          props.group.zoomedToDateTime
        ).value;
      }
    });

    /**
     * Watches the current hover position from graphs and drop marker at that point
     */
    watchEffect(() => {
      if (
        props.group.hoverIndex &&
        min.value < props.group.hoverIndex < max.value &&
        props.group.hoverIndex != -1
      ) {
        sliderValue.value = props.group.hoverIndex;
      }
    });

    return {
      zoom,
      position,
      fetching,
      sliderValue,
      min,
      max,
      zoomedPosition,
      zoomedPositionUpdated,
      showPosition,
    };
  },
};
</script>

<style>
.leaflet-container {
  background: white;
}
.slider-handle-lower {
  cursor: grab;
}
</style>
<style src="@vueform/slider/themes/default.css"></style>
