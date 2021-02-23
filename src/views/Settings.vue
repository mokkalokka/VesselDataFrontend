<template>
  <div>
    <div v-if="saved" class="alert alert-primary" role="alert">
      Settings saved
    </div>
    <h1 class="m-3">Your settings</h1>
    <DataTable :value="settings" editMode="cell" class="editable-cells-table">
      <Column field="description" header="Description"></Column>

      <Column field="value" header="Value">
        <template #editor="slotProps">
          <InputText v-model="slotProps.data.value" />
        </template>
      </Column>
    </DataTable>
    <button class="btn btn-primary m-3" @click="saved = true">Save</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "Settings",
  setup() {
    const settings = reactive([
      { description: "Color theme", value: "Light" },
      { description: "Default vessel", value: "None" },
      { description: "Default number of datapoints per hour", value: "60" },
    ]);
    const saved = ref(false);

    return {
      settings,
      saved,
    };
  },
});
</script>

<style>
</style>