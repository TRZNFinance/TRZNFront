<script setup>
import { ref } from 'vue';
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

const store = useStore();
const {walletAddress, version, IS_STOP} = storeToRefs(store);

const showModal = ref(false);
const title = ref('');
const content = ref('');

const openModal = (modalTitle, modalContent) => {
  title.value = modalTitle;
  content.value = modalContent;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div v-if="IS_STOP" class="fixed inset-0 flex items-center justify-center z-50">
    <!-- 모달 배경 -->
    <div class="fixed inset-0 bg-gray-800 opacity-50"></div>

    <!-- 모달 컨테이너 -->
    <div class="bg-white p-4 rounded-lg shadow-lg">
      <!-- 모달 닫기 버튼 -->
      <div
          class="justify-center text-red-600 text-center text-2xl font-medium leading-8 uppercase relative max-w-[892px] mt-32 mb-24 max-md:max-w-full max-md:my-10"
      >
    <span class="font-bold text-red-600">Selling Restricted<br /></span
    ><span class="font-medium text-white"
      >The quota for zeUSD in the current Epoch has been met and selling has
      been disabled until the next Epoch.<br /><br /></span
      ><span class="font-bold text-red-600">Emergency Stop Enacted<br /></span
      ><span class="font-medium text-white"
      >Due to unaccounted circumstances, Emergency Stop has been enacted on the
      platform for Minting and Selling zeUSD.</span
      >
      </div>
      <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" @click="closeModal">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- 모달 내용 -->
      <h2 class="text-2xl font-semibold">{{ title }}</h2>
      <p class="mt-2">{{ content }}</p>
    </div>
  </div>
</template>
<style scoped>

</style>
