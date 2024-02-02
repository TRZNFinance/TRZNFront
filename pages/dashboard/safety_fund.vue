<template>
<EpochBar>
<!--    <NavigationBar>-->
    <div class="flex p-5 gap-10 justify-center">
      <LimeBoxFrame class="lg:w-9/12 pb-5" >
        <InfoHeadComponent>
          USER SAFETY FUND
        </InfoHeadComponent>
        <InfoRowComponent info-title="FUND BALANCE" :info-contents="`$${ toDecimalNumber(totalData.escrow, ESCROW_DECIMAL)}`" />
        <InfoRowComponent info-title="MINTED AMOUNT" :info-contents="`$${ toDecimalNumber(totalData.minted, ZEUSD_DECIMAL)}`" />
        <InfoRowComponent info-title="% of TVL" :info-contents="`${new BigNumber(toDecimalNumber(totalData.escrow, ESCROW_DECIMAL)).dividedBy(toDecimalNumber(totalData.minted, ZEUSD_DECIMAL)).multipliedBy(100).toFixed(2) }%`" />

        <InfoHeadComponent class="mt-12 mb-4">
          ETH
        </InfoHeadComponent>
        <LineTable :columns="tableColumns" :data="rmsData"/>
      </LimeBoxFrame>
    </div>
<!--    </NavigationBar>-->
  </EpochBar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import EpochBar from "~/components/common/EpochBar.vue";
import LineTable from "~/components/tiny/LineTable.vue";
import InfoHeadComponent from "~/components/tiny/InfoHeadComponent.vue";
import LimeBoxFrame from "~/components/tiny/LimeBoxFrame.vue";
import InfoRowComponent from "~/components/tiny/InfoRowComponent.vue";
import Web3Manager, {ESCROW_DECIMAL, ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import {createWeb3Instance, toDecimalNumber} from "~/services/web3/util";
import BigNumber from "bignumber.js";

const store = useStore()
const { walletAddress, version, Balance_ZeUSD, Balance_Ethereum, contracts} = storeToRefs(store)

const totalData = ref< {minted: string, escrow: string}>({minted:'', escrow: ''})
const rmsData = ref<any>([])
const tableColumns = ref([
  {label: 'RiskManager', key: 'rm'},
  {label: 'Blockchain', key: 'blockchain', type: 'TEXT'},
  // {label: 'Platform', key: 'Platform', type: 'TEXT'},
  {label: 'TOKEN', key: 'token', type: 'LINKED_TEXT'},
  {label: 'MINTED', key: 'minted_', type: 'TEXT'},
  {label: 'IN ESCROW', key: 'escrow_', type: 'TEXT'},
])
const tableDatas = ref([
  {id: 1, 'rm': 'TOKEN', 'Blockchain': 'ETH', 'Platform': 'ESCROW', 'TOKEN': 'USDC', 'Amount': '', 'Result': '10.5%'},
  {id: 2, 'rm': 'Defi', 'Blockchain': 'ETH', 'Platform': 'Platform A', 'Method_2': 'USDC Treasury', 'Amount': '$5,000,000', 'Result': '5.5%'},
  {id: 3, 'rm': 'Defi', 'Blockchain': '-', 'Platform': 'Platform B', 'Method_2': 'USA-Bonds', 'Amount': '$5,000,000', 'Result': '5.5%'},
  {id: 4, 'rm': 'Defi', 'Blockchain': '-', 'Platform': 'Platform C', 'Method_2': '-', 'Amount': '$5,000,000', 'Result': '5.5%'},
])

onMounted(async () => {
  const web3Manager = new Web3Manager(createWeb3Instance(), contracts.value);
  const tempTotalData: {minted: string, escrow: string} = {minted: '0', escrow: '0' }
  const rmList = [];
  try{
    for (let i = 0; i < 10; i++) {
      rmList.push({id: i,blockchain: 'ETH', token: 'USDC', rm: await web3Manager.getEthVaultManager().riskManagerList(i)})
    }
  }catch (e) {
  }
  for (const rmListElement of rmList) {

    rmListElement.minted = await web3Manager.getRiskManagerEscrowManager().getRiskManagerAmt(rmListElement.rm)
    rmListElement.escrow = await web3Manager.getRiskManagerEscrowManager().getEscrowBalance(rmListElement.rm, contracts.value.escrowTokenContract)
    rmListElement.minted_ = toDecimalNumber(rmListElement.minted, ZEUSD_DECIMAL);
    rmListElement.escrow_ = toDecimalNumber(rmListElement.escrow, ESCROW_DECIMAL);


    tempTotalData.minted = new BigNumber(tempTotalData.minted).plus(rmListElement.minted).toString();
    tempTotalData.escrow = new BigNumber(tempTotalData.escrow).plus(rmListElement.escrow).toString();
  }
  totalData.value = tempTotalData;
  console.log({rmList, totalData})
  rmsData.value = rmList;
})
</script>


<style scoped>

</style>
