<template>
  <div class="section">
    <h3 class="component-header">Set Token Info</h3>
    <div style="display: flex; flex-direction: column;">
      <v-text-field
          label="Token Address"
          variant="solo"
          v-model="tokenAddress"
          persistent-hint
          class="input"
      ></v-text-field>
      <v-text-field
          label="Chainlink Address"
          variant="solo"
          v-model="chainLinkAddress"
          persistent-hint
          class="input"
      ></v-text-field>

      <v-card v-for="(ammInfo, index) in ammInfos" :key="index" class="amm-card" >
        <v-text-field
            label="Pair Address"
            variant="solo"
            v-model="ammInfo.pairAddress"
            class="input-in-card"
        ></v-text-field>
        <v-checkbox
            v-model="ammInfo.isAtoB"
            label="Is A to B?"
            class="input-in-card"
        ></v-checkbox>
        <v-text-field
            label="Decimal A"
            variant="solo"
            v-model="ammInfo.decimalA"
            type="number"
            class="input-in-card"
        ></v-text-field>
        <v-text-field
            label="Decimal B"
            variant="solo"
            v-model="ammInfo.decimalB"
            type="number"
            class="input-in-card"
        ></v-text-field>
        <v-select
            label="Version"
            variant="solo"
            v-model="ammInfo.version"
            :items="['2', '3']"
            chips
            class="input-in-card"
        ></v-select>
        <v-btn @click="removeAMMInfo(index)" color="red" >Remove</v-btn>
      </v-card>

    </div>

    <div class="buttons">
      <v-btn @click="addAMMInfo" color="green">Add AMM</v-btn>

      <v-btn @click="confirm"
             color="blue-darken-2">Confirm</v-btn>
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

const tokenAddress = ref('');
const chainLinkAddress = ref('');
const ammInfos : any = reactive([{ pairAddress: '', isAtoB: true, decimalA: '18', decimalB: '18', version: '2' }]);

onMounted(async() => {
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  try{
  }catch (e) {
    console.log(e);
  }

});

const addAMMInfo = () => {
  ammInfos.push({ pairAddress: '', isAtoB: true, decimalA: '18', decimalB: '18', version: '2' });
};

const removeAMMInfo = (index: number) => {
  ammInfos.splice(index, 1);
};

const confirm = async() => {
  if(walletAddress && web3Manager) {
    await web3Manager?.getOracleManager().setTokenInfo_(tokenAddress.value, chainLinkAddress.value, ammInfos, walletAddress.value);
    alert('Token Info Set Successfully');
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


.amm-card {
  margin-bottom: 1rem; /* 카드 간 간격 */
  padding: 0.5rem;
  background-color: #efefef;
}

.input-in-card {
  margin-bottom: 0.2rem; /* 카드 내 간격 */
}

/* 마지막 input-in-card의 margin-bottom을 0으로 설정하여 중복 간격을 제거 */
.amm-card .input-in-card:last-child {
  margin-bottom: 0;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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

.amm-info {
  display: flex;
  align-items: center;
}

.remove-btn {
  margin-left: auto;
}
</style>
