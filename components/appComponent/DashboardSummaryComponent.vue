<script setup lang="ts">

import InfoRowComponent from "~/components/tiny/InfoRowComponent.vue";
import LimeBoxFrame from "~/components/tiny/LimeBoxFrame.vue";
import InfoHeadComponent from "~/components/tiny/InfoHeadComponent.vue";
import {storeToRefs} from "pinia";
import {useStore} from "~/store";
import {toDecimalNumber} from "~/services/web3/util";
const store = useStore()

const { epochInfo, currentBlock, priceInfo} = storeToRefs(store)

</script>

<template>

    <LimeBoxFrame class="lg:w-7/12 pb-5">
      <InfoHeadComponent>
        ZeUSD
      </InfoHeadComponent>
      <InfoRowComponent info-title="CURRENT EPOCH" :info-contents="''+epochInfo?.curEpoch" />
      <InfoRowComponent info-title="EPOCH DURATION" :info-contents="`#${epochInfo?.epochStartBlock} ~ #${epochInfo?.epochEndBlock}`" />
      <InfoRowComponent info-title="1 ETH PRICE (USD)" :info-contents="`$${toDecimalNumber(priceInfo?.eth.price, priceInfo?.eth.decimal)}`"/>

    </LimeBoxFrame>
</template>

<style scoped>

</style>
