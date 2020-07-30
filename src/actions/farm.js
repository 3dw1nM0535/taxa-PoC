import Registry from '../build/Registry.json'
import Farm from '../build/Farm.json'
import ipfs from '../ipfs'
import api from '../api'
import { randomNumber } from '../utils'
import {
  SUBMITTING,
  QUERY_FARM,
} from '../types'

export const submitting  = status => ({
  type: SUBMITTING,
  status,
})

// Load registry contract
const initRegistry = async() => {
  const chainId = await window.web3.eth.net.getId()
  const networkData = Registry.networks[chainId]
  const registryContract = new window.web3.eth.Contract(Registry.abi, networkData.address)
  return registryContract
}

// Load farm contract
const initFarm = async() => {
  const chainId = await window.web3.eth.net.getId()
  const networkData = Farm.networks[chainId]
  const farmContract = new window.web3.eth.Contract(Farm.abi, networkData.address)
  return farmContract
}

export const addFarm = (size, lon, lat, file, soil) => async dispatch => {
  const loading = {}
  const registryContract = await initRegistry()
  const accounts = await window.web3.eth.getAccounts()
  const tokenId = randomNumber(999, 99999999)
  loading.status = true
  dispatch(submitting({ ...loading }))
  const { cid } = await ipfs.add(file)
  const fileHash = cid.string
  registryContract.methods.addFarm(size, lon, lat, fileHash, soil, tokenId).send({ from: accounts[0] })
    .on('transactionHash', () => {
      loading.status = false
      dispatch(submitting({ ...loading }))
    })
    .on('confirmation', async(confirmationNumber, receipt) => {
      if (confirmationNumber === 1) {
        const { _tokenId, _size, _soilType, _owner, _fileHash } = receipt.events.RegisterFarm.returnValues
        const farmContract = await initFarm()
        const _season = await farmContract.methods.getTokenSeason(Number(_tokenId)).call()
        api.wallet.addFarm(_tokenId, _size, _soilType, _owner, _fileHash, _season).then(res => console.log('Success'))
      }
    })
    .on('error', error => {
      loading.status = false
      dispatch(submitting({ ...loading }))
      window.alert(`Error: ${error.message}`)
    })
}

// Query farm from the blockchain
export const queryFarm = farm => ({
  type: QUERY_FARM,
  farm,
})

export const getFarm = (tokenId) => async dispatch => {
  const registryContract = await initRegistry()
  const account = await window.web3.eth.getAccounts()
  const { result } = await registryContract.methods.registry(tokenId).call({ from: account[0] })
  console.log(result)
}

