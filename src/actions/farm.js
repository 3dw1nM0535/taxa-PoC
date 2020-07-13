import Farm from '../build/Farm.json'
import Registry from '../build/Registry.json'
import { randomNumber } from '../utils'

// Init contract
const initFarmContract = async () => {
  const chainId = await window.web3.eth.net.getId()
  const networkData = Farm.networks[chainId]
  const farmContract = new window.web3.eth.Contract(Farm.abi, networkData.address)
  return farmContract
}

// Init Registry contract
const initRegistryContract = async () => {
  const chainId = await window.web3.eth.net.getId()
  const networkData = Registry.networks[chainId]
  const registryContract = new window.web3.eth.Contract(Registry.abi, networkData.address)
  return registryContract
}

// Init swarm
const initBzz = () => {
  window.web3.bzz.setProvider('http://swarm-gateways.net')
}

// Upload file to swarm
const uploadFile = async file => {
  initBzz()
  const hash = await window.web3.bzz.upload(file)
  return hash
}


export const addFarm = (size, lon, lat, file, soil, sizeUnit) => async dispatch => {
  // Upload farm file
  const fileHash = await uploadFile(file[0])
  const farmSize = size + sizeUnit
  const registryContract = await initRegistryContract()
  const account = await window.web3.eth.getAccounts()
  const tokenId = randomNumber(999, 99999999)
  registryContract.methods.addFarm(farmSize, lon, lat, fileHash, soil, tokenId).send({ from: account[0] })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log({ confirmationNumber, receipt })
    })
}


