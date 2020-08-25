import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import Farm from '../../build/Farm.json'
import { initContract } from '../../utils'
import api from '../../api'

function ConfirmationModal({loaded, bookingId, netId, wallet, farm, confirmationModalVisibility, setConfirmationModalVisibility}) {

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [confirmationVolume, setConfirmationVolume] = useState(0)
  const [error, setError] = useState({})
  const [txConfirming, setTxConfirming] = useState(false)
  const [txHash, setTxHash] = useState("")

  function validate(confirmationVolume) {
    const errors = {}
    if (confirmationVolume === 0) errors.confirmationVolume = 'Confirmation volume cannot be 0'
    if ((confirmationVolume - Math.floor(confirmationVolume)) !== 0) errors.confirmationVolume = 'No point values'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validate(confirmationVolume)
    setError(error)
    if (Object.keys(error).length === 0) {
      try {
        setButtonDisabled(true)
        const farmContract = initContract(Farm, netId)
        const farmer = farm.owner
        const tokenId = farm.token
        await farmContract.methods.confirmReceived(tokenId, confirmationVolume, farmer).send({from: wallet.address[0]})
          .on('transactionHash', hash => {
            setTxConfirming(true)
            setTxHash(hash)
          })
          .on('confirmation', async(confirmationNumber, receipt) => {
            if (confirmationNumber === 1) {
              setButtonDisabled(false)
              setTxConfirming(false)
              const {_volume, _deposit, _delivered} = receipt.events.Received.returnValues
              await api.farm.updateAfterReceivership(bookingId, _volume, _deposit, _delivered)
            }
          })
      } catch(error) {
        console.log(error)
      }
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
          {txConfirming && <a
            style={{
              marginLeft: '0.5em',
              color: '#7f00ff',
              textDecoration: 'underline'
            }}
            href={`${process.env.REACT_APP_ROPSTEN_TESTNET_URL}/${txHash}`}
            target='blank'
          >
            view transaction status
          </a>}
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
  bookingId: PropTypes.string.isRequired,
  netId: PropTypes.number.isRequired,
  wallet: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    farm: state.farm,
    loaded: state.wallet.loaded,
    netId: state.network.netId,
    wallet: state.wallet,
  }
}

export default connect(mapStateToProps)(ConfirmationModal)

