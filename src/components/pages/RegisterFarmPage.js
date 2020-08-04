import React from 'react'
import {
  Grid,
  Header,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

import { RegisterFarm } from '../forms'
import { addFarm } from '../../actions'

function RegisterFarmPage({ addFarm }) {
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
          <RegisterFarm addFarm={addFarm} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default connect(null, { addFarm })(RegisterFarmPage)

