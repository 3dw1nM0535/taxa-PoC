import PropTypes from 'prop-types'
import React, { useState } from 'react'
import makeBlockie from 'ethereum-blockies-base64'
import { connect } from 'react-redux'
import {
  Grid,
  Segment,
  Image,
  Label,
  Button,
  Header,
  Popup,
  Icon,
} from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import GoogleMapReact from 'google-map-react'
import { useParams } from 'react-router-dom'
import { LocationPin } from './Location'

export function FarmComponent({ farmData }) {
  
  const { tokenId } = useParams()
  const [copying, setCopying] = useState(true)
  const [copied, setCopied] = useState(false)

  return (
    <Grid stackable columns={2} style={{ margin: '1em 1em 1em 1em' }}>
      <Grid.Row>
        <Grid.Column>
          <Segment.Group>
            <Segment>
              <Label
                content={farmData.season}
                color={farmData.season === 'Dormant' ? 'brown' : farmData.season === 'Harvest' ? 'green' : null}
                horizontal
              />
            </Segment>
            <Segment.Group>
              <Image src={farmData.imageHash === undefined ?
                'https://react.semantic-ui.com/images/wireframe/square-image.png' : `https://ipfs.io/ipfs/${farmData.imageHash}`} fluid />
            </Segment.Group>
            <Segment>
              <Button
                color={farmData.season === 'Dormant' ? 'brown' : farmData.season === 'Harvest' ? 'green' : null}
              >
                Change Season
              </Button>
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column>
          <Segment.Group>
            <Segment>
              <Header as='h1'>Owner</Header>
            </Segment>
            <Segment>
            <Segment.Inline>
              <Image src={makeBlockie(String(farmData.owner))} size="tiny" circular avatar />
              <Popup
                trigger={
                  <Label
                    as='a'
                    target='blank'
                    color='grey'
                    href={`https://etherscan.io/address/${farmData.owner}`}
                  >
                    {farmData.owner}
                  </Label>
                }
                content='View address on etherscan'
                inverted
              />
              <span>
                <CopyToClipboard
                  text={farmData.owner}
                  onCopy={() => setTimeout(() => {
                    setCopying(false)
                    setCopied(true)

                    setTimeout(() => {
                      setCopying(true)
                      setCopied(false)
                    }, 3000)
                  }, 500)}
                >
                  <span>
                    {copied &&
                        <Label
                          as={Button}
                          horizontal color='green'
                          size='medium'
                        >
                          Copied
                        </Label>}
                    {copying &&
                        <Label
                          as={Button}
                          horizontal
                          size='medium'
                        >
                          Copy
                        </Label>}
                  </span>
                </CopyToClipboard>
              </span>
            </Segment.Inline>
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment>
              <Header as='h1'>Size</Header>
            </Segment>
            <Segment>
              <p>{farmData.size}</p>
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment>
              <Header as='h1'>Soil</Header>
            </Segment>
            <Segment>
              <p>{farmData.soil}</p>
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment>
              <Header as='h1'>Location</Header>
            </Segment>
            <Segment style={{ height: '50vh', width: '100%' }}>
              {farmData.location !== undefined ? (
              <GoogleMapReact
                bootstrapURLKeys={{ key: `${process.env.REACT_APP_GEOCODE_KEY}` }}
                defaultCenter={{
                  lat: Number(farmData.lat),
                  lng: Number(farmData.lon)
                }}
                defaultZoom={15}
              >
                <LocationPin
                  lat={farmData.lat}
                  lng={farmData.lon}
                  text={farmData.location.formatted_address}
                />
              </GoogleMapReact>
              ) : (
                setTimeout(() => {
                return (<Segment placeholder>
                  <Header icon>
                    <Icon name='frown' />
                    This farm has no location
                  </Header>
                </Segment>)
              }, 3000))} 
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment>
              <Header as='h1'># Token ID</Header>
            </Segment>
            <Segment>
              <p>{tokenId}</p>
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

FarmComponent.propTypes = {
  farmData: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    farmData: state.farm,
  }
}

export default connect(mapStateToProps)(FarmComponent)

