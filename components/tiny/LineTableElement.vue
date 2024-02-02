<script setup lang="ts">

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits({
  userAction(payload: { item: any, key: string }) {
    // return `true` or `false` to indicate
    // validation pass / fail
  }
})

// console.log(props.column)
</script>

<template>
  <div v-if="props.column?.type == 'TEXT'" >
    {{props.item[props.column.key]}}
  </div>
  <div v-else-if="props.column?.type == 'LINKED_TEXT'" class="underline" @click="$emit('userAction', {key: props.column.key, item: props.item})">
    {{props.item[props.column.key]}} ↗
  </div>
  <div v-else-if="props.column?.type == 'BUTTONS'" style="display: inline-block;">
    <div v-if="props.item[props.column.key] == 'CLAIM'" @click="$emit('userAction', {key: props.column.key, item: props.item})" class="w-[150px] h-[28.41px] btn_green rounded-[43px] border border-lime-500 ">CLAIM</div>
    <div v-else-if="props.item[props.column.key] == 'COMPLETE'" @click="$emit('userAction', {key: props.column.key, item: props.item})" class="w-[150px] h-[28.41px] btn_green rounded-[43px] border border-lime-500">COMPLETE</div>
    <div v-else-if="props.item[props.column.key] == 'IN PROGRESS'" @click="$emit('userAction', {key: props.column.key, item: props.item})" class="w-[150px] h-[28.41px] btn_yellow rounded-[43px] border border-lime-500">IN PROGRESS</div>
    <div v-else-if="props.item[props.column.key] == 'ISSUED'" @click="$emit('userAction', {key: props.column.key, item: props.item})" class="w-[150px] h-[28.41px] btn_blue rounded-[43px] border border-lime-500 ">ISSUED</div>
    <div v-else-if="props.item[props.column.key] == 'CLAIMED'" @click="$emit('userAction', {key: props.column.key, item: props.item})" class="w-[150px] h-[28.41px] btn_blue rounded-[43px] border border-lime-500 ">CLAIMED</div>

  </div>
  <div v-else>
    {{props.item[props.column.key]}}
  </div>
</template>

<style scoped>
.btn_yellow {
  background: linear-gradient(
      270deg,
      rgba(250, 255, 0, 1) 0%,
      rgba(250, 255, 0, 0) 100%
  );
  box-shadow: 0px 1.78px 1.78px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4.44px);
}
.btn_green {
  background: linear-gradient(
      270deg,
      rgba(143, 255, 0, 1) 0%,
      rgba(143, 255, 0, 0) 100%
  );
  box-shadow: 0px 1.78px 1.78px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4.44px);
}
.btn_blue {
  background: linear-gradient(
      270deg,
      rgba(0, 133, 255, 1) 0%,
      rgba(0, 133, 255, 0) 100%
  );
  box-shadow: 0px 1.78px 1.78px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4.44px);

}
</style>
