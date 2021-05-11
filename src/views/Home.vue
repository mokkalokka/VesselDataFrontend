<template >
  <div class="home">
    <p class="centered">Sintef Ocean Vessel Data</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>

<style lang="scss">
.home {
  height: 90vh;
  width: 100%;
  // Picture from https://www.pexels.com/photo/white-boats-on-body-of-water-2156972/
  background-image: url('~@/assets/coverimage.jpg');
  background-size: cover;
  background-position: center;
}

.centered {
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 50px;
  -webkit-text-stroke: 2px black;
}



</style>
