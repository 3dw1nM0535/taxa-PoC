import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getFarm } from '../../actions'
import { useParams } from 'react-router-dom'

function FarmPage({ getFarm }) {

  const { tokenId } = useParams()
  getFarm(tokenId)

  return (
    <h1>Farm page</h1>
  )
}

FarmPage.propTypes = {
  getFarm: PropTypes.func.isRequired,
}

export default connect(null, { getFarm })(FarmPage)

