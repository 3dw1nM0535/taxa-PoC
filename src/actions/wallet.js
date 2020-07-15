import Web3 from 'web3';
import makeBlockie from 'ethereum-blockies-base64';

// User(s) action creators
import {
  CONNECT_WALLET,
  WALLET_CHANGE,
  NETWORK_CHANGE,
} from '../types';

// When a user connect a wallet; return the wallet address
export const walletFound = wallet => ({
  type: CONNECT_WALLET,
  wallet,
})

// When user change wallet
export const walletChange = wallet => ({
  type: WALLET_CHANGE,
  wallet,
})

// When user changes network
export const netChange = wallet => ({
  type: NETWORK_CHANGE,
  wallet,
})

// Detect wallet
export const connectWallet = () => async dispatch => {
  let wallet = {}
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable()
    wallet.netId = await window.web3.eth.net.getId() 
    wallet.address = await window.web3.eth.getAccounts()
    wallet.addressBlockie = makeBlockie(String(wallet.address[0]))
    dispatch(walletFound({ ...wallet, loaded: true }))
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
		await window.ethereum.enable() 
    wallet.netId = await window.web3.eth.net.getId()
    wallet.address = await window.web3.eth.getAccounts()
    wallet.addressBlockie = makeBlockie(String(wallet.address[0]))
    dispatch(walletFound({ ...wallet, loaded: true }))
  } else {
    window.alert("You need MetaMask wallet to interact with this application. You will be redirected to a site to download the wallet for use in accessing the Ethereum blockchain.")
    window.location.assign("https://metamask.io/download.html")
  }
}

