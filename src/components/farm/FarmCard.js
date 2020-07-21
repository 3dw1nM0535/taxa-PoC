import React from 'react'
import { ClickableTile } from 'carbon-components-react'

export function FarmCard({ farm }) {
  return (
    <ClickableTile
      className="spacing"
      href="#"
      light={false}
    >
      <div className="img--container">
        <img src="https://swarm-gateways.net/bzz:/e2f2f74a6d15829b7cda29d46a5ee6b308382e66ab02856202e2f6c2ade35da7/african_farmer.jpg" alt="farm" width="200" height="200" />
      </div>
      <div className="caption">
        <p># {farm.id}</p>
        <p>{farm.size}</p>
      </div>
      <hr />
      <div className="caption">
        <p>{farm.soil}</p>
        <p>location</p>
      </div>
    </ClickableTile>
  )
}
