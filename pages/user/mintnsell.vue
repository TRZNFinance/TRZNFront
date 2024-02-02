
<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue';
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
import {useFetch} from "#app";

const store = useStore()
store.updateEpochInfo();

const { walletAddress, version, Balance_ZeUSD, Balance_Ethereum, epochInfo } = storeToRefs(store)
const { contracts } = store;

// let vaultManager: VaultManager | null = null;
let web3Manager: Web3Manager | null = null;
const tab = ref('sell');  // Defaul
const targetEpoch = ref<any>('');
const currentEpoch = ref<any>(null);
const mintableAmtAtEpoch = ref<any>(null);
const tableColumns = ref([
  {label: 'Registered Epoch', key: 'Epoch'},
  {label: 'Applied Epoch', key: 'Applied_Epoch'},
  {label: 'Action', key: 'Action', type: 'LINKED_TEXT'},
  {label: 'Status', key: 'Status'},
  {label: 'Amount', key: 'Amount', type: 'TEXT'},
  {label: 'Result', key: 'Result', type: 'BUTTONS'},
])
const tableDatas = ref([
  {id: 1, 'Epoch': '4', 'Action': 'Withdraw', 'Status': 'Wait(Pending..)', 'Applied_Epoch': '-', 'Amount': '889.30 ZeUSD', 'Result': 'IN PROGRESS'},
  {id: 2, 'Epoch': '3', 'Action': 'Withdraw', 'Status': 'Wait(Pending..)', 'Applied_Epoch': '6', 'Amount': '100.30 ZeUSD', 'Result': 'COMPLETE'},
  {id: 3, 'Epoch': '2', 'Action': 'Mint', 'Status': 'Complete', 'Applied_Epoch': '2', 'Amount': '889.30 ZeUSD', 'Result': 'COMPLETE'},
  {id: 4, 'Epoch': '1', 'Action': 'Mint', 'Status': 'Complete', 'Applied_Epoch': '1', 'Amount': '100.30 ZeUSD', 'Result': 'COMPLETE'},
  // {id: 3, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'IN PROGRESS'},
  // {id: 4, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'ISSUED'},
])


const dis_estimatedReward = ref('0');
const dis_epoch = ref('0');
const dis_epochStartBlock = ref('0');
const dis_epochEndBlock = ref('0');
const dis_epochProcess = ref('0');


const totalSold = ref('');
const totalMinted = ref('');
const claimAt = ref('');
const currentTotalSupply = ref ('');

let withdrawRequestTxList:any = null;
let ableToWithdrawList:any = null;
let RiskManagerEpoch:any = 50;


const updateData = async () => {
  try {
    const web3 = createWeb3Instance();
    web3Manager = new Web3Manager(createWeb3Instance(), contracts);
    await store.updateBalance();

    web3Manager.zUSDTotalSupply().then((zUSDSupply) => {
      currentTotalSupply.value = toDecimalNumber(zUSDSupply, ZEUSD_DECIMAL, 3);
      // currentTotalAsset.value = toDecimalNumber(new BigNumber(zUSDSupply).multipliedBy(1.0 + Math.random() * 0.05), ZEUSD_DECIMAL, 3);
    });
    RiskManagerEpoch = Number(await web3Manager.RiskManagerEpoch());

    // /*
    // Epoch Info
    // */
    // const currentEpoch = Number(await web3Manager.getCurrentEpoch());
    // const EpochTerm = Number(await web3Manager.getCurrentEpochTerm());
    // const EpochStartBlock = Number(await web3Manager.getCurrentEpochStartBlock());
    //
    // dis_epoch.value = currentEpoch.toString()
    // // dis_epochStartBlock.value = (currentEpoch * EpochTerm + EpochStartBlock).toString()
    // // dis_epochEndBlock.value = EpochStartBlock.toString()
    // dis_epochStartBlock.value = ((currentEpoch - 1) * EpochTerm + EpochStartBlock).toString();
    // dis_epochEndBlock.value = (currentEpoch  * EpochTerm + EpochStartBlock - 1).toString();
    //
    //
    // dis_epochProcess.value = ((currentBlock.value - Number(dis_epochStartBlock.value)) / EpochTerm * 100).toFixed(3);

    /*
    Claim Info
    */
    // const targetUser = '0x4Ed9879E376b1e7DED1Ecb001E16383457814C55';
    console.log('version', version.value, epochInfo.value);
    const requestData: any = await internalAPI(`/api/userevent/all/${walletAddress.value}?versionID=${version.value}`);
    const redemptionFailData = await internalAPI(`/api/userevent/redemption_fail/${walletAddress.value}?versionID=${version.value}`);
    const redemptionSuccessData = await internalAPI(`/api/userevent/redemption_success/${walletAddress.value}?versionID=${version.value}`);

    console.log('haha', {requestData, redemptionFailData, redemptionSuccessData});
    (requestData).forEach(item => {
      item.id = item._id;
      item["Amount"] = item.InputAmount + ' ZeUSD';
      item["Applied_Epoch"] = item["Epoch"]
      if(Number(item.Epoch) > Number(epochInfo.value?.rmEpoch)){
        item["Result"] = 'IN PROGRESS';
        item["Status"] = "Pending...";
      } else {
        item["Result"] = 'CLAIM';
        item["Status"] = "RM DEPOSIT";
      }
    });

    // {
    //   "_id": "654845fa6d94e8f241645b1a",
    //     "BlockNumber": 1814346,
    //     "TxHash": "0xb7dd7a24cd4f402d144d9d688bb51d06b977cae193a451e8369ed075346991c9",
    //     "Epoch": 1600,
    //     "Action": "Buy#Request#Sucess",
    //     "User": "0xff30A4fea5B7AC901b5735FDdeeF87371C62A4a8",
    //     "InputAmount": 101.5,
    //     "InputPrice": 1,
    //     "OutputAmount": 0.05287815814799539,
    //     "OutputPrice": 1891.14,
    //     "Timestamp": "Mon Nov 06 2023 01:48:42 GMT+0000 (Greenwich Mean Time)",
    //     "Version": 3,
    //     "Status": "Pending...",
    //     "isReady": false
    // }

    withdrawRequestTxList = (requestData).map(item1 => {
      const matchingItem2 = (redemptionFailData).find(item2 => item1["Epoch"] === item2["Epoch"]);
      if (matchingItem2) {
        return { ...item1, ["Status"]: 'Failed' };
      }
      return item1;
    });

    withdrawRequestTxList = (withdrawRequestTxList).map(item1 => {
      const matchingItem2 = (redemptionSuccessData).find(item2 => item1["Epoch"] === item2["Epoch"]);
      if (matchingItem2) {
        return { ...item1, ["Status"]: 'Success' };
      }
      return item1;
    });

    const ableToWithdrawList1 = (requestData).filter(item1 =>
        !(redemptionFailData).some(item2 => item1["Epoch"] === item2["Epoch"])
    );
    const ableToWithdrawList2 = (ableToWithdrawList1).filter(item1 =>
        !(redemptionSuccessData).some(item2 => item1["Epoch"] === item2["Epoch"])
    );

    const UserWithdrawEpochList = ableToWithdrawList2.map((res)=> res["Epoch"])
    console.log(UserWithdrawEpochList)

    ableToWithdrawList2.forEach(item => {
      item["isReady"] = new BigNumber(item['Epoch']).toNumber() <= RiskManagerEpoch ? true : false;
    });
    ableToWithdrawList = ableToWithdrawList2
    // for (const withdrawEpoch of UserWithdrawEpochList) {
    //   const res = await web3Manager.getRedeemInfo_Raw(targetUser, withdrawEpoch);
    //   console.log(withdrawEpoch, res)
    // }
    tableDatas.value = requestData;

    console.log('haha2',tableDatas.value);
  }
  catch (error) {
    console.log(error)
    // 오류 처리
  }
};

