import React from 'react'
import { Grid, Loader, Message, } from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'

import { FarmCard, NoFarm } from '../farm' 

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
    <Grid stackable columns={1} style={{ margin: '1em 1em 1em 1em' }}>
      <Grid.Column width={16}>
        <Loader active inline='centered' size='massive' />
      </Grid.Column>
    </Grid>
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
