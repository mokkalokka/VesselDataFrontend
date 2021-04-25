<template>
  <div style="height: 100%; width: 100%">
    <div :style="'height: 85%; width: 100%'">
      <l-map
        :min-zoom="4"
        :max-zoom="18"
        v-model:zoom="zoom"
        :center="centerPosition"
      >
        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          :layer-type="tileProvider.layerType"
        />
        <l-control-layers />
        <l-control-scale
          position="topright"
          :imperial="false"
          :metric="true"
        ></l-control-scale>

        <div v-if="showPosition">
          <l-polyline
            v-if="!fetching"
            v-model:lat-lngs="position"
            color="green"
          ></l-polyline>
          <l-polyline
            :key="zoomedPositionUpdated"
            v-if="showZoomedPosition"
            v-model:lat-lngs="zoomedPosition"
            color="red"
          ></l-polyline>
          <div v-if="getLatLang()">
            <l-marker :lat-lng="getLatLang()"> </l-marker>
          </div>
        </div>
      </l-map>
    </div>
    <div
      v-if="showPosition"
      class="text-center"
      style="height: 20%; width: 100%"
    >
      <div>
        <p v-if="position[sliderValue][2]">
          {{ new Date(position[sliderValue][2]).toLocaleString() }}
        </p>
      </div>

      <VueSlider
        class="mx-4"
        v-model="sliderValue"
        :min="min"
        :max="max"
        :tooltip="'none'"
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
  LControlScale,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { ref, watch, computed, watchEffect } from "vue";
import { useSensorData } from "@/composables/useSensorData";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import { mean } from "mathjs";

export default {
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LPolyline,
    LMarker,
    VueSlider,
    LControlScale,
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
    pointsPerMinute: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const { getPosition, fetching, fetchData } = useSensorData();
    const position = ref([[60], [2]]);
    const sliderValue = ref(0);
    const min = ref(0);
    const max = ref(1);
    const zoomedPosition = ref([60], [2]);
    const zoomedPositionUpdated = ref(0);
    const showPosition = ref(false);
    const showZoomedPosition = ref(false);
    const dataLoaded = ref(false);
    const zoom = ref(7);

    const tileProviders = [
      {
        name: "OpenStreetMap",
        visible: true,
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        layerType: "base",
      },
      {
        name: "OpenTopoMap",
        visible: false,
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution:
          'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        layerType: "base",
      },
      {
        name: "OpenSeaMap",
        visible: true,
        url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",

        attribution:
          'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
        layerType: "overlay",
      },
    ];

    watchEffect(() => {
      console.log(tileProviders);
    });

    /**
     * Fetches data and sets the position array, max and min position
     */
    const initPosition = () => {
      fetchData().then(() => {
        position.value = getPosition(
          props.group.fromDateTime,
          props.group.toDateTime,
          props.pointsPerMinute
        ).value;
        min.value = 0;
        max.value = position.value.length - 1;
        if (position.value.length > 1) {
          showPosition.value = true;
          dataLoaded.value = true;
        }
      });
    };

    initPosition();

    /**
     * Watches for changes in decimation and fetches map points
     */
    watch(
      () => props.pointsPerMinute,
      () => {
        sliderValue.value = 0;
        showPosition.value = false;
        showZoomedPosition.value = false;
        initPosition();
      },
      { deep: true }
    );

    /**
     * Watches for hover index from graph and updates the position on map
     */
    watch(
      () => props.group.hoverIndex,
      () => {
        if (
          position.value.length > props.group.hoverIndex &&
          props.group.hoverIndex > -1
        ) {
          sliderValue.value = props.group.hoverIndex;
        }
      }
    );

    /**
     * Getter for latitude and longitude for hover point
     */
    const getLatLang = () => {
      if (
        sliderValue.value &&
        position.value &&
        position.value[sliderValue.value]
      ) {
        return position.value[sliderValue.value];
      } else if (position.value[0]) {
        return position.value[0];
      } else {
        return null;
      }
    };

    /**
     * Watches for changes in zoomedDateTime to make a line of the zoomed position
     */
    watch(
      () => [
        props.group.zoomedFromDateTime,
        props.group.zoomedToDateTime,
        dataLoaded.value,
      ],
      () => {
        if (props.group.zoomedFromDateTime && dataLoaded.value) {
          zoomedPositionUpdated.value++;
          zoomedPosition.value = getPosition(
            props.group.zoomedFromDateTime,
            props.group.zoomedToDateTime,
            props.pointsPerMinute
          ).value;
          showZoomedPosition.value = true;
        } else {
          showZoomedPosition.value = false;
        }
      },
      { immediate: true }
    );

    const centerPosition = computed(() => {
      if (dataLoaded.value) {
        return [
          mean(position.value.map((e) => e[0])),
          mean(position.value.map((e) => e[1])),
        ];
      } else {
        return [60, 2];
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
      showZoomedPosition,
      getLatLang,
      centerPosition,
      tileProviders,
    };
  },
};
</script>

<style>
.leaflet-container {
  background: white;
}
</style>
