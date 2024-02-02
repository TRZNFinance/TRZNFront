<template>
  <div class="section">
    <h3 class="component-header">Set Params (on/offchain ratio)</h3>

    <v-text-field
        label="Unit"
        v-model="unit"
        type="number"
        variant="solo"
        class="input"
    ></v-text-field>

    <v-text-field
        label="Ratio"
        v-model="ratio"
        type="number"
        variant="solo"
        class="input"
    ></v-text-field>

    <v-text-field
        label="Ratio"
        v-model="precisionLimit"
        type="number"
        variant="solo"
        class="input"
    ></v-text-field>

    <v-btn @click="confirm" color="blue">Set TokenInfo</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createWeb3Instance } from '~/services/web3/util';
import Web3Manager from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";


const store = useStore()
const { walletAddress, version } = storeToRefs(store)
const { contracts } = store;
let web3Manager: Web3Manager | null = null;

const unit = ref('');
const ratio = ref('');
const precisionLimit = ref('');

onMounted(async () => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  try{
    unit.value = await web3Manager.getOracleManager().unitRatio();
    ratio.value = await web3Manager.getOracleManager().gap();
    precisionLimit.value = await web3Manager.getOracleManager().precisionLimit();
  }catch (e) {
    console.log(e);
  }
});

const confirm = async () => {
  if (walletAddress && web3Manager && unit.value && ratio.value) {
    try {
      await web3Manager?.getOracleManager().setParams(Number(unit.value), Number(ratio.value), precisionLimit.value, walletAddress.value);
      alert('Params set successfully!');
    } catch (error) {
      console.error('Error setting params:', error);
      alert('Failed to set params.');
    }
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
  margin-bottom: 0.5rem;
}

</style>
