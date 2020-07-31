import React from 'react'
import { Grid, Message, } from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'

import { FarmCard, NoFarm } from '../farm' 
import { LoaderComponent } from '../loading'

export function FarmsPage() {

  const GET_FARMS = gql`
    query GetFarms {
      getFarms {
        id
        size
        soil
        imageHash
        season
      }
    }
  `

  const { loading, data, error } = useQuery(GET_FARMS)

  if (loading) return (
    <>
      <LoaderComponent loading />
    </>
  )

  if (error) return (
    <Grid stackable columns={1} style={{ margin: '1em 1em 1em 1em' }}>
      <Grid.Column width={16}>
        <Message negative><Message.Header>Encountered error</Message.Header><p>{error.message}</p></Message>
      </Grid.Column>
    </Grid>
  )

  return (
    <Grid stackable columns={4} style={{ margin: '1em 1em 1em 1em' }}>
      {data.getFarms.length > 0 ? data.getFarms.map(farm => (
        <Grid.Column key={farm.id}>
          <FarmCard farm={farm}/>
        </Grid.Column>
      )) : (
        <>
          <NoFarm />
        </>
      )}
    </Grid>
  )
}
