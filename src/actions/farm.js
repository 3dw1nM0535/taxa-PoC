import Contract from 'web3-eth-contract'
import Registry from '../build/Registry.json'
import Farm from '../build/Farm.json'
import ipfs from '../ipfs'
import api from '../api'
import { randomNumber } from '../utils'
import { store } from '../store'
import {
  SUBMITTING,
  QUERY_FARM,
} from '../types'

const submitting  = status => ({
  type: SUBMITTING,
  status,
})

// Get chani id
async function getChainId() {
  const chainId = await window.web3.eth.net.getId()
  return chainId
}

// Get contract address
async function networkAddress(contract) {
  const chainId = await getChainId()
  const networkMeta = contract.networks[chainId]
  return networkMeta.address
}

export const addFarm = (size, lon, lat, file, soil) => async dispatch => {
  const loading = {}
  const registryContractAddress = await networkAddress(Registry)
  const farmContractAddress = await networkAddress(Farm)
  const registryContract = new window.web3.eth.Contract(Registry.abi, registryContractAddress)
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
        const farmContract = new window.web3.eth.Contract(Farm.abi, farmContractAddress)
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

const getNetAddress = (contract) => {
  const { wallet } = store.getState()
  const network = contract.networks[wallet.netId]
  return network.address
}

const getFarmSeason = async(token, contract) => {
  const address = getNetAddress(contract)
  const farmContract = new Contract(Farm.abi, address)
  const season = await farmContract.methods.getTokenSeason(token).call()
  return season
}

export const getFarm = (tokenId) => async dispatch => {
  const { wallet } = store.getState()
  const networkData = Registry.networks[wallet.netId]
  Contract.setProvider(window.web3.currentProvider)
  const registryContract = new Contract(Registry.abi, networkData.address)
  const result = await registryContract.methods.registry(tokenId).call({ from: wallet.address[0] })
  const farmSeason = await getFarmSeason(Number(tokenId), Farm)
  const farm = {
    size: result.size,
    soil: result.soilType,
    imageHash: result.fileHash,
    lon: result.longitude,
    lat: result.latitude,
    owner: result.owner,
    season: farmSeason,
  }
  dispatch(queryFarm({ ...farm }))
}

