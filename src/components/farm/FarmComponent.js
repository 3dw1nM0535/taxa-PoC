import React from 'react'
import { Grid, Row, Column, Tag } from 'carbon-components-react'

export function FarmComponent() {
  return (
    <Grid>
      <Row>
        <Column className="container">
          <div className="status--tag">
            <Tag
              type="green"
            >
              Harvest
            </Tag>
          </div>
          <div className="farm__img--container">
            <img src="https://swarm-gateways.net/bzz:/e2f2f74a6d15829b7cda29d46a5ee6b308382e66ab02856202e2f6c2ade35da7/african_farmer.jpg" alt="farm" width="300" height="300" />
          </div>
        </Column>
      </Row>
      <Row>
        <Column className="details--container">
          <div className="details--header">
            <div>
              <p className="token"># 4930</p>
              <p>Location</p>
            </div>
            <div>
              <p className="owner">Owner</p>
              <img src="" alt="owner" />
            </div>
          </div>
        </Column>
      </Row>
    </Grid>
  )
}
