<template>
  <div class="section">
    <h3 class="component-header">Eth Vault Set Params</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="Deposit Fee"
          variant="solo"
          v-model="_depositFee"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Withdraw Fee"
          variant="solo"
          v-model="_withdrawFee"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Deposit Min Amt"
          variant="solo"
          v-model="_depositMinAmt"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Withdraw Min Amt"
          variant="solo"
          v-model="_withdrawMinAmt"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Deposit Max Fee Amt"
          variant="solo"
          v-model="_depositMaxFeeAmt"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Withdraw Max Fee Amt"
          variant="solo"
          v-model="_withdrawMaxFeeAmt"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Mintable Amt At Epoch"
          variant="solo"
          v-model="_mintableAmtAtEpoch"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-checkbox
          v-model="isStop"
          color="red"
          :label="`Stopped: ${isStop.toString()}`"
      ></v-checkbox>
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
import Web3Manager, {ETH_DECIMAL, ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";


const store = useStore()
const { walletAddress, version } = storeToRefs(store)
const { contracts } = store;
let web3Manager: Web3Manager | null = null;


const _depositFee = ref('');
const _withdrawFee = ref('');
const _depositMinAmt = ref('');
const _withdrawMinAmt = ref('');
const _depositMaxFeeAmt = ref('');
const _withdrawMaxFeeAmt = ref('');
const _mintableAmtAtEpoch = ref('');
const isStop = ref(false);


onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  try{
    _depositFee.value = toDecimalNumber( await web3Manager.getEthVaultManager().depositFee(), ETH_DECIMAL);
    _withdrawFee.value = toDecimalNumber(await web3Manager.getEthVaultManager().withdrawFee(), ZEUSD_DECIMAL);
    _depositMinAmt.value = toDecimalNumber(await web3Manager.getEthVaultManager().depositMinAmt(), ETH_DECIMAL);
    _withdrawMinAmt.value = toDecimalNumber(await web3Manager.getEthVaultManager().withdrawMinAmt(), ZEUSD_DECIMAL);
    _depositMaxFeeAmt.value = toDecimalNumber(await web3Manager.getEthVaultManager().depositMaxFeeAmt(), ETH_DECIMAL);
    _withdrawMaxFeeAmt.value = toDecimalNumber(await web3Manager.getEthVaultManager().withdrawMaxFeeAmt(), ZEUSD_DECIMAL);
    _mintableAmtAtEpoch.value = toDecimalNumber(await web3Manager.getEthVaultManager().mintableAmtAtEpoch(), ZEUSD_DECIMAL);
    isStop.value = await web3Manager.getEthVaultManager().isEmergencyStopped();

  }catch (e) {
    console.log(e);
  }

});

const confirm = async() => {
  if(
      walletAddress
      && web3Manager
      && _depositFee.value!= ''
      && _withdrawFee.value != ''
      && _depositMinAmt.value != ''
      && _withdrawMinAmt.value!=''
      && _depositMaxFeeAmt.value!=''
      && _withdrawMaxFeeAmt.value!=''
      && _mintableAmtAtEpoch.value!=''
  ) {
    web3Manager?.getEthVaultManager().setParams(
        fromDecimalNumber(_depositFee.value, ETH_DECIMAL),
        fromDecimalNumber(_withdrawFee.value, ZEUSD_DECIMAL),
        fromDecimalNumber(_depositMinAmt.value, ETH_DECIMAL),
        fromDecimalNumber(_withdrawMinAmt.value, ZEUSD_DECIMAL),
        fromDecimalNumber(_depositMaxFeeAmt.value, ETH_DECIMAL),
        fromDecimalNumber(_withdrawMaxFeeAmt.value, ZEUSD_DECIMAL),
        fromDecimalNumber(_mintableAmtAtEpoch.value, ZEUSD_DECIMAL),
        isStop.value,
        walletAddress.value
    ).then((res) => {
      alert(res);
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
  overflow-y: auto; /* Make it scrollable vertically */

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
