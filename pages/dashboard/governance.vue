<template>
<EpochBar>
<!--    <NavigationBar>-->
  <div class="flex p-4 gap-10 justify-center">
    <LimeBoxFrame class="lg:w-6/12 pb-5" >
      <InfoHeadComponent>
        GOVERNANCE SUMMARY
      </InfoHeadComponent>
      <InfoRowComponent info-title="GOVERNANCE TOKEN" info-contents="TOKEN NAME" />
      <InfoRowComponent info-title="TOKEN SYMBOL" info-contents="$ZD" />
      <InfoRowComponent info-title="CONTRACT ADDRESS" info-contents="ADDRESS" link-address="/" target="_blank"/>
      <InfoRowComponent info-title="CURRENT SUPPLY" info-contents="800,000 (10%)" />
      <InfoRowComponent info-title="MAXIMUM SUPPLY" info-contents="8,000,000 (90%)" />
    </LimeBoxFrame>
  </div>
</EpochBar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import BigNumber from "bignumber.js";
import Web3Manager, {ZEUSD_DECIMAL, ETH_DECIMAL, PRICE_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import EpochBar from "~/components/common/EpochBar.vue";
import NavigationBar from "~/components/common/NavigationBar.vue";
import SwapComponent from "~/components/appComponent/SwapComponent.vue";
import EpochInfoComponent from "~/components/appComponent/EpochInfoComponent.vue";
import DashboardSummaryComponent from "~/components/appComponent/DashboardSummaryComponent.vue";
import LineTable from "~/components/tiny/LineTable.vue";
import InfoRowComponent from "~/components/tiny/InfoRowComponent.vue";
import LimeBoxFrame from "~/components/tiny/LimeBoxFrame.vue";
import InfoHeadComponent from "~/components/tiny/InfoHeadComponent.vue";
import LargeEpochNumberComponent from "~/components/tiny/LargeEpochNumberComponent.vue";

const store = useStore()
const { walletAddress, version, Balance_ZeUSD, Balance_Ethereum } = storeToRefs(store)
const { contracts } = store;

// let vaultManager: VaultManager | null = null;
let web3Manager: Web3Manager | null = null;
const tab = ref('sell');  // Default tab
const sellAmount = ref('1');
const buyZeUSDAmount = ref('');
const buyETHAmount = ref('');

const requestAmount = ref('');
const targetEpoch = ref<any>('');
const ethPrice = ref('');
const redeemInfo = ref<null|string>(null); // Replace this with the value fetched from getRedeemInfo function
const currentEpoch = ref<any>(null);
const userMintedAmount = ref<any>(null);
const epochInfo = ref<any>(null);
const mintableAmtAtEpoch = ref<any>(null);
const mintableAmount = ref<any>(null);

const tableColumns = ref([
  {label: 'Registered Epoch', key: 'Registered_Epoch'},
  {label: 'Applied Epoch', key: 'Applied_Epoch'},
  {label: 'Method1', key: 'Method1', type: 'LINKED_TEXT'},
  {label: 'Method2', key: 'Method2'},
  {label: 'Amount', key: 'Amount', type: 'TEXT'},
  {label: 'Result', key: 'Result', type: 'BUTTONS'},
])
const tableDatas = ref([
  {id: 1, 'Registered_Epoch': '4', 'Method1': 'Withdraw', 'Method2': 'Wait(Pending..)', 'Applied_Epoch': '-', 'Amount': '889.30 ZeUSD', 'Result': 'IN PROGRESS'},
  {id: 2, 'Registered_Epoch': '3', 'Method1': 'Withdraw', 'Method2': 'Wait(Pending..)', 'Applied_Epoch': '6', 'Amount': '100.30 ZeUSD', 'Result': 'COMPLETE'},
  {id: 3, 'Registered_Epoch': '2', 'Method1': 'Mint', 'Method2': 'Complete', 'Applied_Epoch': '2', 'Amount': '889.30 ZeUSD', 'Result': 'COMPLETE'},
  {id: 4, 'Registered_Epoch': '1', 'Method1': 'Mint', 'Method2': 'Complete', 'Applied_Epoch': '1', 'Amount': '100.30 ZeUSD', 'Result': 'COMPLETE'},
  // {id: 3, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'IN PROGRESS'},
  // {id: 4, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'ISSUED'},
])

</script>


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
