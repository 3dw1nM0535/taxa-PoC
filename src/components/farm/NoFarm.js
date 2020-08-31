import React from 'react'
import { Grid, Segment, Header, Icon, Button } from 'semantic-ui-react'

export function NoFarm({ text }) {
  return (
    <Grid.Column width={16}>
      <Segment placeholder>
        <Header icon>
          <Icon name='frown' />
          {text}
        </Header>
        <Button
          as='a'
          primary
          size='big'
          href='/tokenize/'
        >
          <Icon name='plus square' />
          Add farm
        </Button>
      </Segment>
    </Grid.Column>
  )
}

