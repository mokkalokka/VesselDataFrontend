<template>
  <div style="height: 75vh; width: 100%">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="[ 60.390075, 1.94950166666667 ]"
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
    </l-map>
  </div>

</template>
<script>
import {
  LMap,
  LTileLayer,
  LControlLayers,
  LPolyline,

} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { ref } from 'vue';
import {useSensorData} from "@/composables/useSensorData"
export default {
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LPolyline,
  },
  setup(){
      const zoom = ref(7)
      const {initialize, position, fetching } = useSensorData()

      initialize()

      return {
          zoom,
          position,
          fetching
      }
  }
  
};
</script>