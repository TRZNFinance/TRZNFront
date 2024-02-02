<script setup lang="ts">
import { ref, computed } from 'vue';
import LineTableElement from "~/components/tiny/LineTableElement.vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits({
  userAction(payload: { item: any, key: string }) {
    // return `true` or `false` to indicate
    // validation pass / fail
    return true;
  }
})

</script>

<template>
  <div class="bg-black pl-6 pr-6">
    <table class="table bg-black">
      <thead>
      <tr>
        <th v-for="column in columns.slice(0, -1)" :key="column.key" class="inner-cell">
          {{ column.label }}
        </th>
        <td :key="columns[columns.length-1].key">
          {{ columns[columns.length-1].label}}
        </td>
      </tr>
      </thead>
      <tbody>
      <tr v-if="data.length > 0" :key="data[0].id" class="first-row ">
        <td v-for="column in columns.slice(0, -1)" :key="column.key" class="inner-cell">
<!--          {{ data[0][column.key] }}-->
          <LineTableElement :item="data[0]" :column="column" @user-action="payload => {$emit('userAction', payload);}"/>
        </td>
        <td :key="columns[columns.length-1].key">
<!--          {{ data[0][columns[columns.length-1].key] }}-->
          <LineTableElement :item="data[0]" :column="columns[columns.length-1]" @user-action="payload => {$emit('userAction', payload);}"/>
        </td>
      </tr>
      <tr v-for="item in data.slice(1, -1)" :key="item.id">
        <td v-for="column in columns.slice(0, -1)" :key="column.key" class="inner-cell">
<!--          {{ item[column.key] }}-->
          <LineTableElement :item="item" :column="column"  @user-action="payload => {$emit('userAction', payload);}"/>
        </td>
        <td :key="columns[columns.length-1].key">
<!--          {{ item[columns[columns.length-1].key] }}-->
          <LineTableElement :item="item" :column="columns[columns.length-1]" @user-action="payload => {$emit('userAction', payload);}"/>
        </td>
      </tr>
      <tr  v-if="data.length > 1" :key="data[data.length - 1].id" class="last-row">
        <td v-for="column in columns.slice(0, -1)" :key="column.key" class="inner-cell">
<!--          {{ data[data.length - 1][column.key] }}-->
          <LineTableElement :item="data[data.length - 1]" :column="column" @user-action="payload => {$emit('userAction', payload);}"/>
        </td>
        <td :key="columns[columns.length-1].key">
          <LineTableElement :item="data[data.length - 1]" :column="columns[columns.length-1]" @user-action="payload => {$emit('userAction', payload);}"/>
<!--          {{ data[data.length - 1][columns[columns.length-1].key] }}-->
        </td>
      </tr>
      </tbody>
    </table>
    <div class="bg-black flex justify-center pt-2">
      <div class="text-white underline" @click="$emit('userAction', { item: null, key: 'more' })">View More</div>
      <img class="h-4 w-4 ml-2 " src="@/assets/image/icon/upright_arrow.svg" alt="">
    </div>
    <div class="pb-2 bg-black">
      <div class="w-full h-0 border-[0.3px] border-solid border-lime-500"></div>
    </div>
  </div>
</template>

<style scoped>
/* 스타일링을 원하는대로 수정합니다. */
.table {
  width: 100%;
  border-collapse: collapse;
  background: black;
}

.table th, .table td {
  //border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  background: black;
  color: white;
}

.table th {
  //background-color: #f2f2f2;
  background: black;
}
/* 첫 번째 행의 위쪽에 수평 선 추가 */
.first-row {
  border-top: 1px solid #8FFF00;
}

/* 마지막 행의 아래쪽에 수평 선 추가 */
.last-row {
  border-bottom: 1px solid #8FFF00;
}

.inner-cell {
  border-right: 1px solid #8FFF00;
  padding: 8px;
  text-align: left;
}
</style>
