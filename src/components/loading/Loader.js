import React from 'react'
import { Grid, Loader } from 'semantic-ui-react'

export function LoaderComponent({ loading }) {
  return (
    <Grid stackable columns={1} style={{ margin: '1em 1em 1em 1em' }}>
      <Grid.Column width={16}>
        <Loader active={loading} inline='centered' size='massive' />
      </Grid.Column>
    </Grid>
  )
}

