import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import Contract from 'web3-eth-contract'
import { connect } from 'react-redux'
import { queryFarm } from '../../actions'
import { useParams } from 'react-router-dom'
import Farm from '../../build/Farm.json'
import Registry from '../../build/Registry.json'
import { store } from '../../store'
import { FarmComponent } from '../farm'

function FarmPage({ loaded, netId, loading }) {
  
  const { tokenId } = useParams()

  useEffect(() => {

    const getFarmSeason = async(token, contract, netVersion) => {
      const networkData = Farm.networks[netVersion]
      const farmContract = new Contract(Farm.abi, networkData.address)
      const season = await farmContract.methods.getTokenSeason(token).call()
      return season
    }

    (async() => {
      const networkData = Registry.networks[netId]
      Contract.setProvider(window.web3.currentProvider)
      const registryContract = new Contract(Registry.abi, networkData.address)
      const result = await registryContract.methods.registry(Number(tokenId)).call()
      const farmSeason = await getFarmSeason(Number(tokenId), Farm, netId)
      const farm = {
        size: result.size,
        soil: result.soilType,
        imageHash: result.fileHash,
        lon: result.longitude,
        lat: result.latitude,
        owner: result.owner,
        season: farmSeason,
      }
      store.dispatch(queryFarm({ ...farm }))
    })()
  })

  return (
    <>
      <FarmComponent />
    </>
  )
}

FarmPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  netId: PropTypes.number.isRequired,
  loaded: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    loading: state.loading.status,
    netId: Number(state.network.netId),
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(FarmPage)

