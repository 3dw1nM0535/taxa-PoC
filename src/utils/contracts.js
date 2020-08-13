import Contract from 'web3-eth-contract'

export function initContract(contract, netVersion) {
  const networkData = contract.networks[netVersion]
  Contract.setProvider(window.web3.currentProvider)
  const newContract = new Contract(contract.abi, networkData.address)
  return newContract
}

