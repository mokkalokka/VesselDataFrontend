<template>
  <div class="form-check form-switch col d-flex justify-content-center">
    <input
      :id="id"
      :checked="checkedValue"
      class="form-check-input"
      type="checkbox"
      @click="clicked"
    />
    <label class="form-check-label ms-2" for="flexSwitchCheckDefault">
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ToggleInput",
  props: ["id", "checkedValue"],
  emits: ["toggle"],
  setup: (_, { emit }) => {
    /**
     * Emit a toggle-event to the parent component (usage in parent: @toggle)
     */
    const clicked = () => {
      emit("toggle");
    };

    return { clicked };
  },
});
</script>
