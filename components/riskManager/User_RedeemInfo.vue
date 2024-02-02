<template>
  <div class="section">
    <h3 class="component-header">Redemption Information</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="User Address"
          variant="solo"
          v-model="user"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Target Epoch"
          variant="solo"
          v-model="epoch"
          persistent-hint
          type="number"
          class="input"
      ></v-text-field>
    </div>
    <v-card v-if="redeemInfo !== null" class="info-display">
      <v-card-title>Status at Epoch #{{epoch}}</v-card-title>

      <v-card-text >Status: {{ redeemInfo.status }}</v-card-text>
      <v-card-text >DepositAmt: {{ toDecimalNumber(redeemInfo.depositAmt, ZEUSD_DECIMAL) }}</v-card-text>
      <v-card-text >WithdrawAmt: {{ toDecimalNumber(redeemInfo.requestWithdrawAmt, ETH_DECIMAL) }}</v-card-text>
    </v-card>
    <div class="buttons">
      <v-btn @click="fetchRedeemInfo"
             color="blue">Fetch</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import Web3Manager, {ETH_DECIMAL, ZEUSD_DECIMAL} from "~/services/web3/web3Manager";

const config = useRuntimeConfig()

let web3Manager: Web3Manager | null = null;
let walletAddress: string | null = null;

const user = ref('');
const epoch = ref('');
let redeemInfo = ref<null|{
  status: boolean;
  depositAmt: number;
  requestWithdrawAmt: number
}>(null); // Replace this with the value fetched from getRedeemInfo function

const fetchRedeemInfo = async () => {
  // Here you will call the getRedeemInfo function with user.value and epoch.value as arguments,
  // and assign the result to redeemInfo value
  const web3Manager = new Web3Manager(createWeb3Instance(), config);
  if(user.value && epoch.value != ''){
    // vaultManager.getRedeemInfo(user.value, epoch.value).then((_redeemInfo)=>{
    //   redeemInfo.value = _redeemInfo
    // });
    web3Manager.getRedeemInfoAtEpoch(user.value, epoch.value).then((_redeemInfo)=>{
      redeemInfo.value = _redeemInfo;
    });
  }
};

</script>

<style scoped>
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

</style>
