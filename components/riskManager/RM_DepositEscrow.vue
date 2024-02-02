<template>
  <div class="section">
    <h3 class="component-header">Deposit Escrow</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="USDC Amount"
          variant="solo"
          v-model="amount"
          :hint="`Current Balance : ${toDecimalNumber(Balance_Escrow, ESCROW_DECIMAL)}`"
          persistent-hint
          class="input"
      ></v-text-field>
    </div>
    <v-card v-if="rmInfo" class="info-display">
      <v-card-title>My RM Info</v-card-title>

      <v-card-text >Minted ZeUSD: {{ rmInfo.mintedAmt }}</v-card-text>
      <v-card-text >Escrow USDC: {{ rmInfo.escrowAmt }}</v-card-text>
    </v-card>
    <div class="buttons">
      <v-btn @click="approve"
             color="green">1. Approve</v-btn>
      <v-btn @click="confirm"
             color="blue">2. Confirm</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import Web3Manager, {ESCROW_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

const store = useStore();
const { walletAddress, version, Balance_Escrow } = storeToRefs(store)
const {contracts} = store;

let web3Manager: Web3Manager | null = null;

const epoch = ref<string>('');
const amount = ref('');

let rmInfo = ref<any>(null); // Replace this with the value fetched from getRMInfo function

onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  await fetchRMInfo();

});

const fetchRMInfo = async () => {
  rmInfo.value = null;
  const temp = {
    mintedAmt: '',
    escrowAmt: '',
  };
  if(walletAddress && web3Manager){
    console.log('1');
    temp.mintedAmt = await web3Manager.getRiskManagerEscrowManager().getRiskManagerAmt(walletAddress.value);
    temp.escrowAmt = await web3Manager.getRiskManagerEscrowManager().riskManagerEscrowAmt(walletAddress.value, web3Manager.getEscrowTokenManager().getContractAddress());

    rmInfo.value = temp;
  }

};
const approve = async () => {

  if(web3Manager && walletAddress && amount.value != ''){
    web3Manager.getEscrowTokenManager().approve(web3Manager.getRiskManagerEscrowManager().getContractAddress(), amount.value, walletAddress.value).then((res)=>{
      alert(res);
    });
  }
};
const confirm = async () => {

  if(web3Manager && walletAddress && epoch.value != '' && amount.value != ''){
    web3Manager.getRiskManagerEscrowManager().depositEscrow(web3Manager.getEscrowTokenManager().getContractAddress(), fromDecimalNumber(amount.value, ESCROW_DECIMAL), walletAddress.value).then((res)=>{
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
