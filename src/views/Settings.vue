<template>
  <div>
    <div v-if="saved" class="alert alert-primary" role="alert">
      Settings saved
    </div>
    <div v-if="reverted" class="alert alert-danger" role="alert">
      Settings reverted to default
    </div>
    <h1 class="m-3">Your settings</h1>
    <DataTable :value="settings" editMode="cell" class="editable-cells-table">
      <Column field="description" header="Description"></Column>

      <Column field="value" header="Value">
        <template #editor="slotProps">
          <InputText v-model="slotProps.data.value"/>
        </template>
      </Column>
    </DataTable>
    <button class="btn btn-primary m-3" @click="saved = true">Save</button>
    <button class="btn btn-danger m-3" @click="setDefault">
      Revert to default
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "Settings",
  setup() {
    let settings = reactive([
      { description: "Color theme", value: "Light" },
      { description: "Default vessel", value: "None" },
      { description: "Default number of datapoints per hour", value: "60" },
    ]);

    const defaultSettings = reactive([
      { description: "Color theme", value: "Light" },
      { description: "Default vessel", value: "None" },
      { description: "Default number of datapoints per hour", value: "60" },
    ]);

    const saved = ref(false);
    const reverted = ref(false);

    const setDefault = () => {
      reverted.value = true;
      settings = { ...defaultSettings };
    };

    return {
      settings,
      saved,
      reverted,
      setDefault,
    };
  },
});
</script>

<style>
</style>