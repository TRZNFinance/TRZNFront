<template>
<!--    <h1 class="title">Manager Functions</h1>-->
    <v-tabs
        v-model="activeTab"
        show-arrows
        slider-color="teal-lighten-3"
        bg-color="teal-darken-3"

    >
      <v-tab
          v-for="tabItem in tabs"
          :key="tabItem.name"
          :value="tabItem.name">
        {{ tabItem.label }}
      </v-tab >
    </v-tabs>

  <div class="admin-page">
    <v-window class="tab-content" >
      <component :is="activeTabComponent" />
    </v-window>


  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RM_Change from "~/components/admin/RM_Change.vue";
import VaultManagerSetParams from "~/components/admin/VaultManagerSetParams.vue";
import EthVaultSetParams from "~/components/admin/EthVaultSetParams.vue";
import OracleSetToken from "~/components/admin/OracleSetToken.vue";
import OracleSetParams from "~/components/admin/OracleSetParams.vue";
import Emergency from "~/components/admin/Emergency.vue";
import RiskManagerSetParams from "~/components/admin/RiskManagerSetParams.vue";
const config = useRuntimeConfig()

const tabs = [
  { name: 'RM_Change', label: 'Change_RM', component: RM_Change },
  { name: 'VM_SetParam', label: 'VM_SetParam', component: VaultManagerSetParams },
  { name: 'EthV_SetParam', label: 'SV(ETH)_SetParam', component: EthVaultSetParams },
  { name: 'Oracle_SetToken', label: 'Ora_SetToken', component: OracleSetToken },
  { name: 'Oracle_SetParam', label: 'Ora_SetParam', component: OracleSetParams },
  { name: 'Escrow_SetParam', label: 'Escrow_SetParam', component: RiskManagerSetParams },
  { name: 'Emergency', label: 'Emergency', component: Emergency },
  // { name: 'EthV_SetParam', label: 'EthV_SetParam', component: EthVaultSetParams },
  // { name: 'EthV_SetParam', label: 'EthV_SetParam', component: EthVaultSetParams },
  // { name: 'EthV_SetParam', label: 'EthV_SetParam', component: EthVaultSetParams },
  // { name: 'RedeemETH', label: 'Redeem ETH', component: RedeemETH }
];
const activeTab = ref(tabs[0].name); // Default to the first tab

// onMounted(async () => {
//   const web3 = createWeb3Instance();
//   const accounts = await web3.eth.getAccounts();
//
//   // Here you will call the getCurrentEpoch function and assign the result to currentEpoch value
// });

const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.name === activeTab.value);
  return tab ? tab.component : null;
});
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  //justify-content: top;
  align-items: center;
  height: 90vh;
  background-color: #f5f5f5;
  padding-bottom: 2rem;
}

.tab-content {
  margin-top: 2rem;
  width: 50rem;
  height: 70vh;
  overflow-y: auto; /* Make it scrollable vertically */

}

</style>
