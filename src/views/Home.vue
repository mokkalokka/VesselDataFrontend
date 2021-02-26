<template >
  <div class="home" :style="{ backgroundImage: 'url(' + require('@/assets/coverimage.jpg') + ')', backgroundSize: 'cover', backgroundPosition: 'center'}">
    <p class="centered">Sintef Ocean Vessel Data</p>
  </div>
  
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>

<style scoped lang="scss">

  .home {
    height: 90vh;
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
