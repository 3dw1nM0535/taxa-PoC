import React from 'react'
import {
  Menu,
  Container,
  Icon,
  Label,
  Button
} from 'semantic-ui-react'

export function TopNav() {
  return (
    <Menu pointing secondary>
      <Container>
        <Menu.Item
          as='a'
          header
        >
          Octopus
          <Label color='brown' horizontal>
            Beta
          </Label>
        </Menu.Item>
        <Menu.Item
          name='Get Started'
          as='a'
          onClick={() => {}}
        />
        <Menu.Item
          name='Farms'
          as='a'
          onClick={() => {}}
        />
        <Menu.Item
          position='right'
        >
          <Button as='a'>
            <Icon name='plug' />
            Connect Wallet
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  )
}
