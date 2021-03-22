<template>
  <div style="height: 100%; width: 100%">
    <div v-if="max > 1" style="height: 80%; width: 100%">
      <l-map
        v-model="zoom"
        v-model:zoom="zoom"
        :center="[60.390075, 1.94950166666667]"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <l-control-layers />

        <l-polyline
          v-if="!fetching"
          v-model:lat-lngs="position"
          color="green"
        ></l-polyline>

        <l-marker :lat-lng="position[sliderValue]"> </l-marker>
      </l-map>
    </div>
    <div class="text-center"  style="height: 20%; width: 100%">
      <div >
        <p>{{ new Date(position[sliderValue][2]).toLocaleString() }}</p>
      </div>

      <Slider class="mx-4" v-model="sliderValue" :step="1" :min="min" :max="max" />
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
import { ref } from "vue";
import { useSensorData } from "@/composables/useSensorData";
export default {
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LPolyline,
    LMarker,
  },
  setup() {
    const zoom = ref(7);
    const { getPosition, fetching, fetchData } = useSensorData();
    const position = ref([[60], [2]]);
    const sliderValue = ref(0);
    const min = ref(0);
    const max = ref(1);

    fetchData().then(() => {
      position.value = getPosition().value;
      min.value = 0;
      max.value = position.value.length - 1;
    });

    return {
      zoom,
      position,
      fetching,
      sliderValue,
      min,
      max,
    };
  },
};
</script>