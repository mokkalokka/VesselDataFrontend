<template>
  <div
    :id="'collapse' + item.id"
    v-bind:class="
      multiCollapse
        ? 'accordion-collapse collapse multi-collapse show'
        : 'accordion-collapse collapse show'
    "
    :aria-labelledby="'heading' + item.id"
  >
    <div class="accordion-body p-0">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AccordionBody",
  props: ["item", "multiCollapse"],
});
</script>