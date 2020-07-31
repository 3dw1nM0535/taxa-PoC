import PropTypes from 'prop-types'
import React from 'react'
import {
  Container,
  Header,
  Button,
  Icon,
  Segment,
} from 'semantic-ui-react'

const HomepageHeading = () => (
  <Container text>
    <Header
      as='h2'
      content='We are changing 105,000years old agricultural practices and harvest trading using decentralized protocols.'
      inverted
      style={{
        fontSize: '2.5em',
        fontWeight: 'normal',
        marginBottom: '0.75em',
        marginTop: '2em',
      }}
    />
    <Button primary size='huge'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

export function HomePage() {
  return (
    <Segment vertical inverted textAlign='center'>
      <HomepageHeading />
    </Segment>
  )
}

