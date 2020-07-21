import React from 'react'
import { Grid, Row, Column } from 'carbon-components-react'
import { gql, useQuery } from '@apollo/client'

import { FarmCard } from '../farm'

export function Farms() {

  const GET_FARMS = gql`
    query GetFarms {
      getFarms {
        id
        size
        soil
        imageHash
      }
    }
  `
  const { loading, data, error } = useQuery(GET_FARMS)

  if (loading) return (<p>Loading...</p>)
  if (error) return (<p>Error: {error.message}</p>)

  return (
    <Grid>
      <Row>
        {data.getFarms.length > 0 ? data.getFarms.map(farm => (
          <Column key={farm.id} className="farm--card" lg={16}>
            <FarmCard farm={farm} />
          </Column>
        )) : (
          <Column className="info--section">
            <h1>No farms to be found</h1>
          </Column>
        )}
      </Row>
    </Grid>
  )
}
