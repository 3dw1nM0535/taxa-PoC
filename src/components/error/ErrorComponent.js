import React from 'react'
import { Grid, Message } from 'semantic-ui-react'

export function ErrorComponent({ error }) {
  return (
    <Grid stackable columns={1} style={{ margin: '1em 1em 1em 1em' }}>
      <Grid.Column width={16}>
        <Message negative>
          <Message.Header>Encountered error</Message.Header>
          <p>{error.message}</p>
        </Message>
      </Grid.Column>
    </Grid>
  )
}
