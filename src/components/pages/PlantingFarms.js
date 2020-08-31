import React from 'react'
import { Grid } from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'

import { FarmCard, NoFarm } from '../farm'
import { LoaderComponent } from '../loading'
import { ErrorComponent } from '../error'

export function PlantingFarms() {

  const GET_PLANTING_FARMS = gql`
    query GetPlantingFarms {
      getPlantingFarms {
        id
        size
        soil
        imageHash
        owner
        season
      }
    }
  `

  const { loading, error, data } = useQuery(GET_PLANTING_FARMS)

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
      {data.getPlantingFarms.length > 0 ? data.getPlantingFarms.map(farm => (
        <Grid.Column key={farm.id}>
          <FarmCard farm={farm} />
        </Grid.Column>
      )) : (
        <>
          <NoFarm text="No farm(s) in planting season" />
        </>
      )}
    </Grid>
  )
}
