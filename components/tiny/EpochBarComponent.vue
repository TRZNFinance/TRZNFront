<script setup lang="ts">
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

// const props = defineProps({
//   currentEpoch: {
//     type: String,
//     required: true,
//     default: 'Loading'
//   },
//   currentBlock: {
//     type: String,
//     required: true,
//     default: '7000'
//   },
//   startBlock: {
//     type: String,
//     required: true,
//     default: '5000'
//   },
//   endBlock: {
//     type: String,
//     required: true,
//     default: '10000'
//   },
//   nextEpoch: {
//     type: String,
//     required: true,
//     default: 'Loading'
//   },
// })


const store = useStore()
// store.updateEpochInfo();
// store.updateCurrentBlock();
// store.updatePriceInfo();

const { epochInfo, currentBlock} = storeToRefs(store)

// const dynamicWidth = ref('10%');

// onMounted(() => {
//   dynamicWidth.value =
// })

const dynamicWidth = () => {
  // console.log( 'bb', currentBlock.value);
  return ((Number(currentBlock.value) - Number(epochInfo.value?.epochStartBlock)) / Number(epochInfo.value?.epochLength) * 90 + 10) + '%'
}
</script>

<template>
  <div
      class="self-stretch flex flex-grow items-stretch justify-between gap-3.5 max-md:max-w-full max-md:flex-wrap max-md:justify-center"
  >
    <div class="text-white text-xl leading-7 self-center my-auto">#{{epochInfo?.curEpoch}}</div>
    <div
        class="flex flex-grow items-stretch gap-5 pl-1.5 pr-2.5 py-1.5 rounded border-[0.5px] border-solid border-lime-500 max-md:max-w-full max-md:flex-wrap"
    >
      <div
          class="text-black text-sm leading-5 whitespace-nowrap bg-lime-500 items-stretch py-1.5 rounded max-md:max-w-full"
          :style="{ width: dynamicWidth()}"
      >
        {{epochInfo?.epochStartBlock}}
      </div>
      <div
          class="text-white text-right text-sm grow leading-5 self-center whitespace-nowrap my-auto"
      >
        {{epochInfo?.epochEndBlock}}
      </div>
    </div>
    <div
        class="text-white text-xl leading-7 self-center whitespace-nowrap my-auto"
    >
      #{{epochInfo?.curEpoch ? Number(epochInfo?.curEpoch) + 1: ''}}
    </div>
  </div>
</template>

<style scoped>

</style>
