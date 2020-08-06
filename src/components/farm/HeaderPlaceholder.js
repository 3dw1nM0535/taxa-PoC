import React from 'react'
import { Placeholder, Card } from 'semantic-ui-react'

function HeaderPlaceholder() {
  return (
    <Placeholder>
      <Placeholder.Header image>
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Header>
    </Placeholder>
  )
}

function LabelPlaceholder() {
  return (
    <Placeholder>
      <Placeholder.Line length='very short' />
    </Placeholder>
  )
}

function ImagePlaceholder() {
  return (
    <Card>
      <Card.Content>
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
      </Card.Content>
    </Card>
  )
}

export {
  HeaderPlaceholder,
  LabelPlaceholder,
  ImagePlaceholder,
}


