import PropTypes from 'prop-types'
import React from 'react'
import { Card, Image, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'

function FarmCard({ farm, loaded, netId }) {

  return (
    <Card
      as='a'
      href={loaded && netId === 4 ? `/farm/${farm.id}/` : null}
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

FarmCard.propTypes = {
  netId: PropTypes.number.isRequired,
  loaded: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    netId: state.network.netId,
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(FarmCard)

