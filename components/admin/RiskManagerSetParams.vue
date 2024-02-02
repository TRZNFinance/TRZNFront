<template>
  <div class="section">
    <h3 class="component-header">Eth Vault Set Params</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="Unit"
          variant="solo"
          v-model="unit"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Gap"
          variant="solo"
          v-model="ratio"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="ChiefRiskManager"
          variant="solo"
          v-model="chiefRiskManager"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="EscrowToken"
          variant="solo"
          v-model="escrowToken"
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
import Web3Manager, {ETH_DECIMAL, ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";


const store = useStore()
const { walletAddress, version } = storeToRefs(store)
const { contracts } = store;

let web3Manager: Web3Manager | null = null;


const unit = ref('');
const ratio = ref('');
const chiefRiskManager = ref('');
const escrowToken = ref('');


onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  // try{
    unit.value = '' + await web3Manager.getRiskManagerEscrowManager().getUnitRatio();
    chiefRiskManager.value = await web3Manager.getRiskManagerEscrowManager().getChiefRiskManager();
    escrowToken.value = await web3Manager.getRiskManagerEscrowManager().getEscrowToken();
    ratio.value = '' + await web3Manager.getRiskManagerEscrowManager().getGap();
  // }catch (e) {
  //   console.log(e);
  // }

});

const confirm = async() => {
  if(
      walletAddress
      && web3Manager
      && unit.value!= ''
      && ratio.value != ''
      && chiefRiskManager.value != ''
      && escrowToken.value!=''
  ) {
    web3Manager?.getRiskManagerEscrowManager().setPara(
        unit.value,
        ratio.value,
        chiefRiskManager.value,
        escrowToken.value,
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
