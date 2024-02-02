<script setup lang="ts">
import ConnectWalletButton from "~/components/WalletConnectButton/ConnectWalletButton.vue";
import {storeToRefs} from "pinia";
import {useStore} from "~/store";
import {onMounted} from "vue";
const store = useStore();
const {walletAddress, version, IS_STOP} = storeToRefs(store);



async function connect() {
  if (window.ethereum) {
    try {

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: getCurrentNetwork().chainInfo.chainId }],
        });
      } catch (switchError) {
        console.log(switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                getCurrentNetwork().chainInfo,
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      store.setWalletAddress(accounts[0]);

    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }

    // await connect();
    window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
      store.setWalletAddress(accounts[0]);
      window.location.reload()
    });

    window.ethereum.on('chainChanged', (chainId) => window.location.reload());
    await store.updateIS_STOP();
    // dialog.value = IS_STOP.value;
  }
  // Non-dapp browsers...
  else {
    console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

function numberToHex(n) {
  if (typeof n !== 'number') {
    throw new Error('Input must be a number');
  }
  return '0x' + n.toString(16);
}
const items = [
  {title: 'Ethereum', versionID: 2, chainInfo :
        {
          chainId: numberToHex(1),
        },
  },
  {title: 'Testnet', versionID: 3, chainInfo :
        {
          chainId: numberToHex(12837123),
          chainName: 'Z_Ether',
          rpcUrls: ['https://beta.zeusd.xyz/rpc'] ,
          nativeCurrency: {
            decimals: 18,
            name: 'ZeETH',
            symbol: 'ZeETH'
          }
        },
  },
  {title: 'Testnet', versionID: 4, chainInfo :
        {
          chainId: numberToHex(12837123),
          chainName: 'Z_Ether',
          rpcUrls: ['https://beta.zeusd.xyz/rpc'] ,
          nativeCurrency: {
            decimals: 18,
            name: 'ZeETH',
            symbol: 'ZeETH'
          }
        },
  }
]
const getCurrentNetwork = () =>{
  for (const item of items) {
    if(item.versionID === version.value) {
      return item;
    }
  }
}
onMounted(async () => {
  connect().then(null);
});
</script>

<template>
  <header class="flex items-stretch justify-between gap-5 max-md:flex-wrap max-md:justify-center bg-black">
    <a class="font-post text-lime-500 text-7xl leading-[88px] my-auto max-md:text-4xl max-md:leading-[52px] pl-5" href="/">
      TRZN
    </a>
    <div class="justify-between items-stretch self-center flex gap-5 my-auto px-5 max-md:max-w-full max-md:flex-wrap max-md:justify-center">
      <NuxtLink class="font-mono text-white text-center text-3xl leading-8 pr-10 pl-10 non-select" to="/mint">MINT</NuxtLink>
      <NuxtLink class="font-mono text-white text-center text-3xl leading-8 pr-10 pl-10 non-select" to="/sell">SELL</NuxtLink>
      <div class="font-mono text-white text-center text-3xl leading-8 pr-10 pl-10 dropdown non-select">DASHBOARD
        <div class="dropdown-content bg-white w-full">
          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/dashboard/summary">Summary</NuxtLink></div>
<!--          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/dashboard/governance">Governance</NuxtLink></div>-->
          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/dashboard/oracle">Oracle</NuxtLink></div>
          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/dashboard/safety_fund">Safety Fund</NuxtLink></div>
        </div>
      </div>
      <div class="font-mono text-white text-center text-3xl leading-8 pr-10 pl-10 dropdown non-select" >USER
        <div class="dropdown-content bg-white">
          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/user/rewards">REWARDS</NuxtLink></div>
          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/user/mintnsell">MINT&SELL</NuxtLink></div>
        </div>
      </div>
<!--      <div class="font-mono text-white text-center text-3xl leading-8 pr-10 pl-10 dropdown non-select" href="/dashboard">RM-->
<!--        <div class="dropdown-content bg-white">-->
<!--          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/mint">Summary</NuxtLink></div>-->
<!--          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/mint">EpochInfo</NuxtLink></div>-->
<!--          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/mint">Risk Manager</NuxtLink></div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="font-mono text-white text-center text-3xl leading-8 pr-10 pl-10 dropdown non-select" href="/dashboard">ADMIN-->
<!--        <div class="dropdown-content bg-white">-->
<!--          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/mint">Summary</NuxtLink></div>-->
<!--          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/mint">EpochInfo</NuxtLink></div>-->
<!--          <div class="text-black whitespace-nowrap mt-1 text-sm"><NuxtLink to="/mint">Risk Manager</NuxtLink></div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="flex items-stretch justify-between gap-2 pl-2 pr-3.5 py-5 ">
        <ConnectWalletButton :address="walletAddress" @click="connect">
        </ConnectWalletButton>
    </div>
  </header>
</template>

<style scoped>
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    padding: 12px 16px;
    z-index: 1;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }
</style>
