import PropTypes from 'prop-types'
import React from 'react'
import {
  Grid,
  Header,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

import { RegisterFarm } from '../forms'
import { addFarm } from '../../actions'
import { ConfirmedTx, ConfirmingTx } from '../notifications'

function RegisterFarmPage({ txConfirmed, txConfirming, addFarm }) {
  return (
    <Grid
      style={{ margin: '1em 1em 1em 1em' }}
      columns={2}
      centered
      divided
      stackable
    >
      <Grid.Row>
        <Grid.Column>
          <Header
            as='h1'
            style={{
              fontSize: '3em',
            }}
            content='Register your farm to the blockchain'
          />
        </Grid.Column>
        <Grid.Column>
          {txConfirmed && <ConfirmedTx />}
          {txConfirming && <ConfirmingTx />}
          <RegisterFarm addFarm={addFarm} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

RegisterFarmPage.propTypes = {
  txConfirmed: PropTypes.bool.isRequired,
  txConfirming: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    txConfirmed: state.loading.confirmed,
    txConfirming: state.loading.confirming,
  }
}

export default connect(mapStateToProps, { addFarm })(RegisterFarmPage)

