<template>
  <div class="section">
    <h3 class="component-header">Update Reward</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="ETH Amount"
          variant="solo"
          v-model="amount"
          :hint="`Current Balance: ${toDecimalNumber(Balance_Ethereum, ETH_DECIMAL)}`"
          persistent-hint
          class="input"
      ></v-text-field>
    </div>

    <div class="buttons">
      <v-btn @click="confirm"
             color="blue">Confirm</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import Web3Manager, {ETH_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

const store = useStore();
const { walletAddress, version, Balance_Ethereum } = storeToRefs(store)
const {contracts} = store;

let web3Manager: Web3Manager | null = null;

const amount = ref('');


onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
});

const confirm = async() => {
  // Call the SellETH function with sellAmount.value
  // console.log(walletAddress, vaultManager, sellAmount.value)
  if(walletAddress && web3Manager && amount.value!=''){
    web3Manager?.rmUpdateReward(fromDecimalNumber(amount.value, ETH_DECIMAL), walletAddress.value).then((res) => {
      alert(res);
    });
  }
};

</script>

<style scoped>
.trade-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background-color: #f5f5f5;
}

.component-header {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}


.section {
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fff;
}

.input {
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
}

.button {
  height: 2rem;
  width: 6rem;
  //border-radius: 0.5rem;
  border: none;
  //background-color: #333;
  //color: #fff;
  cursor: pointer;
}
</style>
