import React from 'react'
import { Grid } from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'

import { FarmCard, NoFarm } from '../farm'
import { LoaderComponent } from '../loading'
import { ErrorComponent } from '../error'

export function HarvestingFarms() {

  const GET_HARVESTING_FARMS = gql`
    query GetHarvestingFarms {
      getHarvestingFarms {
        id
        size
        soil
        imageHash
        owner
        season
      }
    }
  `

  const { loading, error, data } = useQuery(GET_HARVESTING_FARMS)

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
    <Grid stackable columns={4} style={{ margin: '1em 1em 1em 1em' }}>
      {data.getHarvestingFarms.length > 0 ? data.getHarvestingFarms.map(farm => (
        <Grid.Column key={farm.id}>
          <FarmCard farm={farm} />
        </Grid.Column>
      )) : (
        <>
          <NoFarm text="No harvesting farm(s)" />
        </>
      )}
    </Grid>
  )
}
