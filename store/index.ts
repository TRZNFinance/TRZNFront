import {defineStore} from 'pinia'
import Web3Manager, {ZEUSD_DECIMAL} from "~/services/web3/web3Manager";
import {createWeb3Instance, toDecimalNumber,} from "~/services/web3/util";
import {contracts as contracts_static} from "~/static/contracts";
import BigNumber from "bignumber.js";

interface EpochInfo {
  curEpoch: number
  epochLength: number
  epochStartBlock: number
  epochEndBlock: number
}
interface AppState {
  walletAddress: string
  Balance_Ethereum: string
  Balance_ZeUSD: string
  Balance_Escrow: string
  version: number
  IS_STOP: boolean
  priceInfo: {eth: any} | null
  epochInfo: {curEpoch: number, epochLength: number, epochStartBlock: number, epochEndBlock: number, rmEpoch: number}|null
  currentBlock: number | null
}
export const useStore = defineStore('main', {
  state: () : AppState => ({
    walletAddress: '',
    Balance_Ethereum: '',
    Balance_ZeUSD: '',
    Balance_Escrow: '',
    version: 4,
    IS_STOP: false,
    priceInfo: null,
    epochInfo: null,
    currentBlock: null,
  }),
  getters: {
    // doubleCount: (state) => state.count * 2,
    // @ts-ignore
    contracts: (state) => contracts_static[state.version],
  },
  actions: {
    setVersion(version: number) {
      this.version = version;
    },
    setWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress;
      if(this.walletAddress && this.walletAddress != '') {
        this.updateBalance();
      }
    },
    async updateBalance() {
      if (typeof window === 'undefined') return;
      const web3Manager = new Web3Manager(createWeb3Instance(), this.contracts);
      this.Balance_ZeUSD  = await web3Manager.zUSDBalanceOf(this.walletAddress);
      this.Balance_Escrow  = await web3Manager.getEscrowTokenManager().balanceOf(this.walletAddress);
      this.Balance_Ethereum = await createWeb3Instance().eth.getBalance(this.walletAddress);
    },
    async updateIS_STOP() {
      if (typeof window === 'undefined') return;
      const web3Manager = new Web3Manager(createWeb3Instance(), this.contracts);
      this.IS_STOP = await web3Manager.getEthVaultManager().isEmergencyStopped();
      // console.log(this.IS_STOP);
    },
    async updateEpochInfo(){
      if (typeof window === 'undefined') return;
      const web3Manager = new Web3Manager(createWeb3Instance(), this.contracts);
      const epochStartBlock = Number(await web3Manager.getCurrentEpochStartBlock());
      const epochTerm = Number(await web3Manager.getCurrentEpochTerm());
      const rmEpoch = Number(await web3Manager.getStableTokenManager().lastestRMEpoch());
      const curEpoch= Number(await web3Manager.getCurrentEpoch());
      this.epochInfo = {
        curEpoch: curEpoch,
        epochLength: epochTerm,
        epochStartBlock: epochStartBlock + (curEpoch-1) * epochTerm,
        epochEndBlock: epochStartBlock  + (curEpoch) * epochTerm,
        rmEpoch: rmEpoch
      }
    },
    async updatePriceInfo() {
      if (typeof window === 'undefined') return;
      const web3Manager = new Web3Manager(createWeb3Instance(), this.contracts);
      this.priceInfo = {
        eth: await web3Manager.getOracleManager().getERC20Price_High(this.contracts.wethTokenContract),
      }
      console.log('what the', this.priceInfo);
    },
    async updateCurrentBlock() {
      if (typeof window === 'undefined') return;
      const web3Manager = new Web3Manager(createWeb3Instance(), this.contracts);
      this.currentBlock = await web3Manager.getCurrentBlock();
      // console.log(this.IS_STOP);
    }
  },
  persist: {
    // storage: persistedState.localStorage,
  },
})
