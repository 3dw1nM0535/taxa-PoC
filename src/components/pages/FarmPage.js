import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getFarm } from '../../actions'
import { useParams } from 'react-router-dom'

function FarmPage({ loading, getFarm }) {

  const { tokenId } = useParams()

  useEffect(() => {
    (async() => {
      await getFarm(tokenId)
    })()
  })

  return (
    <h1>Farm page</h1>
  )
}

FarmPage.propTypes = {
  getFarm: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    loading: state.loading.status,
  }
}

export default connect(mapStateToProps, { getFarm })(FarmPage)

