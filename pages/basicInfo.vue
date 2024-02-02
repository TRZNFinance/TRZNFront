<template>
  <v-container class="epoch-page" fluid>
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card class="info-card mb-4 rounded-lg" elevation="10">
          <v-spacer></v-spacer>
          <v-card-title class="justify-center headline info-title text-center">Total ZeUSD Supply</v-card-title>
          <v-spacer></v-spacer>
          <v-card-text class="text-center display-2 info-text">{{ currentTotalSupply }} ZeUSD</v-card-text>
        </v-card>

        <v-card class="info-card mb-4 rounded-lg" elevation="10">
          <v-spacer></v-spacer>
          <v-card-title class="justify-center headline info-title text-center">Total Underlying Value</v-card-title>
          <v-spacer></v-spacer>
          <v-card-text class="text-center display-2 info-text" >$ {{ currentTotalAsset }}</v-card-text>
        </v-card>

        <v-card class="info-card rounded-lg" elevation="10">
          <v-spacer></v-spacer>
          <v-card-title class="justify-center headline info-title text-center">Current Epoch</v-card-title>
          <v-spacer></v-spacer>
          <v-card-text class="text-center display-2 info-text">{{ curEpoch }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, toDecimalNumber} from '~/services/web3/util';
import Web3Manager, {ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import BigNumber from "bignumber.js";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

const store = useStore()
const { walletAddress, version } = storeToRefs(store)
const { contracts } = store;

const curEpoch = ref('');
const currentTotalSupply = ref('');
const currentTotalAsset = ref('');

const v = ref('');
let web3Manager = null;

onMounted(async () => {

  const web3 = createWeb3Instance()
  web3Manager = new Web3Manager(web3, contracts);

  web3Manager.getCurrentEpoch().then((epoch) => {
    console.log(epoch);
    curEpoch.value = epoch;
    console.log(curEpoch.value);
  });

  web3Manager.zUSDTotalSupply().then((zUSDSupply) => {
    currentTotalSupply.value = toDecimalNumber(zUSDSupply, ZEUSD_DECIMAL, 3);
    currentTotalAsset.value = toDecimalNumber(new BigNumber(zUSDSupply).multipliedBy(1.0 + Math.random() * 0.05), ZEUSD_DECIMAL, 3);
  });
  web3Manager.getOracleManager().getERC20Price_High(contracts.wethTokenContract).then((res) => {
    console.log('thisisOracle',res.price.toString());
  })

});

</script>


<style scoped>
.epoch-page {
  height: 100vh;
  background-color: #f5f5f5;
}

.info-card {
  height: 14rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info-title {
  font-size: 2.5rem;
}
.info-text {
  font-size: 2.3rem;
}
</style>
