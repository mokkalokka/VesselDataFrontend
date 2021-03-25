<template>
  <h2 class="accordion-header" :id="'heading' + item.id">
    <button
      class="accordion-button"
      type="button"
      data-bs-toggle="collapse"
      :data-bs-target="'#collapse' + item.id"
      aria-expanded="true"
      :aria-controls="'collapse' + item.id"
    >
      {{ tabHeader }} {{ item.id }}
    </button>
  </h2>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AccordionHeader",
  props: ["item", "tabHeader"],
});
</script>
