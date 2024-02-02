

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

const rules = {
  required: value => !!value || 'Required.',
  counter: value => value.length <= 20 || 'Max 20 characters',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
  eth_Balance_Check: value => value == '' || new BigNumber(Balance_Ethereum.value).comparedTo(new BigNumber(fromDecimalNumber(value, ETH_DECIMAL)).multipliedBy(1.015)) > 0 || `Balance exceeded`,
  zusd_Balance_Check: value => value == '' || new BigNumber(Balance_ZeUSD.value).comparedTo(new BigNumber(fromDecimalNumber(value, ZEUSD_DECIMAL)).multipliedBy(1.015)) > 0 || 'Balance exceeded',
  eth_amount_Check: value => value == '' || new BigNumber(value).comparedTo(0.1) >= 0 || 'ETH min amount is 0.1',
  // zusd_amount_Check: value => value == '' || new BigNumber(value).dividedBy(ethPrice.value).multipliedBy(0.985).comparedTo(0.1) >= 0 || 'ETH min amount is 0.1',
  zusd_amount_Check: value => value == '' || new BigNumber(value).mod(100).comparedTo(0.1) < 0 || 'ZeUSD minimum amount is 100 and unit is 100',
  mintable_amount_Check: value => value == '' || new BigNumber(value).multipliedBy(ethPrice.value).multipliedBy(0.985).comparedTo(mintableAmount.value) < 0 || `Mintable amount at this epoch is ${mintableAmount.value} ZeUSD`,
}

onMounted(async() => {
});

const calculateSwapAmount = (evt : any = null) => {
  // sellAmount.value = new BigNumber(sellAmount.value).dividedBy(0.01).integerValue(BigNumber.ROUND_DOWN).multipliedBy(100).toString();
  // requestAmount.value = new BigNumber(requestAmount.value).dividedBy(100).integerValue(BigNumber.ROUND_DOWN).multipliedBy(100).toString();
  buyZeUSDAmount.value = new BigNumber(sellAmount.value).multipliedBy(ethPrice.value).toString();
  buyETHAmount.value = new BigNumber(requestAmount.value).dividedBy(ethPrice.value).toString();

  if (sellAmount.value == '') buyZeUSDAmount.value = '0';

  if (requestAmount.value == '') buyETHAmount.value = '0';
}


const sellETH = async() => {
  // Call the SellETH function with sellAmount.value
  // console.log(walletAddress, vaultManager, sellAmount.value)
  if(walletAddress && web3Manager && sellAmount.value){
    web3Manager?.sellETH(new BigNumber(sellAmount.value).multipliedBy(10**ETH_DECIMAL).multipliedBy(1.015).toFixed(0),walletAddress.value).then((res) => {
      alert('ㄴ');
    });
  }
};

const approveZUSD = () => {
  // Call the Request_BuyETH function with requestAmount.value
  if(walletAddress && web3Manager && requestAmount.value){
    requestAmount.value = new BigNumber(requestAmount.value).dividedBy(100).integerValue(BigNumber.ROUND_DOWN).multipliedBy(100).multipliedBy(1.015).toString();
    calculateSwapAmount();
    web3Manager?.approve(new BigNumber(requestAmount.value).multipliedBy(10**ZEUSD_DECIMAL).multipliedBy(1.015).toFixed(0), walletAddress.value).then((res) => {
      alert(res);
    });
  }
};
const requestETH = async () => {
  // Call the Request_BuyETH function with requestAmount.value
  if(walletAddress && web3Manager && requestAmount.value){
    // const { data } = await useFetch('/api/ethprice')
    // console.log("ETH Price : ", data.value)
    // @ts-ignore
    // const ETHPrice = data.value['price']
    requestAmount.value = new BigNumber(requestAmount.value).dividedBy(100).integerValue(BigNumber.ROUND_DOWN).multipliedBy(100).toString();
    calculateSwapAmount();
    web3Manager?.requestBuyETH(new BigNumber(requestAmount.value).multipliedBy(10**ZEUSD_DECIMAL).multipliedBy(1.015).toFixed(0),walletAddress.value).then((res) => {
      alert(res);
    });
  }
};

const fetchRedeemInfo = async () => {
  // Here you will call the getRedeemInfo function with user.value and epoch.value as arguments,
  // and assign the result to redeemInfo value
  // const vaultManager = new VaultManager(createWeb3Instance(), config.public.vaultContract, config.public.zusdContract);;
  if(walletAddress && web3Manager && targetEpoch.value){
    web3Manager.getRedeemInfo(walletAddress.value, targetEpoch.value).then((_redeemInfo)=>{
      redeemInfo.value = _redeemInfo
    });
  }
};

const redeemETH = () => {
  // Call the Redeem_BuyETH function with targetEpoch.value
  console.log('aa');
  if(walletAddress && web3Manager && targetEpoch.value){
    web3Manager.redeemBuyETH(targetEpoch.value,walletAddress.value).then((res) => {
      alert(res);
    });
  }
};
</script>

<template>
  <EpochBar>
    <!--    <NavigationBar>-->
    <div class="flex p-20 gap-10 justify-center">

      <EpochInfoComponent :is-buy="false"/>
      <SwapComponent :is-buy="false"/>

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
