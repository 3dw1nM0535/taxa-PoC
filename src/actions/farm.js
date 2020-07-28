import Registry from '../build/Registry.json'
import { randomNumber } from '../utils'
import { SUBMITTING } from '../types'

export const submitting  = status => ({
  type: SUBMITTING,
  status,
})

// Load registry contract
const initRegistry = async () => {
  const chainId = await window.web3.eth.net.getId()
  const networkData = Registry.networks[chainId]
  const registryContract = new window.web3.eth.Contract(Registry.abi, networkData.address)
  return registryContract
}

// Upload file to swarm
function initBzz() {
  window.web3.bzz.setProvider('https://swarm-gateways.net')
}

async function uploadFile(file) {
  initBzz()
  if (typeof file !== 'undefined') {
    const hash = await window.web3.bzz.upload(file)
    return hash
  }
  return
}

export const addFarm = (size, lon, lat, file, soil) => async dispatch => {
  const loading = {}
  const registryContract = await initRegistry()
  const accounts = await window.web3.eth.getAccounts()
  const tokenId = randomNumber(999, 99999999)
  const fileHash = await uploadFile(file)
  loading.status = true
  dispatch(submitting({ ...loading }))
  registryContract.methods.addFarm(size, lon, lat, fileHash, soil, tokenId).send({ from: accounts[0] })
    .on('transactionHash', () => {
      loading.status = false
      dispatch(submitting({ ...loading }))
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber === 24) {
        const { _tokenId, _size, _soilType } = receipt.events.RegisterFarm.returnValues
        console.log({ _tokenId, _size, _soilType })
      }
    })
    .on('error', error => {
      loading.status = false
      dispatch(submitting({ ...loading }))
      window.alert(`Error: ${error.message}`)
    })
}
