<template>
  <div class="accordion p-0 accordion-flush">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Accordion",
});
</script>
