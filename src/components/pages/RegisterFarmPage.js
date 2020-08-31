import PropTypes from 'prop-types'
import React from 'react'
import {
  Grid,
  Header,
  List,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

import { RegisterFarm } from '../forms'
import { addFarm } from '../../actions'
import { ConfirmedTx, ConfirmingTx } from '../notifications'

const pros = [
  'Get rewarded with a unique and traceable non-fungible token(NFT) that only belongs to you and only you',
  'Be accountable to your farm by recording seasonal farming activities',
  'Participate in an open, borderless, and uncensored digital marketplace',
  'Receive bookings for your harvest without middlemen',
  'Get paid in a cryptocurrency known as Ether'
]

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
            content='Why register your farm land to a public blockchain?'
          />
          <List size='massive' as='ul'>
            {pros.map((item, index) => (
              <List.Item key={index} as='li'>
                {item}
              </List.Item>
            ))}
          </List>
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

