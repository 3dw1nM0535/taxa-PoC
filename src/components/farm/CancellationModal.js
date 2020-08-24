import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

function CancellationModal({loaded, cancellationModalVisibility, setCancellationModalVisibility}) {

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [cancellationVolume, setCancellationVolume] = useState(0)
  const [error, setError] = useState({})

  function validate(vol) {
    const errors = {}
    if (vol === 0) errors.cancellationVolume = 'Cancellation volume cannot be 0'
    if ((vol - Math.floor(vol)) !== 0) errors.cancellationVolume = 'No point values'
    return errors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate(cancellationVolume)
    setError(error)
    if (Object.keys(error).length === 0) {
      console.log(cancellationVolume)
    }
  }

  return (
    <Modal
      open={cancellationModalVisibility}
      size='tiny'
      onClose={() => setCancellationModalVisibility(false)}
    >
      <Modal.Header>Cancellation Request</Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={loaded ? handleSubmit : null}
        >
          <Form.Field
            id='form-control-input-cancellationVolume'
            control={Input}
            label='How much of your booking do you wish to cancel?'
            value={cancellationVolume}
            type='number'
            onChange={(e, { value }) => setCancellationVolume(value)}
            error={error.cancellationVolume ? { content: `${error.cancellationVolume}`, pointing: 'above' } : false}
          />
          <Form.Button content='Confirm Cancellation' color='violet' type='submit' loading={buttonDisabled} disabled={buttonDisabled} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          onClick={() => setCancellationModalVisibility(false)}
        >
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

CancellationModal.propTypes = {
  loaded: PropTypes.bool.isRequired,
  cancellationModalVisibility: PropTypes.bool.isRequired,
  setCancellationModalVisibility: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(CancellationModal)

