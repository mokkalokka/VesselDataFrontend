<template>
  <div class="container p-1">
    <div class="card mt-4 border-0">
      <div class="card-header bg-transparent">
        <h1 class="justify-content-center">Your settings</h1>
      </div>
      <div v-if="saved" class="alert alert-primary" role="alert">
        Settings saved
      </div>
      <div v-if="reverted" class="alert alert-danger" role="alert">
        Settings reverted to default
      </div>
      <div class="table-responsive">
        <table id="settingstable" class="table table-bordered align-middle">
          <caption></caption>
          <thead>
            <tr class="table-light">
              <th scope="col">Description</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>{{settings[0]["description"]}}</p>
              </td>
              <td>
                <button id="lightbutton" type="button"  v-bind:class='[settings[0]["light"] === true ? "btn btn-secondary" : "btn btn-outline-secondary"]' @click='settings[0]["light"] = true'>Light</button>
                <button id= "darkbutton" type="button"  v-bind:class='[settings[0]["light"] === false ? "btn btn-dark" : "btn btn-outline-dark"]' @click='settings[0]["light"] = false'>Dark</button>
              </td>
            </tr>
            <tr>
              <td>
                <p>{{settings[1]["description"]}}</p>
              </td>
              <td>
                  <input type="text" :value='settings[1]["value"]' class="form-control" aria-label="default vessel input" aria-describedby="vessel-default">
              </td>
            </tr>
            <tr>
              <td>
                <p>{{settings[2]["description"]}}</p>
              </td>
              <td>
                  <input type="text" :value='settings[2]["value"]' class="form-control" aria-label="def num data points per hour" aria-describedby="points-default">
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-primary m-3" @click="saved = true">Save</button>
        <button class="btn btn-danger m-3" @click="setDefault">
          Revert to default
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "Settings",

  setup() {

    let settings = reactive([
      { description: "Color theme", light: true },
      { description: "Default vessel", value: "None" },
      { description: "Default number of datapoints per hour", value: "60" },
    ]);

    const defaultSettings = reactive([
      { description: "Color theme", light: true },
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

<style scoped>
</style>