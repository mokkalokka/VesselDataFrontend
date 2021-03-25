<template>
  <div class="card mt-4">
    <div class="table-responsive">
      <table
        :id="id"
        v-bind:class="
          hoverable
            ? 'table m-0 table-bordered table-hover'
            : 'table m-0 table-bordered'
        "
      >
        <slot />
        <!-- datatable content -->
      </table>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DataTable",
  props: ["id", "hoverable"],
  // "headers", "cols" ,
});
</script>