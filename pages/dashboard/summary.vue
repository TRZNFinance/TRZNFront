
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import BigNumber from "bignumber.js";
import Web3Manager, {ZEUSD_DECIMAL, ETH_DECIMAL, PRICE_DECIMAL, ESCROW_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import EpochBar from "~/components/common/EpochBar.vue";
import DashboardSummaryComponent from "~/components/appComponent/DashboardSummaryComponent.vue";
import LineTable from "~/components/tiny/LineTable.vue";
import InfoHeadComponent from "~/components/tiny/InfoHeadComponent.vue";

const store = useStore()
const { walletAddress, version, Balance_ZeUSD, Balance_Ethereum, epochInfo, contracts} = storeToRefs(store)

let web3Manager: Web3Manager | null = null;


const tableColumns = ref([
  {label: 'Epoch', key: 'epoch'},
  // {label: 'ZeUSD Under Mgmt', key: 'ZeUSD_Under_Mgmt', type: 'TEXT'},
  {label: 'Minted ZeUSD', key: 'minted', type: 'TEXT'},
  {label: 'Burn ZeUSD', key: 'rmDeposit', type: 'TEXT'},
  {label: 'Reward ZeUSD', key: 'rewardAmt', type: 'TEXT'},
  {label: 'Total Value', key: 'total', type: 'TEXT'},
  {label: 'Status', key: 'status', type: 'TEXT'},
])
const tableDatas = ref([
])

let epochNumFrom = 0;
let isLoading = false;

const updateAndPushEpochInfo = async () => {
  if(isLoading) return;
  isLoading = true;
  const web3Manager = new Web3Manager(createWeb3Instance(), contracts.value);

  const tempList = tableDatas.value.slice(0,tableDatas.value.length);
  // console.log(`myValue의 현재 값은`, epochInfo.value, `입니다.`);
  try {
    const epochMintLimit = await web3Manager.getEthVaultManager().mintableAmtAtEpoch();

    // for (let i = Number(epochInfo.value?.curEpoch); i + 4 > Number(epochInfo.value?.curEpoch) ; i--) {
    for (let i = epochNumFrom; i > epochNumFrom - 5; i--) {
      const tempInfo = await web3Manager.getEthVaultManager().epochInfo(i);
      const totalSupply = await web3Manager.getStableTokenManager().getTotalSupplyAtEpoch(i, epochInfo.value?.curEpoch);
      tempList.push({
        epoch: i,
        minted: toDecimalNumber(tempInfo.mintedZeUSD, ZEUSD_DECIMAL),
        rewardAmt: toDecimalNumber(tempInfo.rewardAmt, ZEUSD_DECIMAL),
        rmWithdraw: toDecimalNumber(tempInfo.rmWithdraw, ZEUSD_DECIMAL),
        rmDeposit_ETH: toDecimalNumber(tempInfo.rmDeposit,ZEUSD_DECIMAL),
        rmDeposit: toDecimalNumber(new BigNumber(tempInfo.rmDeposit).multipliedBy(tempInfo.avgDepositPrice).dividedBy(10**(ETH_DECIMAL - ZEUSD_DECIMAL + PRICE_DECIMAL)),ZEUSD_DECIMAL),
        status: tempInfo.status,
        mintLimit: epochMintLimit,
        avgDepositPrice: tempInfo.avgDepositPrice,
        avgWithdrawPrice: tempInfo.avgWithdrawPrice,
        total: toDecimalNumber(totalSupply, ZEUSD_DECIMAL),
      })
    }
    tableDatas.value = tempList;
  } catch (e) {
    console.log(e);
  }
  isLoading =false;
}

onMounted(async () => {
  epochNumFrom = Number(epochInfo.value?.curEpoch);
  updateAndPushEpochInfo();
  // 추가적인 로직
});

const TxButtonClick = async (payload :{ item: any, key: string }) => {
  try {
    switch (payload.key) {
      case 'more':
        epochNumFrom -= 5;
        updateAndPushEpochInfo();
    }

  } catch (error) {
    console.error('TxButtonClick Error:', error);
  }
};


</script>

<template>
  <EpochBar>
    <!--    <NavigationBar>-->
    <div class="flex-col p-20 gap-10 justify-center">

      <DashboardSummaryComponent/>

      <InfoHeadComponent class="mt-8 mb-4">
        EPOCH INFO
      </InfoHeadComponent>
      <LineTable :columns="tableColumns" :data="tableDatas" @user-action="TxButtonClick"/>
    </div>
    <!--    </NavigationBar>-->
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
