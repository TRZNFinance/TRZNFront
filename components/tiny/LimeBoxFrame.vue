<script setup lang="ts">

import InfoRowComponent from "~/components/tiny/InfoRowComponent.vue";
</script>

<template>
  <div
      class="lg:w-5/12 sm:w-11/12	flex flex-col pl-5 pr-6 rounded border-[0.5px] border-dashed border-lime-500 max-md:pr-5 bg-black"
  >
    <slot/>
  </div>
</template>

<style scoped>

</style>
