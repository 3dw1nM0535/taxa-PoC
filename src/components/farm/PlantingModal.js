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
import Validator from 'validator'

const options = [
  { key: 'kg', text: 'kilogram', value: 'kg' },
  { key: 'g', text: 'gram', value: 'g' },
  { key: 't', text: 'tonne', value: 'tonne' }
]

function PlantingModal({farm, loaded, openPlantingModal, setOpenPlantingModal}) {

  const [seed, setSeed] = useState("")
  const [supplier, setSupplier] = useState("")
  const [expectedYield, setExpectedYield] = useState(0)
  const [unit, setUnit] = useState("")
  const [error, setError] = useState({})

  function validate(seed, supplier, expectedYield, unit) {
    const errors = {}
    if (Validator.isEmpty(seed) || !Validator.isAlpha(seed.replace(/\s+/g, ''))) errors.seed = 'Invalid seeds'
    if (Validator.isEmpty(supplier) || !Validator.isAlpha(supplier.replace(/\s+/g, ''))) errors.supplier = 'Invalid supplier'
    if (expectedYield === 0) errors.expectedYield = 'Yield cannot be 0'
    if (Validator.isEmpty(unit)) errors.unit = 'Invalid unit'
    return errors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate(seed, supplier, expectedYield, unit)
    setError(error)
    if (Object.keys(error).length === 0) {
      console.log('submitting...')
    }
  }

  return (
    <Modal
      size='tiny'
      open={farm.season === 'Planting' && openPlantingModal}
    >
      <Modal.Header>Plantings</Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={loaded ? handleSubmit : null}
        >
          <Form.Field
            id='form-control-input-seed'
            label='Seed used during planting/sowing?'
            control={Input}
            value={seed}
            onChange={(e, { value }) => setSeed(value)}
            error={error.seed ? { content: `${error.seed}`, pointing: 'above' } : false}
          />
          <Form.Field
            id='form-control-input-seed-supplier'
            label='Who is your seed supplier?'
            control={Input}
            value={supplier}
            onChange={(e, { value }) => setSupplier(value)}
            error={error.supplier ? { content: `${error.supplier}`, pointing: 'above' } : false}
          />
          <Form.Field
            id='form-control-input-yield'
            label='Yield amount you expect to harvest?'
            control={Input}
            type='number'
            value={expectedYield}
            onChange={(e, { value }) => setExpectedYield(value)}
            error={error.expectedYield ? { content: `${error.expectedYield}`, pointing: 'above' } : false}
          />
          <Form.Field
            id='form-control-input-yield-unit'
            label='Yield unit?'
            control={Select}
            options={options}
            value={unit}
            placeholder='Harvest supply unit'
            onChange={(e, { value }) => setUnit(value)}
            error={error.unit ? { content: `${error.unit}`, pointing: 'above' } : false}
          />
          <Form.Button control={Button} type='submit' color='violet' content='Confirm Plantings' />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          onClick={() => setOpenPlantingModal(false)}
        >
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

PlantingModal.propTypes = {
  loaded: PropTypes.bool.isRequired,
  farm: PropTypes.object.isRequired,
  openPlantingModal: PropTypes.bool.isRequired,
  setOpenPlantingModal: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
    farm: state.farm,
  }
}

export default connect(mapStateToProps)(PlantingModal)

