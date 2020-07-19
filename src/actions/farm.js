//import Farm from '../build/Farm.json'
import Registry from '../build/Registry.json'
import { randomNumber } from '../utils'
import api from '../api'
import { SUBMITTING } from '../types'

// Init contract
/*
 *const initFarmContract = async () => {
 *  const chainId = await window.web3.eth.net.getId()
 *  const networkData = Farm.networks[chainId]
 *  const farmContract = new window.web3.eth.Contract(Farm.abi, networkData.address)
 *  return farmContract
 *}
 */

export const submitting = status => ({
  type: SUBMITTING,
  status,
})

// Init Registry contract
const initRegistryContract = async () => {
  const chainId = await window.web3.eth.net.getId()
  const networkData = Registry.networks[chainId]
  const registryContract = new window.web3.eth.Contract(Registry.abi, networkData.address)
  return registryContract
}

function initBzz() {
  window.web3.bzz.setProvider('https://swarm-gateways.net')
}

async function uploadFile(file) {
  initBzz()
  const hash = await window.web3.bzz.upload(file)
  return hash
}

export const addFarm = (_size, _lon, _lat, _file, _soil, _sizeUnit) => async dispatch => {
  const loadingState = {}
  const registryContract = await initRegistryContract()
  const accounts = await window.web3.eth.getAccounts()
  const tokenId = randomNumber(999, 99999999)
  const farmSize = _size + _sizeUnit
  const fileHash = await uploadFile(_file[0])
  const lon = String(_lon)
  const lat = String(_lat)
  loadingState.status = true
  dispatch(submitting({ ...loadingState }))
  registryContract.methods.addFarm(farmSize, lon, lat, fileHash, _soil, tokenId).send({ from: accounts[0] })
    .on('transactionHash', () => {
      loadingState.status = false
      dispatch(submitting({ ...loadingState }))
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber === 24) {
        const { _tokenId, _fileHash, _size, _soilType } = receipt.events.RegisterFarm.returnValues
        api.wallet.addFarm(_tokenId, _size, _soilType, _fileHash).then(res => console.log(res))
      }
    })
     .on('error', error => {
       loadingState.status = false
       dispatch(submitting({ ...loadingState }))
       window.alert(`Error: ${error.message}`)
    })
}


