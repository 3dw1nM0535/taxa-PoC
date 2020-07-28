import React from 'react'
import { Grid, Segment, Header, Icon, Button } from 'semantic-ui-react'

export function NoFarm() {
  return (
    <Grid.Column width={16}>
      <Segment placeholder>
        <Header icon>
          <Icon name='frown' />
          No farm(s) added yet
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

