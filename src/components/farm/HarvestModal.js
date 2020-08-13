import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

const options = [
  { key: 'kg', text: 'kilogram', value: 'kg' },
  { key: 'g', text: 'gram', value: 'g' },
  { key: 't', text: 'tonne', value: 'tonne' }
]

function HarvestModal({loaded, farm, openHarvestModal, setOpenHarvestModal}) {

  const [supply, setSupply] = useState(0)
  const [price, setPrice] = useState("")
  const [unit, setUnit] = useState("")
  const [error, setError] = useState({})

  function validate(supply, price, unit) {
    const errors = {}
    if (supply <= 0) errors.supply = 'Supply cannot be 0'
    if (price <= 0) errors.price = 'Price cannot be 0'
    if (validate.isEmpty(unit)) errors.unit = 'Invalid unit'
    return errors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate(supply, price, unit)
    setError(error)
    if (Object.keys(error).length === 0) {
      console.log('submitting...')
    }
  }

  return (
    <Modal
      size='tiny'
      open={farm.seaon === 'Harvesting' && openHarvestModal}
    >
      <Modal.Header>Harvesting</Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={loaded ? handleSubmit : null}
        >
          <Form.Field
            id='form-control-input-supply'
            control={Input}
            label='Total harvest supply?'
            type='number'
            value={supply}
            onChange={(e, { value }) => setSupply(value)}
            error={error.supply ? { content: `${error.supply}`, pointing: 'above' } : false}
          />
          <Form.Field
            id='form-control-select-supply-unit'
            control={Select}
            options={options}
            value={unit}
            onChange={(e, { value }) => setUnit(value)}
            error={error.unit ? { content: `${error.unit}`, pointing: 'above' } : false}
          />
          <Form.Field
            id='form-control-input-price'
            control={Input}
            type='number'
            lable='Price per supply?'
            value={price}
            onChange={(e, { value }) => setPrice(value)}
            error={error.price ? { content: `${error.price}`, pointing: 'above' } : false}
          />
          <Form.Button control={Button} type='submit' color='violet' content='Confirm Harvest' />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color='violet'
          onClick={() => setOpenHarvestModal(false)}
        >
          Confirm Harvest
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

HarvestModal.propTypes = {
  farm: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  openHarvestModal: PropTypes.bool.isRequired,
  setOpenHarvestModal: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    farm: state.farm,
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(HarvestModal)

