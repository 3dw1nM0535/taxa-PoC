import axios from 'axios'
import { gql } from '@apollo/client'
import { print } from 'graphql'

const ADD_FARM = gql`
  mutation AddFarm($id: ID!, $size: String!, $soil: String!, $imageHash: String!) {
      addFarm(input: {
        id: $id
        size: $size
        soil: $soil
        imageHash: $imageHash
      }) {
        id
        size
        soil
        imageHash
      }
    }
  `


export default {
  wallet: {
    addFarm: (_tokenId, _farmSize, _soilType, _fileHash) => axios.post(`${process.env.REACT_APP_GRAPHQL_API}`, {
      query: print(ADD_FARM),
      variables: {
        id: String(_tokenId),
        size: String(_farmSize),
        soil: String(_soilType),
        imageHash: String(_fileHash),
      }
    })
    .then(res => console.log(res)),
  },
}