const internalAPI = async (query:string) => {
  const {data} = await useFetch(query);
  return data.value;
}

const TxButtonClick = async (payload :{ item: any, key: string }) => {
  try {
    switch (payload.key) {
      case 'Result':
        const userRequest = await web3Manager?.getEthVaultManager().getUserWithdrawInfo(walletAddress.value, payload.item.Epoch);
        console.log('hahaha', {userRequest})
        alert("#Epoch : " + payload.item.Epoch+"\n#InputAmount : "+ payload.item.InputAmount+"\n#InputPrice : "+payload.item.InputPrice+"\n#OutputAmount : "+payload.item.OutputAmount+"\n#OutputPrice : "+payload.item.OutputPrice);
        await web3Manager?.redeemBuyETH(payload.item.Epoch);
    }

  } catch (error) {
    console.error('TxButtonClick Error:', error);
  }
};

const ClaimTxButtonClick = async() => {
  await web3Manager?.rewardClaim();
}

onMounted(() => {
  // 페이지가 로드될 때 API 데이터 가져오기
  updateData();

  // 매 초마다 데이터 업데이트
  const interval = setInterval(updateData, 30000);

  // 컴포넌트가 언마운트될 때 인터벌 해제하여 메모리 누수 방지
  onBeforeUnmount(() => clearInterval(interval));
});


</script>



<template>
<EpochBar>
<!--    <NavigationBar>-->
  <div class="flex p-4 gap-10 justify-center">
    <LimeBoxFrame class="lg:w-9/12 pb-5" >
      <InfoHeadComponent>
        MINT INFO
      </InfoHeadComponent>
      <InfoRowComponent info-title="ZeUSD MINTED" :info-contents="`${toDecimalNumber(Balance_ZeUSD,ZEUSD_DECIMAL)} ZeUSD`" />
      <InfoRowComponent info-title="CONTRIBUTION" :info-contents="`${new BigNumber(toDecimalNumber(Balance_ZeUSD,ZEUSD_DECIMAL)).dividedBy(currentTotalSupply).multipliedBy(100).toFixed(2)}% (${toDecimalNumber(Balance_ZeUSD,ZEUSD_DECIMAL)}/${currentTotalSupply})`" />

      <InfoHeadComponent>
        SELL INFO
      </InfoHeadComponent>
      <InfoRowComponent info-title="Pending ZeUSD SOLD" :info-contents="`${totalSold} ZeUSD`" />
<!--      <InfoRowComponent info-title="APPROX CLAIMABLE EPOCH" :info-contents="claimAt" />-->

      <InfoHeadComponent class="mb-2 mt-6">
        USER ACTIONS
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
