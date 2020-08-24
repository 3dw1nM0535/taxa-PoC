import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

function ConfirmationModal({loaded, confirmationModalVisibility, setConfirmationModalVisibility}) {

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [confirmationVolume, setConfirmationVolume] = useState(0)
  const [error, setError] = useState({})

  function validate(confirmationVolume) {
    const errors = {}
    if (confirmationVolume === 0) errors.confirmationVolume = 'Confirmation volume cannot be 0'
    if ((confirmationVolume - Math.floor(confirmationVolume)) !== 0) errors.confirmationVolume = 'No point values'
    return errors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate(confirmationVolume)
    setError(error)
    if (Object.keys(error).length === 0) {
      console.log(confirmationVolume)
    }
  }

  return (
    <Modal
      open={confirmationModalVisibility}
      size='tiny'
      onClose={() => setConfirmationModalVisibility(false)}
    >
      <Modal.Header>Confirm Receivership</Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={loaded ? handleSubmit : null}
        >
          <Form.Field
            id='form-control-input-confirmationVolume'
            control={Input}
            label='How much volume are you confirming received?'
            value={confirmationVolume}
            type='number'
            onChange={(e, { value }) => setConfirmationVolume(value)}
            error={error.confirmationVolume ? { content: `${error.confirmationVolume}`, pointing: 'above' } : false}
          />
          <Form.Button content='Confirm Received' control={Button} type='submit' color='violet' loading={buttonDisabled} disabled={buttonDisabled} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          onClick={() => setConfirmationModalVisibility(false)}
        >
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ConfirmationModal.propTypes = {
  farm: PropTypes.object.isRequired,
  confirmationModalVisibility: PropTypes.bool.isRequired,
  setConfirmationModalVisibility: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    farm: state.farm,
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(ConfirmationModal)

