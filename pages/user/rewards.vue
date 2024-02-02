
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  createWeb3Instance,
  fromDecimalNumber,
  shortenWallet,
  toDecimalNumber,
  ZERO_ADDRESS
} from '~/services/web3/util';
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

store.updateBalance();
store.updateCurrentBlock();
store.updateEpochInfo();

const { walletAddress, version, Balance_ZeUSD, Balance_Ethereum , epochInfo} = storeToRefs(store)
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
const rewardSum = ref<string>('Loading...');
const mintableAmtAtEpoch = ref<any>(null);
const mintableAmount = ref<any>(null);
const claimableEpoch = ref<any>('');
const claimableReward = ref<any>('');
const userinfo = ref<any>('');

const tableColumns = ref([
  {label: 'User', key: 'user_', type: 'LINKED_TEXT'},
  {label: 'Delegated', key: 'delegated_', type: 'LINKED_TEXT'},
  {label: 'Duration', key: 'duration', type: 'TEXT'},
  {label: 'Transaction', key: 'tx_', type: 'LINKED_TEXT'},
  {label: 'Amount (ZeUSD)', key: 'amount', type: 'TEXT'},
  {label: 'Result', key: 'result', type: 'BUTTONS'},
])
const tableDatas = ref([
  // {id: 1, 'Epoch': '4', 'Method1': 'Rewards', 'Method2': 'Claim', 'Claimable_Epoch': '#3 - #4', 'Amount': '889.30 ZeUSD', 'Result': 'CLAIM'},
  // {id: 2, 'Epoch': '3', 'Method1': 'Rewards', 'Method2': 'Transfer', 'Claimable_Epoch': '#1 - #2', 'Amount': '100.30 ZeUSD', 'Result': 'ISSUED'},
  // {id: 3, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'IN PROGRESS'},
  // {id: 4, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'ISSUED'},
])

onMounted(async () => {

  const web3 = createWeb3Instance()
  web3Manager = new Web3Manager(web3, contracts);

  userinfo.value = await web3Manager.getStableTokenManager().getUserInfo(walletAddress.value);
  let delegated = await web3Manager.getStableTokenManager().delegateRewardWallet(walletAddress.value);
  if (delegated == ZERO_ADDRESS)
      delegated = walletAddress.value;
  try {
    claimableReward.value = await web3Manager.getStableTokenManager().estimatedReward(walletAddress.value);
  }catch (e) {

  }

  // console.log(delegated);
  // console.log({userinfo: userinfo.value})
  web3Manager.getStableTokenManager().getRewardEvents((event) => {
    // console.log(event);
    event.push({
      user: walletAddress.value,
      user_: shortenWallet(walletAddress.value),
      delegated: delegated,
      delegated_: shortenWallet(delegated),
      // epochEnd: event.returnValues.epochEnd,
      // epochStart: event.returnValues.epochStart,
      duration: `#${userinfo.value[1]} - #${epochInfo.value.rmEpoch }`,
      amount: toDecimalNumber(claimableReward.value, ZEUSD_DECIMAL),
      // block: event.blockNumber,
      // blockHash: event.blockHash,
      tx: '',
      tx_: '',
      result: 'CLAIM'
    })
    tableDatas.value = event.reverse();
    let tempRewardSum = new BigNumber(0);
    for (const eventElement of event) {
      tempRewardSum = tempRewardSum.plus(eventElement.amount);
    }
    rewardSum.value = tempRewardSum.toFixed(ZEUSD_DECIMAL);
  }, walletAddress.value, 2900);



});

const TxButtonClick = async (payload :{ item: any, key: string }) => {
  try {
    switch (payload.key) {
      case 'result':
        console.log(payload.item);
        if(payload.item[payload.key] == 'CLAIM')
          await web3Manager?.getStableTokenManager().claim(walletAddress.value);
    }

  } catch (error) {
    console.error('TxButtonClick Error:', error);
  }
};

</script>

<template>
  <EpochBar>
    <!--    <NavigationBar>-->
    <div class="flex p-4 gap-10 justify-center">
      <LimeBoxFrame class="lg:w-9/12 pb-5" >
        <InfoHeadComponent>
          REWARD INFO
        </InfoHeadComponent>
<!--        <InfoHeadComponent>-->
<!--          CLAIMABLE EPOCH-->
<!--        </InfoHeadComponent>-->
<!--        <LargeEpochNumberComponent>-->
<!--          {{claimableEpoch == '' ? epochInfo?.curEpoch : claimableEpoch }}-->
<!--        </LargeEpochNumberComponent>-->
        <InfoRowComponent info-title="TOTAL REWARD RECEIVED" :info-contents="`${rewardSum} ZeUSD`" />
        <InfoRowComponent info-title="REWARDS EPOCH DURATION" :info-contents="`EPOCH #${userinfo[1]} - #${epochInfo?.rmEpoch }`" />
        <InfoRowComponent info-title="APPROX CLAIMABLE REWARD" :info-contents="`${toDecimalNumber(claimableReward, ZEUSD_DECIMAL)} ZeUSD`" />

        <InfoHeadComponent class="mb-2 mt-6">
          REWARD HISTORY
        </InfoHeadComponent>
        <LineTable :columns="tableColumns" :data="tableDatas" @user-action="payload => TxButtonClick(payload)"/>

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
