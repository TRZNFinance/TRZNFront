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
import RM_UpdateReward from "~/components/riskManager/RM_UpdateReward.vue";
import RM_UpdateDeposit from "~/components/riskManager/RM_UpdateDeposit.vue";
import User_RedeemInfo from "~/components/riskManager/User_RedeemInfo.vue";
import RM_DepositEscrow from "~/components/riskManager/RM_DepositEscrow.vue";
import RM_EscrowStatus from "~/components/riskManager/RM_EscrowStatus.vue";
const config = useRuntimeConfig()

const tabs = [
  { name: 'RM_UpdateReward', label: 'Update_Reward', component: RM_UpdateReward },
  { name: 'RM_UpdateDeposit', label: 'Update_Deposit', component: RM_UpdateDeposit },
  { name: 'Redemption_Info', label: 'Redemption_Info', component: User_RedeemInfo },
  { name: 'RM_DepositEscrow', label: 'Escrow_Deposit', component: RM_DepositEscrow },
  { name: 'RM_EscrowStatus', label: 'Escrow_Status', component: RM_EscrowStatus },
];
const activeTab = ref(tabs[0].name); // Default to the first tab


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
