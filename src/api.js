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
  }
}

