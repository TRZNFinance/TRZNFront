<template>
  <div class="bg-black">

    <div> Current Block : {{dis_currentBlock}} </div>
    <div> Current Epoch : {{ dis_epoch }} ({{dis_epochStartBlock}} ~ {{dis_epochEndBlock}}) ({{dis_epochProcess}} %)</div>
    <div> User Wallet : {{ walletAddress }}</div>
    <div> User Balance : {{ toDecimalNumber(Balance_ZeUSD,ZEUSD_DECIMAL) }} ZeUSD</div>
    <div style="display: flex; justify-content: space-between; margin: 10px;">
      <div>Claimable Reward : (at least) {{dis_estimatedReward}} ZeUSD</div>
      <div><button style="width: 100%; background-color: #00dc82; color:white;" @click="ClaimTxButtonClick()">Claim Tx</button></div>
    </div>

    <LineTable :columns="tableColumns" :data="tableDatas"/>

    <div style="width: 100%; margin: 10px;">
      <div>Redemption Tx List</div>
      <table>
        <thead>
          <tr>
            <th style="text-align: center;">Epoch</th>
            <th style="text-align: center;">Input Amount (ZeUSD)</th>
<!--            <th style="text-align: center;">Input Price ($)</th>-->
            <th style="text-align: center;">Redemption Amount (ETH)</th>
            <th style="text-align: center;">ETH Price ($)</th>
            <th style="text-align: center;">Status</th>
            <th style="text-align: center;">Tx Hash</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in withdrawRequestTxList" :key="item.id">
            <td style="text-align: center;"> {{ item.Epoch }}</td>
            <td style="text-align: center;"> {{ item.InputAmount }} ZeUSD</td>
<!--            <td style="text-align: center;"> $ {{ item.InputPrice }}</td>-->
            <td style="text-align: center;"> {{ item.OutputAmount }} ETH</td>
            <td style="text-align: center;"> $ {{ item.OutputPrice }}</td>
            <td style="text-align: center;"> {{ item.Status }}</td>
            <td style="text-align: center;"> {{ item.TxHash }}</td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,  onBeforeUnmount, withDefaults, defineProps } from 'vue';
import {createWeb3Instance, toDecimalNumber} from '~/services/web3/util';
import BigNumber from "bignumber.js";
import axios from 'axios';
import Web3Manager, {ZEUSD_DECIMAL, ETH_DECIMAL} from "~/services/web3/web3Manager";
import {useFetch} from "#app";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import LineTable from "~/components/tiny/LineTable.vue";

const store = useStore()
const { walletAddress, version, Balance_ZeUSD, Balance_Ethereum } = storeToRefs(store)
const { contracts } = store;

let web3Manager: Web3Manager | null = null;

const dis_estimatedReward = ref('0');
const dis_epoch = ref('0');
const dis_currentBlock =ref('0');
const dis_epochStartBlock = ref('0');
const dis_epochEndBlock = ref('0');
const dis_epochProcess = ref('0');

let withdrawRequestTxList:any = null;
let ableToWithdrawList:any = null;
let RiskManagerEpoch:any = 50;

const tableColumns = ref([
  {label: 'AA', key: 'AA'},
  {label: 'BB', key: 'BB', type: 'TEXT'},
  {label: 'CC', key: 'CC', type: 'LINKED_TEXT'},
  {label: 'DD', key: 'DD', type: 'TEXT'},
  {label: 'EE', key: 'EE', type: 'BUTTONS'},
])
const tableDatas = ref([
  {id: 1, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'CLAIM'},
  {id: 2, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'COMPLETE'},
  {id: 3, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'IN PROGRESS'},
  {id: 4, 'AA': 'aaaa', 'BB': 'bbbb', 'CC': 'cccc', 'DD': 'dddd', 'EE': 'ISSUED'},
])

const updateData = async () => {
  try {
    const web3 = createWeb3Instance();
    web3Manager = new Web3Manager(web3, contracts);
    await store.updateBalance();
    try{
      const estmatedReward = await web3Manager.estimatedReward(walletAddress.value);
      dis_estimatedReward.value = toDecimalNumber(estmatedReward, ZEUSD_DECIMAL);
    } catch (e) {
      console.log(e);
    }
    RiskManagerEpoch = Number(await web3Manager.RiskManagerEpoch());

    /*
    Epoch Info
    */
    const currentEpoch = Number(await web3Manager.getCurrentEpoch());
    const EpochTerm = Number(await web3Manager.getCurrentEpochTerm());
    const EpochStartBlock = Number(await web3Manager.getCurrentEpochStartBlock());

    dis_epoch.value = currentEpoch.toString()
    // dis_epochStartBlock.value = (currentEpoch * EpochTerm + EpochStartBlock).toString()
    // dis_epochEndBlock.value = EpochStartBlock.toString()
    dis_epochStartBlock.value = ((currentEpoch - 1) * EpochTerm + EpochStartBlock).toString();
    dis_epochEndBlock.value = (currentEpoch  * EpochTerm + EpochStartBlock - 1).toString();


    const currentBlock = Number(await web3.eth.getBlockNumber());
    dis_currentBlock.value = currentBlock.toString();
    dis_epochProcess.value = ((currentBlock - Number(dis_epochStartBlock.value)) / EpochTerm * 100).toFixed(3);

    /*
    Claim Info
    */
    // const targetUser = '0x4Ed9879E376b1e7DED1Ecb001E16383457814C55';
    console.log('version', version.value);
    const requestData = await internalAPI(`/api/userevent/withdraw_request/${walletAddress.value}?version=${version.value}`);
    const redemptionFailData = await internalAPI(`/api/userevent/redemption_fail/${walletAddress.value}?version=${version.value}`);
    const redemptionSuccessData = await internalAPI(`/api/userevent/redemption_success/${walletAddress.value}?version=${version.value}`);

    (requestData).forEach(item => {
        item["Status"] = "Pending...";
    });

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

const TxButtonClick = async (index: number) => {
  const selectedItem = ableToWithdrawList[index];
  try {
    alert("#Epoch : " + selectedItem.Epoch+"\n#InputAmount : "+selectedItem.InputAmount+"\n#InputPrice : "+selectedItem.InputPrice+"\n#OutputAmount : "+selectedItem.OutputAmount+"\n#OutputPrice : "+selectedItem.OutputPrice);
    await web3Manager?.redeemBuyETH(selectedItem.Epoch);
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
  const interval = setInterval(updateData, 3000);

  // 컴포넌트가 언마운트될 때 인터벌 해제하여 메모리 누수 방지
  onBeforeUnmount(() => clearInterval(interval));
});


</script>

<style scoped>
table {
  width: 100%;
  border: 1px solid #444444;
}
th, td {
  border: 1px solid #444444;
}
/* Container 스타일링 */


/* 특정 div 요소에 대한 스타일링 예시 */
/* Current Block */
div:nth-child(1) {
  font-weight: bold;
}

/* Current Epoch */
div:nth-child(2) {
  /*font-style: italic;*/
}

/* User Wallet */
div:nth-child(3) {
  color: #28a745; /* 파란색 텍스트 */
}

/* User Balance */
div:nth-child(4) {
  color: #007bff; /* 초록색 텍스트 */
}

/* Estimated Reward */
div:nth-child(5) {
  color: #007bff; /* 빨간색 텍스트 */
}

</style>
