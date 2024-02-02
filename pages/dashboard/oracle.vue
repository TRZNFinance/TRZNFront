
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import BigNumber from "bignumber.js";
import Web3Manager, {ZEUSD_DECIMAL, ETH_DECIMAL, PRICE_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import EpochBar from "~/components/common/EpochBar.vue";
import InfoRowComponent from "~/components/tiny/InfoRowComponent.vue";
import LimeBoxFrame from "~/components/tiny/LimeBoxFrame.vue";
import InfoHeadComponent from "~/components/tiny/InfoHeadComponent.vue";
import type {PriceObject} from "~/services/web3/util";
import web3Manager from "~/services/web3/web3Manager";

const store = useStore()
store.updatePriceInfo()

const { priceInfo, contracts } = storeToRefs(store)

const high = ref<null | PriceObject>(null);
const low = ref<null | PriceObject>(null);
const median_high = ref<null | PriceObject>(null);

onMounted(async () => {
  // await connect();
  const web3Manager = new Web3Manager(createWeb3Instance(), contracts.value);
  // priceInfo.value = {
  //   eth: await web3Manager.getOracleManager().getERC20Price_High(contracts.value.wethTokenContract),
  // }
  try{
    high.value = await web3Manager.getOracleManager().getERC20Price_High(contracts.value.wethTokenContract);
  }catch (e) {

  }
  try{
    low.value = await web3Manager.getOracleManager().getERC20Price_Low(contracts.value.wethTokenContract);
  }catch (e) {

  }
  try{
    median_high.value = await web3Manager.getOracleManager().getERC20Price_Median_High(contracts.value.wethTokenContract);
  }catch (e) {

  }
})


</script>


<template>
<EpochBar>
<!--    <NavigationBar>-->
  <div class="flex p-4 gap-10 justify-center">
    <LimeBoxFrame class="lg:w-6/12 pb-5" >
      <InfoHeadComponent>
        ORACLES INFO
      </InfoHeadComponent>
      <InfoHeadComponent>
        ETH
      </InfoHeadComponent>
      <InfoRowComponent info-title="ETH PRICE" :info-contents="`$${toDecimalNumber(priceInfo?.eth.price, priceInfo?.eth.decimal)}`" />
      <InfoRowComponent info-title="NEXT OSM PRICE" :info-contents="`$${toDecimalNumber(high?.price, high?.decimal)}`" />
      <InfoRowComponent info-title="MEDIAN" :info-contents="`$${toDecimalNumber(low?.price, low?.decimal)}`"/>
      <InfoRowComponent info-title="NEXT UPDATE" :info-contents="`$${toDecimalNumber(median_high?.price, median_high?.decimal)}`" />
    </LimeBoxFrame>
  </div>
</EpochBar>
</template>


<style scoped>
.trade-page {
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  padding-top: 2rem;
  height: 90vh;
  background-color: #f5f5f5;
}

.section {
  width: 60vh;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fff;
}


.title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}
.component-header {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.input {
  margin-bottom: 1rem;
}


.v-tab {
  text-transform: none !important;
}

.buttons {
  display: flex;
  gap: 1rem;
}

.info-display {
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

</style>
