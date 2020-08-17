import React, { useState } from 'react'
import { Message, Icon } from 'semantic-ui-react'

export function ConfirmedTx() {

  const [visible, setVisible] = useState(true)

  return (
    <>
      {visible && <Message
        icon
        positive
        onDismiss={() => setVisible(false)}
        floating
      >
        <Icon name='checkmark' color='green' />
        <Message.Content>
          <Message.Header>Transaction Confirmed!</Message.Header>
          Your transaction is confirmed.
        </Message.Content>
      </Message>}
    </>
  )
}

