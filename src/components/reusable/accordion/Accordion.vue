<template>
  <div class="accordion p-0">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Accordion",
});
</script>
