import React from 'react'
import { Message, Icon } from 'semantic-ui-react'

export function ConfirmingTx() {
  return (
    <Message icon floating>
      <Icon name='circle notched' loading />
      <Message.Content>
        <Message.Header>Confirming transaction ...</Message.Header>
        Your transaction is being processed
      </Message.Content>
    </Message>
  )
}

