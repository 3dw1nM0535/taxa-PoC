import React from 'react';
import { Grid, Row, Column } from 'carbon-components-react';
import { connect } from 'react-redux'
import { addFarm } from '../../actions'

import { RegisterFarm } from '../forms';


function RegisterFarmPage({ addFarm }) {
  return (
    <Grid>
      <Row>
        <Column className="description--section">
          <h1>Register your farm to the blockchain</h1>
        </Column>
        <Column>
          <RegisterFarm submit={addFarm} />
        </Column>
      </Row>
    </Grid>
  )
}

export default connect(null, { addFarm })(RegisterFarmPage);

