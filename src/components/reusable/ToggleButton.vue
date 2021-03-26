<template>
  <div class="form-check form-switch col d-flex justify-content-center">
    <input
      :checked="checkedValue"
      class="form-check-input"
      type="checkbox"
      :id="id"
      @click="click"
    />
    <label class="form-check-label" for="flexSwitchCheckDefault">
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ToggleButton",
  props: ["id", "checkedValue", "click"],
});
</script>
