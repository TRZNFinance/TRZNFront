<template>
  <div class="section">
    <h3 class="component-header">Emergency Actions</h3>

    <!-- Emergency Stop -->
    <v-card class="emergency-card">
      <v-checkbox v-model="isStop" label="Emergency Stop"
                  variant="solo"></v-checkbox>
      <v-btn @click="confirmEmergencyStop" color="red">Confirm Stop</v-btn>
    </v-card>

    <!-- Emergency Withdraw -->
    <v-card class="emergency-card">
      <v-text-field
          label="Target ERC20 Token"
          variant="solo"
          v-model="targetERC20Token"
      ></v-text-field>
      <v-btn @click="confirmEmergencyWithdraw" color="red">Emergency Withdraw</v-btn>
    </v-card>

    <!-- Emergency Withdraw From Vault -->
    <v-card class="emergency-card">
      <v-text-field
          label="Vault"
          variant="solo"
          v-model="vault"
      ></v-text-field>
      <v-text-field
          label="ERC20 Token"
          variant="solo"
          v-model="erc20Token"
      ></v-text-field>
      <v-btn @click="confirmEmergencyWithdrawFromVault" color="red">Withdraw From Vault</v-btn>
    </v-card>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createWeb3Instance } from '~/services/web3/util';
import Web3Manager, {ETH_DECIMAL, ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

const store = useStore()
const { walletAddress, version } = storeToRefs(store)
const { contracts } = store;
let web3Manager: Web3Manager | null = null;

const isStop = ref(false);
const targetERC20Token = ref('');
const vault = ref('');
const erc20Token = ref('');

onMounted(async () => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  try{
    isStop.value = await web3Manager.getEthVaultManager().isEmergencyStopped();
  }catch (e) {
    console.log(e);
  }
});

const confirmEmergencyStop = async () => {
  if (web3Manager && walletAddress) {
    try {
      await web3Manager.getEthVaultManager().emergencyStop(isStop.value, walletAddress.value);
      alert('Emergency stop executed successfully!');
    } catch (error) {
      console.error('Error during emergency stop:', error);
      alert('Failed to execute emergency stop.');
    }
  }
};

const confirmEmergencyWithdraw = async () => {
  if (web3Manager && walletAddress && targetERC20Token.value) {
    try {
      await web3Manager.getEthVaultManager().emergencyWithdraw(targetERC20Token.value, walletAddress.value);
      alert('Emergency withdraw executed successfully!');
    } catch (error) {
      console.error('Error during emergency withdraw:', error);
      alert('Failed to execute emergency withdraw.');
    }
  }
};

// const confirmEmergencyWithdrawFromVault = async () => {
//   if (web3Manager && walletAddress && vault.value && erc20Token.value) {
//     try {
//       await web3Manager.getEthVaultManager().emergencyWithdrawFromVault(vault.value, erc20Token.value, walletAddress.value);
//       alert('Withdraw from vault executed successfully!');
//     } catch (error) {
//       console.error('Error during withdraw from vault:', error);
//       alert('Failed to execute withdraw from vault.');
//     }
//   }
// };
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

.emergency-card {
  margin-bottom: 1rem; /* 카드 간 간격 */
  padding: 0.5rem;
  background-color: #efefef;
}

</style>
