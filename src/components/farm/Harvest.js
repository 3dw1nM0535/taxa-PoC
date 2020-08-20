import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useState } from 'react'
import {
  Button,
  Segment,
  Icon,
  Table,
  Header,
} from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'

import { LoaderComponent } from '../loading'
import { ErrorComponent } from '../error'
import { connect } from 'react-redux'
import BookingModal from './BookingModal'

function Harvest({ farm, conversionRate }) {

  const [bookingModalVisibility, setBookingModalVisibility] = useState(false)

  const GET_SEASONS = gql`
    query GetSeasons(
      $token: Int!
    ) {
      getSeasons(input: {
        token: $token
      }) {
        id
        token
        crop
        fertilizer
        seed
        seedSupplier
        expectedYield
        harvestYield
        harvestUnit
        harvestPrice
      }
    }
  `

  const { loading, data, error } = useQuery(GET_SEASONS, {
    variables: {
      token: `${farm.token !== undefined ? +farm.token : 0}`,
      seasonNumber: `${farm.presentSeason !== undefined ? +farm.presentSeason : 0}`,
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

  function handleBooking() {
    setBookingModalVisibility(true)
  }

  return (
    <>
      {data.getSeasons.length === 0 ? (
        <Segment placeholder>
          <Header icon>
            <Icon name='frown' size='large' />
            No season data found for this farm
          </Header>
        </Segment>
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Crop</Table.HeaderCell>
              <Table.HeaderCell>Seed Used</Table.HeaderCell>
              <Table.HeaderCell>Seed Supplier</Table.HeaderCell>
              <Table.HeaderCell>Expected Yield</Table.HeaderCell>
              <Table.HeaderCell>Fertilizer Used</Table.HeaderCell>
              <Table.HeaderCell>Harvest Supply</Table.HeaderCell>
              <Table.HeaderCell>Harvest Price</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.getSeasons.map(season => (
              <Table.Row key={season.id}>
                <Table.Cell>{season.crop}</Table.Cell>
                <Table.Cell>{season.seed}</Table.Cell>
                <Table.Cell>{season.seedSupplier}</Table.Cell>
                <Table.Cell>{season.expectedYield}</Table.Cell>
                <Table.Cell>{season.fertilizer}</Table.Cell>
                <Table.Cell>{`${season.harvestYield}${season.harvestUnit}`}</Table.Cell>
                <Table.Cell>
                  {`${Web3.utils.fromWei(season.harvestPrice)} ETH / KES ${new Intl.NumberFormat('en-US').format(parseInt(parseFloat(Web3.utils.fromWei(season.harvestPrice)) * parseFloat(conversionRate.ethkes)), 10)}`}
                </Table.Cell>
                <Table.Cell>
                  <BookingModal bookingModalVisibility={bookingModalVisibility} setBookingModalVisibility={setBookingModalVisibility} harvestPrice={season.harvestPrice} />
                  <Button
                    size='mini'
                    color='violet'
                    onClick={() => handleBooking()}
                    disabled={season.harvestYield === 0}
                  >
                    Book
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

Harvest.propTypes = {
  farm: PropTypes.object.isRequired,
  conversionRate: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    farm: state.farm,
    conversionRate: state.prices,
  }
}

export default connect(mapStateToProps)(Harvest)

