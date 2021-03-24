<template>
  <div class="card mt-4">
    <div class="accordion p-0 accordion-flush">
      <div class="accordion-item" v-for="item in contentArray" :key="item.id">
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
        <div
          :id="'collapse' + item.id"
          class="accordion-collapse collapse show"
          :aria-labelledby="'heading' + item.id"
        >
          <div class="accordion-body p-0">
            <slot :item="item"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Accordion",
  props: ["contentArray", "tabHeader"],
});
</script>
