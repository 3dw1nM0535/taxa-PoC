import PropTypes from 'prop-types'
import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'

export function LocationPin({ text, onClick }) {
  return (
    <>
      <Popup
        trigger={
          <Icon
            name='map marker'
            color='red'
            size='big'
          />
        }
        content={text}
        inverted
      />
    </>
  )
}

LocationPin.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

