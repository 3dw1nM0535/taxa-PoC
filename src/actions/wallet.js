import Web3 from 'web3'

import {
  CONNECT_WALLET,
  WALLET_CHANGE,
  NETWORK_CHANGE,
} from '../types'

export const walletFound = wallet => ({
  type: CONNECT_WALLET,
  wallet,
})

export const walletChange = wallet => ({
  type: WALLET_CHANGE,
  wallet,
})

export const networkChange = wallet => ({
  type: NETWORK_CHANGE,
  wallet,
})

export const connectWallet = () => async dispatch => {
  const wallet = {}
  const isMetaMaskInstalled = typeof window.ethereum !== 'undefined'
  if (isMetaMaskInstalled) {
    window.web3 = new Web3(window.ethereum)
    wallet.netId = Web3.utils.hexToNumber(await window.web3.eth.net.getId())
    wallet.address = await window.web3.eth.getAccounts()
    dispatch(walletFound({ ...wallet }))
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    wallet.netId = Web3.utils.hexToNumber(await window.web3.eth.net.getId())
    wallet.address = await window.web3.eth.getAccounts()
    dispatch(walletFound({ ...wallet }))
  } else {
    window.alert('You need MetaMask wallet to interact with the application. We will redirect you to installation instructions')
    window.location.assign('https://metamask.io/download.html')
  }
}

