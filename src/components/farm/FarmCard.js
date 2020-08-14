import React from 'react'
import { Card, Image, Label } from 'semantic-ui-react'

export function FarmCard({ farm }) {
  return (
    <Card
      as='a'
      href={`/farm/${farm.id}/`}
      fluid
    >
      <Image
        src={`https://ipfs.io/ipfs/${farm.imageHash}`}
        style={{ height: '200px' }}
      />
      <Card.Content>
        <Card.Header># {farm.id}</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Label
          content={farm.season}
          color={farm.season === 'Dormant' ? 'grey'
            : farm.season === 'Preparation' ? 'blue'
            : farm.season === 'Planting' ? 'brown'
            : farm.season === 'Crop Growth' ? 'red'
            : farm.season === 'Harvesting' ? 'green'
            : null}
          size='tiny'
          horizontal
        />
      </Card.Content>
    </Card>
  )
}
