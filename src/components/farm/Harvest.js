import React from 'react'
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

export function Harvest() {

  const GET_SEASONS = gql`
    query GetSeasons {
      getSeasons {
        id
        token
        crop
        fertilizer
        seed
        seedSupplier
        expectedYield
        harvestYield
        harvestPrice
      }
    }
  `

  const { loading, data, error } = useQuery(GET_SEASONS)
  
  if (loading) return (
    <>
      <LoaderComponent loading />
    </>
  )

  if (error) return (
    <>
      <ErrorComponent error />
    </>
  )

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
              <Table.HeaderCell>Booking</Table.HeaderCell>
              <Table.HeaderCell>Cancel Booking</Table.HeaderCell>
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
                <Table.Cell>{season.harvestYield}</Table.Cell>
                <Table.Cell>{season.harvestPrice}</Table.Cell>
                <Table.Cell>
                  <Button size='mini' color='violet'>Book</Button>
                </Table.Cell>
                <Table.Cell>
                  <Button size='mini' color='red'>Cancel Book</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  )
}

