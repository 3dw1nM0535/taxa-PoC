import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { queryFarm } from '../../actions'
import { useParams } from 'react-router-dom'
import Farm from '../../build/Farm.json'
import Registry from '../../build/Registry.json'
import { store } from '../../store'
import { FarmComponent } from '../farm'
import { initContract } from '../../utils'

function FarmPage({ loaded, netId }) {
  
  const { tokenId } = useParams()

  useEffect(() => {
    (async() => {
      let result
      let farmSeason
      let numberOfSeasons 
      let currentSeasonNumber
      const farmContract = initContract(Farm, netId)
      const registryContract = initContract(Registry, netId)
      try {
        result = await registryContract.methods.registry(tokenId).call()
      } catch(error) {
        console.log(error)
      }
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.latitude},${result.longitude}&key=${process.env.REACT_APP_GEOCODE_KEY}`)
      const data = await response.json()
      try {
        farmSeason = await farmContract.methods.getTokenSeason(tokenId).call()
      } catch(error) {
        console.log(error)
      }
      try {
        numberOfSeasons = await farmContract.methods.completedSeasons(tokenId).call()
      } catch(error) {
        console.log(error)
      }
      try {
        currentSeasonNumber = await farmContract.methods.currentSeason(tokenId).call()
      } catch(error) {
        console.log(error)
      }
      const farm = {
        token: tokenId,
        name: result.name,
        size: result.size,
        soil: result.soilType,
        imageHash: result.fileHash,
        lon: result.longitude,
        lat: result.latitude,
        owner: result.owner,
        season: farmSeason,
        presentSeason: currentSeasonNumber,
        completeSeasons: numberOfSeasons,
        location: data.results[0],
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

