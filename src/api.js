import axios from 'axios'
import { gql } from '@apollo/client'
import { print } from 'graphql'

const ADD_FARM = gql`
  mutation AddFarm(
    $id: ID!
    $size: String!
    $soil: String!
    $imageHash: String!
    $season: String!
    $owner: String!
  ) {
    addFarm(input: {
      id: $id
      size: $size
      soil: $soil
      imageHash: $imageHash
      season: $season
      owner: $owner
    }) {
      id
    }
  }
`

const UPDATE_SEASON = gql`
  mutation UpdateFarmSeason(
    $token: Int!
    $season: String!
  ) {
    updateFarmSeason(input: {
      token: $token
      season: $season
    }) {
     updatedAt 
    }
  }
`

const UPDATE_PLANTINGS = gql`
  mutation UpdateFarmPlantings(
    $seedUsed: String!
    $expectedYield: String!
    $seasonNumber: Int!
    $token: Int!
    $seedSupplier: String!
  ) {
    updateFarmPlantings(input: {
      seedUsed: $seedUsed
      expectedYield: $expectedYield
      seasonNumber: $seasonNumber
      token: $token
      seedSupplier: $seedSupplier
    }) {
      token
    }
  }
`

const UPDATE_PREPARATIONS = gql`
  mutation UpdateFarmPreparations(
    $token: Int!
    $seasonNumber: Int!
    $crop: String!
    $fertilizer: String!
  ) {
    updateFarmPreparations(input: {
      token: $token
      seasonNumber: $seasonNumber
      crop: $crop
      fertilizer: $fertilizer
    }) {
      updatedAt
    }
  }
`

export default {
  wallet: {
    addFarm: (_tokenId, _size, _soilType, _owner, _fileHash, _season) => axios.post(`${process.env.REACT_APP_GRAPHQL_API}`, {
      query: print(ADD_FARM),
      variables: {
        id: String(_tokenId),
        size: String(_size),
        soil: String(_soilType),
        imageHash: String(_fileHash),
        season: String(_season),
        owner: String(_owner),
      }
    })
    .then(res => console.log('Success'))
  },
  farm: {
    updateSeason: (_token, _season) => axios.post(`${process.env.REACT_APP_GRAPHQL_API}`, {
      query: print(UPDATE_SEASON),
      variables: {
        token: Number(_token),
        season: String(_season),
      }
    })
    .then(res => console.log('Success')),
    updatePreparations: (_token, _currentSeason, _crop, _fertilizer) => axios.post(`${process.env.REACT_APP_GRAPHQL_API}`, {
      query: print(UPDATE_PREPARATIONS),
      variables: {
        token: Number(_token),
        seasonNumber: Number(_currentSeason),
        crop: String(_crop),
        fertilizer: String(_fertilizer),
      }
    })
    .then(res => console.log('Success')),
    updatePlantings: (_seedUsed, _expectedYield, _currentSeason, _tokenId, _seedSupplier) => axios.post(`${process.env.REACT_APP_GRAPHQL_API}`, {
      query: print(UPDATE_PLANTINGS),
      variables: {
        seedUsed: String(_seedUsed),
        expectedYield: String(_expectedYield),
        seasonNumber: Number(_currentSeason),
        token: Number(_tokenId),
        seedSupplier: String(_seedSupplier),
      }
    })
    .then(res => console.log('Success')),
  }
}

