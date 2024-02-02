<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, fromDecimalNumber, toDecimalNumber} from '~/services/web3/util';
import BigNumber from "bignumber.js";
import Web3Manager, {ZEUSD_DECIMAL, ETH_DECIMAL} from "~/services/web3/web3Manager";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import EpochBarComponent from "~/components/tiny/EpochBarComponent.vue";
import InfoRowComponent from "~/components/tiny/InfoRowComponent.vue";
import InfoHeadComponent from "~/components/tiny/InfoHeadComponent.vue";

const store = useStore()
const { walletAddress, version, Balance_ZeUSD, Balance_Ethereum, epochInfo } = storeToRefs(store)
const { contracts } = store;
store.updateCurrentBlock();
store.updateEpochInfo();
store.updatePriceInfo();


// let vaultManager: VaultManager | null = null;
let web3Manager: Web3Manager | null = null;
const tab = ref('sell');  // Default tab


const props = defineProps({
  isBuy: {
    type: Boolean,
    required: true,
    default: true,
  },
})

const isBuyLocal = ref(false);
const sellAmount = ref('1');
const buyZeUSDAmount = ref('');
const buyETHAmount = ref('');

const requestAmount = ref('');
const targetEpoch = ref<any>('');
const ethPrice = ref('');
const redeemInfo = ref<null|string>(null); // Replace this with the value fetched from getRedeemInfo function
const currentEpoch = ref<any>(null);
const userMintedAmount = ref<any>(null);
const epochInfo_ = ref<any>(null);
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
  console.log('haha1');
  web3Manager = new Web3Manager(createWeb3Instance(), contracts);
  web3Manager.getOracleManager().getERC20Price_Low(contracts.wethTokenContract).then(({price, decimal}) => {
    console.log(price, decimal)
    ethPrice.value = toDecimalNumber(price, decimal);
    calculateSwapAmount();
  })
  if(epochInfo.value!= null){
    userMintedAmount.value = await web3Manager.getEthVaultManager().userMintAmountAtEpoch(walletAddress.value, epochInfo.value?.curEpoch);
    // console.log(userMintedAmount.value);
    epochInfo_.value = await web3Manager.getEthVaultManager().epochInfo(epochInfo.value?.curEpoch);
    // console.log(epochInfo_.value.mintedZeUSD);
    mintableAmtAtEpoch.value = await web3Manager.getEthVaultManager().mintableAmtAtEpoch();
    // console.log(mintableAmtAtEpoch.value);
    mintableAmount.value = new BigNumber(mintableAmtAtEpoch.value).dividedBy(2).minus(userMintedAmount.value).minus(epochInfo_.value.mintedZeUSD).dividedBy(10**ZEUSD_DECIMAL).toFixed(ZEUSD_DECIMAL);
    if(Number(mintableAmount.value) < 0) mintableAmount.value = 0;
    // console.log('mintable amount', mintableAmount.value);
  }
});

const calculateSwapAmount = (evt : any = null) => {
  console.log('haha')
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
      alert('success');
    });
  }
};

