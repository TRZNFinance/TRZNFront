<script setup lang="ts">

import InfoRowComponent from "~/components/tiny/InfoRowComponent.vue";
import LimeBoxFrame from "~/components/tiny/LimeBoxFrame.vue";
import InfoHeadComponent from "~/components/tiny/InfoHeadComponent.vue";
import LargeEpochNumberComponent from "~/components/tiny/LargeEpochNumberComponent.vue";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from "~/services/web3/util";
import { ref, onMounted } from 'vue';
import Web3Manager, {ZEUSD_DECIMAL, ETH_DECIMAL} from "~/services/web3/web3Manager";
import BigNumber from "bignumber.js";

const props = defineProps({
  isBuy: {
    type: Boolean,
    required: true,
    default: true,
  },
})

const store = useStore()
store.updateEpochInfo();
store.updateCurrentBlock();
store.updatePriceInfo();

const { epochInfo, priceInfo } = storeToRefs(store)
const { contracts } = store;

let web3Manager: Web3Manager | null = null;

const epochInfo_ = ref<any>(null);
const mintableAmtAtEpoch = ref<any>(null);

onMounted(async() => {
  console.log('haha1');
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  epochInfo_.value = await web3Manager.getEthVaultManager().epochInfo(epochInfo.value?.curEpoch);
  // console.log(epochInfo_.value.mintedZeUSD);
  mintableAmtAtEpoch.value = await web3Manager.getEthVaultManager().mintableAmtAtEpoch();
  console.log(epochInfo.value?.curEpoch);
  if(epochInfo.value!= null){
    epochInfo_.value = await web3Manager.getEthVaultManager().epochInfo(epochInfo.value?.curEpoch);
    console.log(epochInfo_.value.mintedZeUSD);
    mintableAmtAtEpoch.value = await web3Manager.getEthVaultManager().mintableAmtAtEpoch();
    console.log(mintableAmtAtEpoch.value);
  }
});

</script>

<template>

  <LimeBoxFrame>

    <InfoHeadComponent
        v-if="!props.isBuy"
    >
      Claimable Epoch
    </InfoHeadComponent>
    <LargeEpochNumberComponent v-if="!props.isBuy">
      {{Number(epochInfo?.curEpoch) + 2}}
    </LargeEpochNumberComponent>

    <InfoHeadComponent>
      EPOCH SUMMARY
    </InfoHeadComponent>
    <InfoRowComponent info-title="CURRENT EPOCH" :info-contents="'' + epochInfo?.curEpoch" />
    <InfoRowComponent info-title="EPOCH DURATION" :info-contents="`#${epochInfo?.epochStartBlock} ~ #${epochInfo?.epochEndBlock}`" />
    <InfoRowComponent v-if=priceInfo info-title="1 ETH PRICE (USD)" :info-contents="`$${toDecimalNumber(priceInfo?.eth.price, priceInfo?.eth.decimal)}`"/>

    <InfoHeadComponent class="mt-8"
    >
      EPOCH AMOUNTS
    </InfoHeadComponent>
    <InfoRowComponent info-title="EPOCH MINT LIMIT" :info-contents="`${toDecimalNumber(mintableAmtAtEpoch,ZEUSD_DECIMAL)} ZeUSD`"/>
    <InfoRowComponent info-title="AMOUNT MINTED" :info-contents="`${toDecimalNumber(epochInfo_?.mintedZeUSD,ZEUSD_DECIMAL)} (${new BigNumber(epochInfo_?.mintedZeUSD).dividedBy(mintableAmtAtEpoch).multipliedBy(100).toFixed(2)}%)`"/>
    <InfoRowComponent info-title="REMAINING SUPPLY" :info-contents="`${toDecimalNumber(new BigNumber(mintableAmtAtEpoch).minus(epochInfo_?.mintedZeUSD),ZEUSD_DECIMAL)} (${new BigNumber(new BigNumber(mintableAmtAtEpoch).minus(epochInfo_?.mintedZeUSD)).dividedBy(mintableAmtAtEpoch).multipliedBy(100).toFixed(2)}%)`"/>
  </LimeBoxFrame>
</template>

<style scoped>

</style>
