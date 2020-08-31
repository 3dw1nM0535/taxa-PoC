import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function UserRoute({ loaded, netId, component: Component, ...rest }) {
  return (
    <Route { ...rest } render={props => loaded ? <Component { ...props } /> : <Redirect to={{ pathname: "/", state: { from: props.location } }} /> } />
  )
}

UserRoute.propTypes = {
  component: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  netId: PropTypes.number.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
    netId: state.network.netId,
  }
}

export default connect(mapStateToProps)(UserRoute)

