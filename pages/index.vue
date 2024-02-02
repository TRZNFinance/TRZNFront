<template>
  <div class="shadow-sm bg-black flex flex-col pl-10 pr-10 max-md:pl-5">
    <div
        class="landing-info flex-col overflow-hidden self-center relative flex min-h-[458px] w-full items-center mt-28 pl-10 pr-10 py-12 max-md:max-w-full max-md:mt-10 "
    >
      <div
          class="landing-info-text relative justify-center text-center text-3xl leading-8 mt-20 max-md:mt-10 stroke-black"
      >
        Hedging Against Inflation,<br />Locking up
      </div>
      <div
          class="landing-info-text relative justify-center text-center text-3xl leading-8 mt-20 max-md:mt-10"
      >
        An improved Stablecoin stability & transparency through hedging mechanisms
      </div>
    </div>
    <div
        class="border self-stretch flex flex-col items-center mt-20 px-5 py-12 rounded-[400px] border-solid border-lime-500 max-md:max-w-full max-md:mt-10"
    >
      <div class="w-full max-w-[1071px] my-2 max-md:max-w-full">
        <div
            class="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0"
        >
          <div
              class="flex flex-col items-stretch w-[28%] max-md:w-full max-md:ml-0"
          >
            <div class="flex flex-col items-stretch my-auto max-md:mt-10">
              <div
                  class="justify-center text-white text-center text-5xl leading-[66px] max-md:text-4xl max-md:leading-[50px]"
              >
                $ {{ currentTotalAsset }}
              </div>
              <div
                  class="justify-center text-white text-center text-2xl leading-8 self-center mt-8"
              >
                Total Underlying Value
              </div>
            </div>
          </div>
          <div
              class="flex flex-col items-stretch w-[72%] ml-5 max-md:w-full max-md:ml-0"
          >
            <div
                class="flex grow items-stretch justify-between gap-5 max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:mt-10"
            >
              <div
                  class="self-center flex grow basis-[0%] flex-col items-stretch my-auto"
              >
                <div
                    class="justify-center text-white text-center text-5xl leading-[66px] max-md:text-4xl max-md:leading-[50px]"
                >
                  {{ currentTotalSupply }} ZeUSD
                </div>
                <div
                    class="justify-center text-white text-center text-2xl leading-8 whitespace-nowrap mt-8"
                >
                  Total ZeUSD Supply
                </div>
              </div>
              <div
                  class="self-center flex grow basis-[0%] flex-col items-stretch my-auto"
              >
                <div
                    class="justify-center text-white text-center text-5xl leading-[66px] max-md:text-4xl max-md:leading-[50px]"
                >
                  {{ epochInfo?.curEpoch }}
                </div>
                <div
                    class="justify-center text-white text-center text-2xl leading-8 mt-8"
                >
                  Current Epoch
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white flex min-h-[82px] flex-col rounded-[90px] mt-20"></div>
    <div
        class="text-teal-800 text-opacity-0 text-center text-4xl leading-10 self-center whitespace-nowrap mt-36 max-md:mt-10"
    >
      <span class="text-white">WHY USE </span
      ><span class="font-post text-lime-500">ZeUSD</span
    ><span class="text-white">?</span>
    </div>
    <div class="self-center w-full max-w-[1198px] mt-8 max-md:max-w-full">
      <div class="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div
            class="flex flex-col items-stretch w-3/5 max-md:w-full max-md:ml-0"
        >
          <div
              class="flex grow flex-col items-stretch mt-5 max-md:max-w-full max-md:mt-9"
          >
            <div class="text-white text-3xl leading-8 max-md:max-w-full">
              Addressing volatility and option pricing inefficiencies by
              allocating reserves and utilizing advanced AI-based time series
              forecasting for maximum capital optimization.
            </div>
            <div
                class="border flex w-[308px] max-w-full items-stretch gap-5 ml-32 mt-8 px-14 py-5 rounded-[44px] border-solid border-lime-500 self-start max-md:ml-2.5 max-md:px-5"
            >
              <a
                  class="justify-center text-white text-center text-4xl leading-10 uppercase flex-1"
                  href="/swap"
              >
                Mint
              </a>
              <a
                  class="font-post text-lime-500 text-5xl font-bold leading-[62px] whitespace-nowrap"
                  href="/swap"
              >
                ZeUSD
              </a>
            </div>
          </div>
        </div>
        <div
            class="flex flex-col items-stretch w-2/5 ml-5 max-md:w-full max-md:ml-0"
        >
          <img
              loading="lazy"
              src="@/assets/image/landing_bg_key.svg"
              class="aspect-[2] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-4"
          />
        </div>
      </div>
    </div>
    <div
        class="self-center w-full max-w-[1161px] mt-32 max-md:max-w-full max-md:mt-10"
    >
      <div class="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div
            class="flex flex-col items-stretch w-[55%] max-md:w-full max-md:ml-0"
        >
          <div
              class="flex grow flex-col items-center max-md:max-w-full max-md:mt-10"
          >
            <img
                loading="lazy"
                src="@/assets/image/icon/lock.png"
                class="aspect-[0.92] object-contain object-center w-[55px] stroke-[1px] stroke-lime-500 overflow-hidden max-w-full"
            />
            <div
                class="text-white text-center text-3xl leading-8 self-stretch mt-8 max-md:max-w-full"
            >
              Leveraging options for hedging offers better position management
              than futures, with at-the-money risk reversals mitigating time
              decay.
            </div>
          </div>
        </div>
        <div
            class="flex flex-col items-stretch w-[45%] ml-5 max-md:w-full max-md:ml-0"
        >
          <div
              class="flex flex-col items-center max-md:max-w-full max-md:mt-10"
          >
            <img
                loading="lazy"
                src="@/assets/image/icon/circle_arrow.png"
                class="aspect-[0.82] object-contain object-center w-[53px] stroke-[1px] stroke-lime-500 overflow-hidden max-w-full"
            />
            <div
                class="text-white text-center text-3xl leading-8 self-stretch mt-7 max-md:max-w-full"
            >
              Portfolio managers pay premiums for future contract extensions due
              to historical spread advantages and positive funding rates in the
              futures market.
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    <div-->
<!--        class="text-white text-center text-4xl leading-10 self-center whitespace-nowrap mt-36 max-md:mt-10"-->
<!--    >-->
<!--      TOP Risk Managers-->
<!--    </div>-->
<!--    <div class="self-stretch mt-10 max-md:max-w-full">-->
<!--      <div class="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">-->
<!--        <div-->
<!--            class="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0"-->
<!--        >-->
<!--          <img-->
<!--              loading="lazy"-->
<!--              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8805c67-17aa-4b49-8ece-a33fdf871684?apiKey=c4b153c28dfb4072b2cad18a5784b8a1&"-->
<!--              class="aspect-[1.4] object-contain object-center w-full overflow-hidden grow max-md:mt-10"-->
<!--          />-->
<!--        </div>-->
<!--        <div-->
<!--            class="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0"-->
<!--        >-->
<!--          <img-->
<!--              loading="lazy"-->
<!--              src="https://cdn.builder.io/api/v1/image/assets/TEMP/adb8d571-0fd4-4687-bba5-0af406e6506f?apiKey=c4b153c28dfb4072b2cad18a5784b8a1&"-->
<!--              class="aspect-[1.4] object-contain object-center w-full overflow-hidden grow max-md:mt-10"-->
<!--          />-->
<!--        </div>-->
<!--        <div-->
<!--            class="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0"-->
<!--        >-->
<!--          <img-->
<!--              loading="lazy"-->
<!--              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc5044c4-6336-4362-99ec-7eada6d104c7?apiKey=c4b153c28dfb4072b2cad18a5784b8a1&"-->
<!--              class="aspect-[1.4] object-contain object-center w-full overflow-hidden grow max-md:mt-10"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div
        class="justify-center text-white text-center text-3xl leading-8 self-center max-w-[975px] mt-24 max-md:max-w-full max-md:mt-10"
    >
      Hedging against inflation without locking up Stablecoin.
    </div>
    <div class="self-center flex w-[253px] max-w-full items-stretch gap-3 mt-9">
      <div
          class="justify-center text-lime-500 text-center text-4xl leading-10 underline"
      >
        Mint ZeUSD
      </div>
      <img
          loading="lazy"
          src="@/assets/image/icon/upright_arrow.svg"
          class="aspect-square object-contain object-center w-[30px] fill-lime-500 overflow-hidden shrink-0 max-w-full self-start"
      />
    </div>
    <div
        class="self-center w-full max-w-[1071px] mt-28 max-md:max-w-full max-md:mt-10"
    >
      <div class="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div
            class="flex flex-col items-stretch w-[53%] max-md:w-full max-md:ml-0"
        >
          <div
              class="justify-center items-stretch flex flex-col max-md:max-w-full max-md:mt-10"
          >
            <div
                class="text-lime-500 text-center text-4xl leading-10 whitespace-nowrap max-md:max-w-full font-post"
            >
              TRZN
            </div>
            <div
                class="text-stone-300 text-xl leading-6 mt-7 max-md:max-w-full"
            >
              A protected Stablecoin option in response to the volatility of the
              crypto market, and enabling collateral of various assets with a
              low collateralization rate.
            </div>
          </div>
        </div>
        <div
            class="flex flex-col items-stretch w-[47%] ml-5 max-md:w-full max-md:ml-0"
        >
          <div class="grow max-md:max-w-full max-md:mt-10">
            <div
                class="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0"
            >
              <div
                  class="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0"
              >
                <div
                    class="justify-center items-stretch flex grow flex-col max-md:mt-10"
                >
                  <div class="text-stone-300 text-3xl leading-9">ABOUT</div>
                  <div class="text-stone-300 text-lg leading-5 mt-5">
                    Medium
                  </div>
                  <div class="text-stone-300 text-lg leading-5 mt-4">
                    Github
                  </div>
                  <div class="text-stone-300 text-lg leading-5 mt-4">Docs</div>
                  <div class="text-stone-300 text-lg leading-5 mt-4">
                    Governance
                  </div>
                </div>
              </div>
              <div
                  class="flex flex-col items-stretch w-[44%] ml-5 max-md:w-full max-md:ml-0"
              >
                <div
                    class="justify-center items-stretch flex grow flex-col max-md:mt-10"
                >
                  <div class="text-stone-300 text-3xl leading-9">PRODUCTS</div>
                  <div class="text-stone-300 text-lg leading-5 mt-5">
                    User Dashboard
                  </div>
                  <div class="text-stone-300 text-lg leading-5 mt-4">
                    Mint ZeUSD
                  </div>
                  <div class="text-stone-300 text-lg leading-5 mt-4">
                    Reward ZeUSD
                  </div>
                  <div
                      class="text-stone-300 text-lg leading-5 whitespace-nowrap mt-4"
                  >
                    User Safety Fund
                  </div>
                </div>
              </div>
              <div
                  class="flex flex-col items-stretch w-[23%] ml-5 max-md:w-full max-md:ml-0"
              >
                <div
                    class="justify-center items-stretch flex flex-col max-md:mt-10"
                >
                  <div class="text-stone-300 text-3xl leading-9">PAGES</div>
                  <div class="text-stone-300 text-lg leading-5 mt-5">Mint</div>
                  <div class="text-stone-300 text-lg leading-5 mt-4">Sell</div>
                  <div class="text-stone-300 text-lg leading-5 mt-4">
                    Dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-stretch gap-4 justify-center mt-10 mb-10">

      <img
          loading="lazy"
          src="@/assets/image/icon/link_linkedin.png"
          class="aspect-[1.02] object-contain object-center w-[52px] fill-stone-300 stroke-[1px] stroke-stone-300 overflow-hidden shrink-0 max-w-full"
      />
      <img
          loading="lazy"
          src="@/assets/image/icon/link_twitter.png"
          class="aspect-[1.02] object-contain object-center w-[52px] fill-stone-300 stroke-[1px] stroke-stone-300 overflow-hidden shrink-0 max-w-full"
      />
      <img
        loading="lazy"
        src="@/assets/image/icon/link_youtube.png"
        class="aspect-[1.02] object-contain object-center w-[52px] stroke-[1px] overflow-hidden shrink-0 max-w-full rounded-[50%]"
    />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {createWeb3Instance, toDecimalNumber} from '~/services/web3/util';
