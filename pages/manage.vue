<template>
  <div class="set-params-page">
    <h1 class="title">Set Parameters</h1>

    <div class="input-group">
      <label for="stable" class="label">Stable:</label>
      <input id="stable" v-model="stable" type="text" class="input" />
    </div>

    <div class="input-group">
      <label for="stable-decimal" class="label">Stable Decimal:</label>
      <input id="stable-decimal" v-model.number="stableDecimal" type="number" class="input" />
    </div>

    <div class="input-group">
      <label for="eth-price-decimal" class="label">ETH Price Decimal:</label>
      <input id="eth-price-decimal" v-model.number="ethPriceDecimal" type="number" class="input" />
    </div>

    <!-- The rest of the parameters -->

    <button @click="setParameters" class="button">Set</button>

    <div v-if="setResult" class="result-display">
      <p class="result-text">{{ setResult }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Web3Manager from "~/services/web3/web3Manager";
import {createWeb3Instance} from "~/services/web3/util";
const config = useRuntimeConfig()

const stable = ref(null);
const stableDecimal = ref(null);
const ethPriceDecimal = ref(null);
let setResult = ref<any>(null); // Replace this with the result from setParams function

const setParameters = async () => {
  // Here you will call the setParams function with the necessary parameters as arguments,
  // and assign the result to setResult value
  // const vaultManager = new VaultManager(createWeb3Instance(), config.public.vaultContract, config.public.zusdContract);;
  const web3Manager = new Web3Manager(createWeb3Instance(), config);
  const addresses = await createWeb3Instance().eth.getAccounts();
  if(stable.value && stableDecimal.value && ethPriceDecimal.value){
    // vaultManager.setParams(epoch.value, addresses[0]).then((res)=>{
    //   setResult.value = res;
    // });
  }
};
</script>

<style scoped>
.set-params-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background-color: #f5f5f5;
}

.title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.input {
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #333;
}

.button {
  height: 2rem;
  width: 6rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #333;
  color: #fff;
  cursor: pointer;
}

.result-display {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  padding: 1rem;
}

.result-text {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}
</style>