const approveZUSD = () => {
  // Call the Request_BuyETH function with requestAmount.value
  if(walletAddress && web3Manager && requestAmount.value){
    requestAmount.value = new BigNumber(requestAmount.value).dividedBy(100).integerValue(BigNumber.ROUND_DOWN).multipliedBy(100).multipliedBy(1.015).toString();
    calculateSwapAmount();
    web3Manager?.approve(new BigNumber(requestAmount.value).multipliedBy(10**ZEUSD_DECIMAL).multipliedBy(1.015).toFixed(0), walletAddress.value).then((res) => {
      alert('success');
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
    const approvedAmt = await web3Manager.getStableTokenManager().allowance(walletAddress.value, web3Manager.getEthVaultManager().getContractAddress());
    console.log('approved', approvedAmt);

    requestAmount.value = new BigNumber(requestAmount.value).dividedBy(100).integerValue(BigNumber.ROUND_DOWN).multipliedBy(100).toString();
    calculateSwapAmount();
    if( Number(approvedAmt) < requestAmount.value){
      web3Manager?.approve(new BigNumber(requestAmount.value).multipliedBy(10**ZEUSD_DECIMAL).multipliedBy(1.015).toFixed(0), walletAddress.value).then((res) => {
        alert('success');
      });
    }
    web3Manager?.requestBuyETH(new BigNumber(requestAmount.value).multipliedBy(10**ZEUSD_DECIMAL).multipliedBy(1.015).toFixed(0),walletAddress.value).then((res) => {
      alert('success');
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
  <div class="bg-black lg:w-6/12 sm:w-11/12">
    <div class="flex flex-col">
      <div
          class="self-center flex w-[232px] max-w-full items-stretch justify-between gap-5 max-md:justify-center"
      >
        <NuxtLink
            :class="props.isBuy ? 'text-lime-500' : 'text-neutral-300'"
             class="text-xl leading-6 self-center my-auto"
            to="/mint"
        >
          mint
        </NuxtLink>
        <div
            class="object-contain object-center w-1px stroke-[1px] stroke-white overflow-hidden shrink-0 max-w-full"
        />
        <NuxtLink
            :class="!props.isBuy ? 'text-lime-500' : 'text-neutral-300'"
            class=" text-xl leading-6 self-center whitespace-nowrap my-auto"
            to="/sell"
        >
          sell
        </NuxtLink>
      </div>
      <InfoHeadComponent class="mb-2">
        EPOCH BLOCK
      </InfoHeadComponent>
      <EpochBarComponent next-epoch="" end-block="" start-block="" current-block="" current-epoch=""/>
      <div
          class="self-center flex w-full flex-col items-stretch mt-4 max-md:max-w-full"
      >
        <div
            class="flex justify-between gap-1 max-md:max-w-full max-md:flex-wrap max-md:justify-center"
        >
          <div class="flex flex-col items-stretch w-16">
            <div class="text-white text-xl leading-6  whitespace-nowrap mt-2.5">
              FROM
            </div>
            <div
                class="text-white text-xl leading-6  whitespace-nowrap mt-2.5 self-start"
            >
              {{!props.isBuy? 'ZeUSD' : 'ETH'}}
            </div>
          </div>
          <input v-if="props.isBuy" v-model="sellAmount" @keyup="calculateSwapAmount"
                 class="flex grow flex-col px-5 py-4 rounded border-[0.5px] border-solid border-lime-500 bg-black text-white text-right text-3xl"
          />
          <input v-else v-model="requestAmount" @keyup="calculateSwapAmount"
                 class="flex grow flex-col px-5 py-4 rounded border-[0.5px] border-solid border-lime-500 bg-black text-white text-right text-3xl"
          />
          <div
              class="justify-center text-white text-center text-base leading-5 items-stretch px-2.5 py-3.5 rounded border-[0.5px] border-solid border-lime-500"
          >
            max
          </div>
          <div
              class="h-6 text-yellow-200 text-base leading-5 px-2 py-0.5 rounded border-[0.5px] border-solid border-lime-500"
          >
            !
          </div>
        </div>
        <div
            class="text-white text-right text-base leading-5 self-center w-full pr-24 mt-1"
        >
          Balance : {{!props.isBuy? toDecimalNumber(Balance_ZeUSD, ZEUSD_DECIMAL) + ' ZeUSD' : toDecimalNumber(Balance_Ethereum, ETH_DECIMAL) + ' ETH'}}
        </div>
      </div>
      <div
          class="self-center flex w-full flex-col items-stretch mt-4 max-md:max-w-full"
      >
        <div
            class="flex justify-between gap-1 max-md:max-w-full max-md:flex-wrap max-md:justify-center"
        >
          <div class="flex flex-col items-stretch w-16">
            <div class="text-white text-xl leading-6 whitespace-nowrap mt-2.5">
              TO
            </div>
            <div
                class="text-white text-xl leading-6 whitespace-nowrap mt-2.5 self-start"
            >
              {{props.isBuy? 'ZeUSD' : 'ETH'}}

            </div>
          </div>
          <div
              class="flex grow basis-[0%] flex-col px-5 py-4 rounded border-[0.5px] border-solid border-lime-500 bg-black text-white text-right text-3xl"
          >
            {{props.isBuy? buyZeUSDAmount : buyETHAmount}}
          </div>
<!--          </input>-->
          <div
              class="justify-center text-white text-center text-base leading-5 px-2.5 py-3.5 rounded border-[0.5px] border-solid border-lime-500"
          >
            max
          </div>
          <div
              class="h-6 text-yellow-200 text-base leading-5 px-2 py-0.5 rounded border-[0.5px] border-solid border-lime-500"
          >
            !
          </div>
        </div>
        <div
            class="text-white text-right text-base leading-5 self-center w-full pr-24 mt-1"
        >
           {{props.isBuy? 'Mintable Amount : ' + toDecimalNumber(mintableAmtAtEpoch, ZEUSD_DECIMAL) + ' ZeUSD' :  ''}}
        </div>
      </div>
      <div
          class="self-stretch flex w-full flex-col max-md:max-w-full max-md:px-5"
      >
        <InfoRowComponent :info-contents="`1 : ${ethPrice}`" info-title="RATIO (ETH:ZeUSD)"/>
        <InfoRowComponent info-contents="±5%" info-title="SLIPPAGE LIMIT"/>
        <InfoRowComponent :info-contents="props.isBuy? new BigNumber(buyZeUSDAmount).multipliedBy(0.95).toFixed(2)  + ' ZeUSD': new BigNumber(buyETHAmount).multipliedBy(0.95).toFixed(2) + ' ETH'" info-title="MINIMUM RECEIVED"/>
        <InfoRowComponent :info-contents="props.isBuy? new BigNumber(buyZeUSDAmount).multipliedBy(0.015).toFixed(2)  + ' ZeUSD': new BigNumber(buyETHAmount).multipliedBy(0.015).toFixed(2) + ' ETH'" info-title="FEE (1.5%)"/>
        <div
            class="flex-col text-white text-center text-xl leading-6 relative whitespace-nowrap overflow-hidden self-center aspect-[5.428571428571429] w-[152px] max-w-full items-center mt-5 px-5 py-2"
            @click="() => {props.isBuy? sellETH() : requestETH()}"
        >
<!--          <img-->
<!--              loading="lazy"-->
<!--              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4646c035-bf39-47ab-b12a-1a91d76b8a1e?apiKey=c4b153c28dfb4072b2cad18a5784b8a1&"-->
<!--              class="absolute z-[-1] h-full w-full object-cover object-center inset-0"-->
<!--          />-->
          {{props.isBuy? 'Buy' : 'Sell'}} ZeUSD
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.trade-page {
  display: flex;
  flex-direction: column;
//justify-content: center;
  align-items: center;
  padding-top: 2rem;
  height: 90vh;
  background-color: black;

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
.custom-container {
  background-color: blue;
}

/* 조건에 따라 배경색 변경 */
.custom-container.isBuyLocal {
  background-color: green;
}

</style>
