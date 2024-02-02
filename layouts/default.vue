
<script setup lang="ts">
import Header from "~/components/common/Header.vue"
import {createWeb3Instance} from "~/services/web3/util";
import {useStore} from "~/store";
import {storeToRefs} from "pinia";
import ConnectWalletButton from "~/components/WalletConnectButton/ConnectWalletButton.vue";
import {onMounted, ref} from "vue";
import EmergencyModal from "~/components/common/EmergencyModal.vue";
import Footer from "~/components/common/Footer.vue";
const store = useStore();
const {walletAddress, version, IS_STOP} = storeToRefs(store);
const dialog = ref(false);

onMounted(async () => {
})

const selectNetwork = (item) => {
  store.setVersion(item.versionID);
  // connect();
  // window.location.reload();
}
</script>


<template>
  <div class="bg-black min-h-screen">
    <Header/>
    <slot />
    <Footer/>
    <EmergencyModal />
  </div>
</template>


<style>

.header {
  background-color: black;
  padding: 20px 0;
  margin-bottom: 20px;
}

.nav {
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 95vw;
}

.nav-links {
  display: flex;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 1.2em;
  font-weight: bold;
  margin-right: 2rem;
}

.nav-link:last-child {
  margin-right: 0;
}

.wallet-connect {
  align-self: flex-end;
}
.footer {
  text-align: center;
  padding: 20px 0;
  background-color: #f8f9fa;
  color: #333;
  font-size: 0.8em;
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
