import React from 'react'
import { Grid, Row, Column } from 'carbon-components-react'

import { FarmCard } from '../farm'

export function Farms() {
  return (
    <Grid>
      <Row>
        <Column className="farm--card" lg={2}>
          <FarmCard />
          <div className="caption">
            <p className="token--caption"># token</p>
            <p className="size--caption">size</p>
          </div>
          <div>
            <p>location</p>
          </div>
        </Column>
      </Row>
    </Grid>
  )
}
