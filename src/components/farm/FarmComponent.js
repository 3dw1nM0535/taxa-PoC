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
  Table,
  Tab,
} from 'semantic-ui-react'
import { truncateAddress } from '../../utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import GoogleMapReact from 'google-map-react'
import { LocationPin } from './Location'

import { Harvest, Booking } from '../farm'

const panes = [
  {
    menuItem: 'Harvests',
    render: () => <Tab.Pane><Harvest /></Tab.Pane>
  },
  {
    menuItem: 'Bookings',
    render: () => <Tab.Pane><Booking /></Tab.Pane>
  }
]

export function FarmComponent({ farmData, account }) {
  
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
            <Segment>
              <Image src={farmData.imageHash === undefined ?
                'https://react.semantic-ui.com/images/wireframe/square-image.png' : `https://ipfs.io/ipfs/${farmData.imageHash}`} fluid />
            </Segment>
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
            <Segment secondary>
              <Header as='h1'>{farmData.name}</Header>
            </Segment>
            <Segment>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={2}>
                      Owner
                    </Table.Cell>
                    <Table.Cell>
                      <Image style={{ width: 30, height: 30 }} src={makeBlockie(String(farmData.owner))} size="tiny" circular avatar />
                      <Popup
                        trigger={
                          <Label
                            as='a'
                            target='blank'
                            color='grey'
                            href={`https://etherscan.io/address/${farmData.owner}`}
                          >
                            {farmData.owner === undefined ? null : truncateAddress(farmData.owner, 25)}
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
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Size</Table.Cell>
                    <Table.Cell>{farmData.size}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Soil</Table.Cell>
                    <Table.Cell>{farmData.soil}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Location</Table.Cell>
                    <Table.Cell>{farmData.location !== undefined ? farmData.location.formatted_address : <span style={{ fontStyle: 'italic' }}>null</span>}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>#tokenId</Table.Cell>
                    <Table.Cell>{farmData.token}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>State</Table.Cell>
                    <Table.Cell>
                      <Label
                        content={farmData.season}
                        color={farmData.season === 'Dormant' ? 'brown' : farmData.season === 'Harvest' ? 'green' : null}
                        horizontal
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Segment.Group>
            <Segment secondary>
              <Header as='h1'>Location</Header>
            </Segment>
            <Segment style={{ height: '70vh', width: '100%' }}>
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
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column widths={16}>
          <Tab
            panes={panes}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

FarmComponent.propTypes = {
  farmData: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    farmData: state.farm,
    account: state.wallet,
  }
}

export default connect(mapStateToProps)(FarmComponent)

