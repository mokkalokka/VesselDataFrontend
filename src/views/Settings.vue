<template>
  <div class="container-md p-1">
    <div class="card mt-4 border-0">
      <div class="card-header bg-transparent">
        <h1 class="justify-content-center">Innstillinger</h1>
      </div>
      <div v-if="saved" class="alert alert-primary" role="alert">
        Lagret innstillinger
      </div>
      <div v-if="reverted" class="alert alert-danger" role="alert">
        Tilbakestilte innstillinger
      </div>
      <div class="table-responsive">
        <table id="settingstable" class="table table-bordered align-middle">
          <caption></caption>
          <thead>
            <tr class="table-light">
              <th scope="col">Beskrivelse</th>
              <th scope="col">Verdi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>{{ settings[0]["description"] }}</p>
              </td>
              <td>
                <button
                  id="lightbutton"
                  type="button"
                  v-bind:class="[
                    settings[0]['light'] === true
                      ? 'btn btn-secondary'
                      : 'btn btn-outline-secondary',
                  ]"
                  @click="settings[0]['light'] = true"
                >
                  Lys
                </button>
                <button
                  id="darkbutton"
                  type="button"
                  v-bind:class="[
                    settings[0]['light'] === false
                      ? 'btn btn-dark'
                      : 'btn btn-outline-dark',
                  ]"
                  @click="settings[0]['light'] = false"
                >
                  Mørk
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <p>{{ settings[1]["description"] }}</p>
              </td>
              <td>
                <input
                  type="text"
                  :value="settings[1]['value']"
                  class="form-control"
                  aria-label="default vessel input"
                  aria-describedby="vessel-default"
                />
              </td>
            </tr>
            <tr>
              <td>
                <p>{{ settings[2]["description"] }}</p>
              </td>
              <td>
                <input
                  type="text"
                  :value="settings[2]['value']"
                  class="form-control"
                  aria-label="def num data points per hour"
                  aria-describedby="points-default"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-primary m-3" @click="saved = true">Lagre</button>
        <button class="btn btn-danger m-3" @click="setDefault">
          Tilbakestill
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
      { description: "Fargetema", light: true },
      { description: "Standard skip", value: "None" },
      { description: "Standard antal punkter per time", value: "60" },
    ]);

    const defaultSettings = reactive([
      { description: "Fargetema", light: true },
      { description: "Standard skip", value: "None" },
      { description: "Standard antal punkter per time", value: "60" },
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