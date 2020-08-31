import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useState } from 'react'
import {
  Modal,
  Input,
  Form,
  Button,
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import Farm from '../../build/Farm.json'
import api from '../../api'
import { initContract } from '../../utils'

function BookingModal({wallet, loaded, farm, netId, tokenId, currentSeason, harvestPrice, bookingModalVisibility, setBookingModalVisibility}) {

  const [bookingVolume, setBookingVolume] = useState(0)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [error, setError] = useState({})
  const [transactionHash, setTransactionHash] = useState("")
  const [confirmingTx, setConfirmingTx] = useState(false)

  function validate(volume) {
    const errors = {}
    if (volume === 0) errors.bookingVolume = 'Booking volume cannot be 0'
    if ((volume - Math.floor(volume)) !== 0) errors.bookingVolume = 'No point values'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validate(bookingVolume)
    setError(error)
    if (Object.keys(error).length === 0) {
      try {
        setButtonDisabled(true)
        const farmContract = initContract(Farm, netId)
        await farmContract.methods.bookHarvest(tokenId, bookingVolume, currentSeason).send({
          from: wallet.address[0],
          value: new Web3.utils.BN(harvestPrice).mul(new Web3.utils.BN(bookingVolume)).toString()
        })
          .on('transactionHash', hash => {
            setTransactionHash(hash)
            setConfirmingTx(true)
          })
          .on('confirmation', async(confirmationNumber, receipt) => {
            if (confirmationNumber === 1) {
              setButtonDisabled(false)
              setConfirmingTx(false)
              const {_volume, _supply, _tokenId, _booker, _deposit, _delivered} = receipt.events.Booking.returnValues
              const _bookerLowerCased = String(_booker).toLowerCase()
              await api.farm.addBooking(_tokenId, _volume, _bookerLowerCased, _deposit, _delivered)
              await api.farm.updateFarmHarvestSupply(currentSeason, _tokenId, _supply)
              const _noOfBookers = await farmContract.methods.seasonBookers(currentSeason, _tokenId).call()
              await api.farm.updateHarvestBookers(_tokenId, currentSeason, _noOfBookers)
            }
          })
          .on('error', error => {
            setButtonDisabled(false)
            window.alert(`Error ${error.message}`)
          })
      } catch(error) {
        console.log(error)
      }
    }
  }

  return (
    <Modal
      size='tiny'
      open={farm.season === 'Harvesting' && bookingModalVisibility}
      onClose={() => setBookingModalVisibility(false)}
    >
      <Modal.Header>
        Booking Harvest
      </Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={loaded ? handleSubmit : null}
        >
          <Form.Field
            id='form-control-input-booking-volume'
            label='What amount of this harvest are you booking?'
            control={Input}
            value={bookingVolume}
            onChange={(e, { value }) => setBookingVolume(value)}
            type='number'
            error={error.bookingVolume ? { content: `${error.bookingVolume}`, pointing: 'above' } : false}
          />
          <Form.Button disabled={buttonDisabled} loading={buttonDisabled} control={Button} type='submit' color='violet' content='Book Harvest' />
          {confirmingTx && <a
            style={{
              marginLeft: '0.5em',
              color: '#7f00ff',
              textDecoration: 'underline'
            }}
            href={`${process.env.REACT_APP_RINKEBY_TESTNET_URL}/${transactionHash}`}
            target='blank'
          >
            view transaction status
          </a>}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          onClick={() => setBookingModalVisibility(false)}
        >
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

BookingModal.propTypes = {
  farm: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  netId: PropTypes.number.isRequired,
  currentSeason: PropTypes.number.isRequired,
  wallet: PropTypes.object.isRequired,
  harvestPrice: PropTypes.string.isRequired,
  tokenId: PropTypes.number.isRequired,
}

function mapStateToProps(state) {
  return {
    farm: state.farm,
    loaded: state.wallet.loaded,
    netId: state.network.netId,
    currentSeason: Number(state.farm.presentSeason),
    wallet: state.wallet,
    tokenId: Number(state.farm.token),
  }
}

export default connect(mapStateToProps)(BookingModal)

