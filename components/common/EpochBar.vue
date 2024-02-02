<script setup lang="ts">

import EpochBarComponent from "~/components/tiny/EpochBarComponent.vue";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";


const store = useStore()
// store.updateEpochInfo();
// store.updateCurrentBlock();
// store.updatePriceInfo();

const { epochInfo, currentBlock} = storeToRefs(store)
</script>

<template>

  <div class="pb-2 bg-black">
    <div class="w-full h-0 border-[0.3px] border-solid border-lime-500"></div>
  </div>
  <div class="flex items-center justify-between gap-5 px-5 max-md:flex-wrap bg-black">

    <div class="text-white text-xl leading-7 mr-20">
      Current Block : #{{currentBlock}}
    </div>
    <EpochBarComponent current-block=""/>
  </div>

  <div class="pb-2 bg-black pt-2">
    <div class="w-full h-0 border-[1px] border-solid border-lime-500"></div>
  </div>
  <slot/>
</template>

<style scoped>

</style>
