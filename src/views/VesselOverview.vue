
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <VesselDatatable/>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import VesselDatatable from '@/VesselDatatable.vue';

export default defineComponent({
  components: {
    VesselDatatable,
  },
});
</script>