import Web3Manager, {ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import BigNumber from "bignumber.js";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";

const store = useStore()
const { walletAddress, version, epochInfo, priceInfo } = storeToRefs(store)
const { contracts } = store;

const currentTotalSupply = ref('');
const currentTotalAsset = ref('');

const v = ref('');
let web3Manager = null;

store.updateEpochInfo();
store.updateCurrentBlock();
store.updatePriceInfo();

onMounted(async () => {

  const web3 = createWeb3Instance()
  web3Manager = new Web3Manager(web3, contracts);


  web3Manager.zUSDTotalSupply().then((zUSDSupply) => {
    currentTotalSupply.value = toDecimalNumber(zUSDSupply, ZEUSD_DECIMAL, 3);
    currentTotalAsset.value = toDecimalNumber(new BigNumber(zUSDSupply).multipliedBy(1.0 + Math.random() * 0.05), ZEUSD_DECIMAL, 3);
  });

});

</script>


<style scoped>

.landing-info {
  background-image: url("assets/image/landing_bg_pattern.svg");
}
.landing-info-text {
  color: white;
  text-shadow: black 0px 0 10px;
}
.epoch-page {
  height: 100vh;
  background-color: #f5f5f5;
}

.info-card {
  height: 14rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info-title {
  font-size: 2.5rem;
}
.info-text {
  font-size: 2.3rem;
}
</style>
