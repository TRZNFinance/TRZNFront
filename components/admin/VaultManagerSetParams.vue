<template>
  <div class="section">
    <h3 class="component-header">VaultManagerSetParams</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="Oracle"
          variant="solo"
          v-model="oracle"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Stable Token"
          variant="solo"
          v-model="stable"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Escrow Contract"
          variant="solo"
          v-model="escrow"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Insurance Fund Address"
          variant="solo"
          v-model="insuranceFund"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Epoch update at"
          variant="solo"
          v-model="newEpochStart"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Epoch term"
          variant="solo"
          v-model="epochTerm"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="fee ratio"
          variant="solo"
          v-model="fee"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="unit ratio"
          variant="solo"
          v-model="unitRatio"
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
import { createWeb3Instance } from '~/services/web3/util';
import Web3Manager from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

const store = useStore()
const { walletAddress, version } = storeToRefs(store)
const { contracts } = store;
let web3Manager: Web3Manager | null = null;


const oracle = ref('');
const stable = ref('');
const escrow = ref('');
const insuranceFund = ref('');
const newEpochStart = ref('');
const epochTerm = ref('');
const fee = ref('');
const unitRatio = ref('');


onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  try{
    oracle.value = await web3Manager.getEthVaultManager().oracle();
    stable.value = await web3Manager.getEthVaultManager().stableToken();
    escrow.value = await web3Manager.getEthVaultManager().escrowRiskManager();
    insuranceFund.value = await web3Manager.getEthVaultManager().insuranceFund();
    newEpochStart.value = ''+await web3Manager.getCurrentEpoch();
    epochTerm.value = ''+await web3Manager.getStableTokenManager().epochTerm();
    fee.value = '' + await web3Manager.getEthVaultManager().fee();
    unitRatio.value = ''+await web3Manager.getEthVaultManager().unitRatio();

  }catch (e) {
    console.log(e);
  }

});

const confirm = async() => {
  if(
      walletAddress
      && web3Manager
      && oracle.value!= ''
      && stable.value != ''
      && escrow.value!=''
      && insuranceFund.value!=''
      && fee.value!=''
      && unitRatio.value!=''
  ){
    web3Manager?.getEthVaultManager().setParams2(
      oracle.value,
      stable.value,
      contracts.wethTokenContract,
      escrow.value,
      insuranceFund.value,
      fee.value,
      unitRatio.value,
      walletAddress.value
    ).then((res) => {
      alert(res);
    });
  }
  if(
      walletAddress
      && web3Manager
      && newEpochStart.value!=''
      && epochTerm.value!=''
  ){
    web3Manager?.getStableTokenManager().setParams(
        contracts.vaultEthContract,
        newEpochStart.value,
        epochTerm.value,
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
