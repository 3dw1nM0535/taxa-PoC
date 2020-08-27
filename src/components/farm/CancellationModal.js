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

function CancellationModal({loaded, farm, wallet, netId, cancellationModalVisibility, setCancellationModalVisibility, bookingId}) {

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [cancellationVolume, setCancellationVolume] = useState(0)
  const [error, setError] = useState({})
  const [txConfirming, setTxConfirming] = useState(false)
  const [txHash, setTxHash] = useState("")

  function validate(vol) {
    const errors = {}
    if (vol === 0) errors.cancellationVolume = 'Cancellation volume cannot be 0'
    if ((vol - Math.floor(vol)) !== 0) errors.cancellationVolume = 'No point values'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validate(cancellationVolume)
    setError(error)
    if (Object.keys(error).length === 0) {
      try {
        setButtonDisabled(true)
        const farmContract = initContract(Farm, netId)
        const tokenId = Number(farm.token)
        const booker = wallet.address[0]
        const farmOwner = farm.owner
        const currentSeasonNumber = +farm.presentSeason
        await farmContract.methods.cancelBook(tokenId, booker, farmOwner, cancellationVolume, currentSeasonNumber).send({from: wallet.address[0]})
          .on('transactionHash', hash => {
            setTxConfirming(true)
            setTxHash(hash)
          })
          .on('confirmation', async(confirmationNumber, receipt) => {
            if (confirmationNumber === 1) {
              setButtonDisabled(false)
              setTxConfirming(false)
              window.alert('Cancellation was a success!')
              const {_booker, _deposit } = receipt.events.CancelBook.returnValues
              const _supply = await farmContract.methods._harvests(tokenId).call()
              const _bookerVolume = await farmContract.methods._bookers(_booker).call()
              await api.farm.updateAfterCancellation(bookingId, farm.presentSeason, tokenId, _supply.supply, _bookerVolume, _deposit)
              const _noOfBookers = await farmContract.methods.seasonBookers(currentSeasonNumber, tokenId).call()
              await api.farm.updateHarvestBookers(tokenId, currentSeasonNumber, _noOfBookers)
              const _delivered = await farmContract.methods._bookStatus(wallet.address[0]).call()
              await api.farm.updateBookingStatus(bookingId, _delivered)
            }
          })
          .on('error', error => {
            setButtonDisabled(false)
            console.log(error)
          })
      } catch(error) {
        console.log(error)
      }
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
  wallet: PropTypes.object.isRequired,
  netId: PropTypes.number.isRequired,
  farm: PropTypes.object.isRequired,
  bookingId: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
    wallet: state.wallet,
    netId: state.network.netId,
    farm: state.farm,
  }
}

export default connect(mapStateToProps)(CancellationModal)

