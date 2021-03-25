<template>
  <div class="card mt-4">
    <div class="accordion p-0 accordion-flush">
      <slot /><!-- accordion content slot -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Accordion",
});
</script>
