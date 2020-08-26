import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useState } from 'react'
import makeBlockie from 'ethereum-blockies-base64'
import {
  Button,
  Segment,
  Icon,
  Table,
  Header,
  Image,
} from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'

import { LoaderComponent } from '../loading'
import { ErrorComponent } from '../error'
import { connect } from 'react-redux'
import ConfirmationModal from './ConfirmationModal'
import CancellationModal from './CancellationModal'

function Booking({ farm, conversionRate, wallet, loaded }) {

  const [confirmationModalVisibility, setConfirmationModalVisibility] = useState(false)
  const [cancellationModalVisibility, setCancellationModalVisibility] = useState(false)

  function handleConfirmation() {
    setConfirmationModalVisibility(true)
  }

  function handleCancellation() {
    setCancellationModalVisibility(true)
  }

  const GET_BOOKINGS = gql`
    query GetBookings(
      $token: Int!
      $bookerAddress: String!
    ) {
      getBookings(input: {
        token: $token
        bookerAddress: $bookerAddress
      }) {
        id
        volume
        booker
        deposit
        token
        delivered
      }
    }
  `

  const { loading, data, error } = useQuery(GET_BOOKINGS, {
    variables: {
      token: `${farm.token !== undefined ? +farm.token : 0}`,
      bookerAddress: loaded ? `${String(wallet.address[0]).toLowerCase()}` : `${String(0x00000000000000000000000E0000000000000000)}`,
    }
  })
  
  if (loading) return (
    <>
      <LoaderComponent loading />
    </>
  )

  if (error) return (
    <>
      <ErrorComponent error={error} />
    </>
  )

  return (
    <>
      {data.getBookings.length === 0 ? (
        <Segment placeholder>
          <Header icon>
            <Icon name='frown' size='large' />
            No booking data found for this farm
          </Header>
        </Segment>
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Booker</Table.HeaderCell>
              <Table.HeaderCell>Volume</Table.HeaderCell>
              <Table.HeaderCell>Deposit</Table.HeaderCell>
              <Table.HeaderCell>Receivership</Table.HeaderCell>
              <Table.HeaderCell>Cancellation</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.getBookings.map(booking => (
              <Table.Row key={booking.id}>
                <Table.Cell>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                    }}
                    src={makeBlockie(String(booking.booker))}
                    size='tiny'
                    circular
                  />
                </Table.Cell>
                <Table.Cell>{booking.volume}</Table.Cell>
                <Table.Cell>
                  {`${Web3.utils.fromWei(booking.deposit)} ETH / KES ${new Intl.NumberFormat('en-US').format(parseInt(parseFloat(Web3.utils.fromWei(booking.deposit)) * parseFloat(conversionRate.ethkes)), 10)}`}
                </Table.Cell>
                <Table.Cell>
                  <ConfirmationModal bookingId={booking.id} confirmationModalVisibility={confirmationModalVisibility} setConfirmationModalVisibility={setConfirmationModalVisibility} />
                  <CancellationModal bookingId={booking.id} cancellationModalVisibility={cancellationModalVisibility} setCancellationModalVisibility={setCancellationModalVisibility} />
                  <Button
                    size='mini'
                    color='violet'
                    disabled={booking.volume === 0}
                    onClick={() => handleConfirmation()}
                  >
                    Confirm Received
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size='mini'
                    color='violet'
                    onClick={() => handleCancellation()}
                    disabled={booking.volume === 0}
                  >
                   Cancel 
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  )
}

Booking.propTypes = {
  farm: PropTypes.object.isRequired,
  conversionRate: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    farm: state.farm,
    conversionRate: state.prices,
    wallet: state.wallet,
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(Booking)

