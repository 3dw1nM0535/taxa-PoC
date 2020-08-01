import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

export function FarmComponent({ farmData }) {
  return (
    <h1>{farmData.soil}</h1>
  )
}

FarmComponent.propTypes = {
  farmData: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    farmData: state.farm,
  }
}

export default connect(mapStateToProps)(FarmComponent)

