
<template>
  <div class="container-sm p-1">
    <VesselDatatable/>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import VesselDatatable from '@/components/VesselDatatable.vue';

export default defineComponent({
  components: {
    VesselDatatable,
  },
});
</script>