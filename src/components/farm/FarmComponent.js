import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  Tab,
  Divider,
} from 'semantic-ui-react'

import { Harvest, Booking } from '../farm'
import { FarmHeader } from '../farm'

const panes = [
  {
    menuItem: 'Harvests',
    render: () => <Tab.Pane><Harvest /></Tab.Pane>
  },
  {
    menuItem: 'Bookings',
    render: () => <Tab.Pane><Booking /></Tab.Pane>
  }
]

function FarmComponent({ farmData, account }) {
  
  return (
    <Grid stackable columns={2} style={{ margin: '1em 1em 1em 1em' }}>
      <Grid.Row>
        <Grid.Column width={16}>
          <FarmHeader farm={farmData} />
        </Grid.Column>
      </Grid.Row>
      <Divider />
      <Grid.Row>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

FarmComponent.propTypes = {
  farmData: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    farmData: state.farm,
    account: state.wallet,
  }
}

export default connect(mapStateToProps)(FarmComponent)

