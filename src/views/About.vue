<template>
  <div class="about">
    <h1>This is an about page</h1>
    <api-test />
    
  </div>
</template>
<script>
import ApiTest from '@/components/ApiTest.vue'; // @ is an alias to /src
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'About',
  components: {
    ApiTest,
  },
});
</script>