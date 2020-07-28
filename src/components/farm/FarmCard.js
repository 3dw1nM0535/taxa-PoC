import React from 'react'
import { Card, Image, Label } from 'semantic-ui-react'

export function FarmCard({ farm }) {
  return (
    <Card as='a' fluid>
      <Image
        src={`https://swarm-gateways.net/bzz:/${farm.imageHash}/nduma.jpeg`}
        style={{ height: '200px' }}
      />
      <Card.Content>
        <Card.Header># {farm.id}</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Label
          content={farm.season}
          color={farm.season === 'Dormant' ? 'brown' : farm.season === 'Harvest' ? 'green' : ''}
          horizontal
        />
      </Card.Content>
    </Card>
  )
}
