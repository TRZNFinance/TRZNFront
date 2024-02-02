<template>
  <div class="section">
    <h3 class="component-header">Deposit Escrow</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="RM Account Address"
          variant="solo"
          v-model="address"
          persistent-hint
          class="input"
          @change="fetchRMInfo"
      ></v-text-field>
    </div>
    <v-card v-if="rmInfo" class="info-display">
      <v-card-title>My RM Info</v-card-title>

      <v-card-text >Minted ZeUSD: {{ toDecimalNumber(rmInfo.mintedAmt, ZEUSD_DECIMAL) }}</v-card-text>
      <v-card-text >Escrow USDC: {{ toDecimalNumber(rmInfo.escrowAmt, ESCROW_DECIMAL) }}</v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import Web3Manager, {ESCROW_DECIMAL, ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import BigNumber from "bignumber.js";
import {Buffer} from "unenv/runtime/node/buffer/_buffer";
import from = Buffer.from;
import {useStore} from "~/store";
import {storeToRefs} from "pinia";


const store = useStore();
const {contracts} = store;

let web3Manager: Web3Manager | null = null;

const address = ref('');

let rmInfo = ref<any>(null); // Replace this with the value fetched from getRMInfo function

onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
});

const fetchRMInfo = async () => {
  rmInfo.value = null;
  const temp = {
    mintedAmt: '',
    escrowAmt: '',
  };
  if(address.value && web3Manager){
    console.log('1');
    temp.mintedAmt = await web3Manager.getRiskManagerEscrowManager().getRiskManagerAmt(address.value);
    temp.escrowAmt = await web3Manager.getRiskManagerEscrowManager().riskManagerEscrowAmt(address.value, web3Manager.getEscrowTokenManager().getContractAddress());
    rmInfo.value = temp;
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
