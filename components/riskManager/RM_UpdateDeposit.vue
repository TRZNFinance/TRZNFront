<template>
  <div class="section">
    <h3 class="component-header">Update Deposit</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="Epoch Number"
          variant="solo"
          v-model="epoch"
          :hint="`Latest Updated Epoch: `"
          persistent-hint
          @change="fetchRMInfo"
          type="number"
          class="input"
      ></v-text-field>
      <v-text-field
          label="ETH Amount"
          variant="solo"
          v-model="amount"
          :hint="`Current Balance: ${toDecimalNumber(Balance_Ethereum, ETH_DECIMAL)}`"
          persistent-hint
          class="input"
      ></v-text-field>
    </div>
    <v-card v-if="rmInfo" class="info-display">
      <v-card-title>Status at Epoch #{{epoch}}</v-card-title>

      <v-card-text >Updated: {{ rmInfo.status }}</v-card-text>
      <v-card-text >Withdraw: {{ rmInfo.withdrawString }}</v-card-text>
      <v-card-text >Deposit(Requested ETH): {{ rmInfo.depositString }}</v-card-text>
    </v-card>
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
import BigNumber from "bignumber.js";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";


const store = useStore();
const { walletAddress, version, Balance_Ethereum } = storeToRefs(store)
const {contracts} = store;

let web3Manager: Web3Manager | null = null;

const epoch = ref<string>('');
const amount = ref('');
let rmInfo = ref<any>(null); // Replace this with the value fetched from getRMInfo function
let updateResult = ref<any>(null); // Replace this with the result from RM_Update function

onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
});

const fetchRMInfo = async () => {
  if(epoch.value !=''){
    rmInfo.value = null;
    web3Manager?.getRMInfo(epoch.value).then((_rmInfo)=>{
      console.log('rminfo', _rmInfo);
      rmInfo.value = _rmInfo;
      amount.value = new BigNumber(_rmInfo.deposit).dividedBy(10**ETH_DECIMAL).toString();
    });
  }
};
const confirm = async () => {

  if(walletAddress && epoch.value != '' && amount.value != ''){
    web3Manager?.rmUpdateDeposit(epoch.value, fromDecimalNumber(amount.value, ETH_DECIMAL), walletAddress.value).then((res)=>{
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
  margin-top: 1rem;
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
