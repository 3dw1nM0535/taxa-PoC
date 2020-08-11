//import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Validator from 'validator'
import {
  Modal,
  Button,
  Form,
  Input,
  Checkbox,
  Select,
} from 'semantic-ui-react'
//import { connect } from 'react-redux'

const options = [
  { key: 'a', text: 'Artificial Fertilizer', value: 'Artificial' },
  { key: 'o', text: 'Organic Fertilizer', value: 'Organic' }
]

export function PreparationModal({farm, isModalVisible, setIsModalVisible}) {

  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [fertilizer, setFertilizer] = useState("")
  const [fertilizerName, setFertilizerName] = useState("")
  const [crop, setCrop] = useState("")
  const [error, setError] = useState({})

  function handleChange(e, { value }) {
    setFertilizer(value)
    setFertilizerName("")
  }

  function handleCheckbox() {
    setCheckboxChecked(!checkboxChecked)
    setFertilizer("")
  }
  
  function validate(crop, fertilizer, fertilizerName) {
    const errors = {}
    if (Validator.isEmpty(crop) || !Validator.isAlpha(crop.replace(/\s+/g, ''))) errors.crop = 'Invalid crop'
    if (checkboxChecked) {
      if (Validator.isEmpty(fertilizer) || !Validator.isAlpha(fertilizer.replace(/\s+/g, ''))) errors.fertilizer = 'Invalid fertilizer input'
    }
    if (!Validator.isEmpty(fertilizer) && fertilizer === 'Artificial') {
      if (Validator.isEmpty(fertilizerName)) errors.fertilizerName = 'Invalid name'
    }
    return errors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate(crop, fertilizer, fertilizerName)
    setError(error)
    if (Object.keys(error).length === 0) {
      if (fertilizer === 'Artificial') {
        const formattedName = `${fertilizer}(${fertilizerName})`
        console.log({crop, fertilizer, formattedName})
      } else if (fertilizer === 'Organic') {
        console.log({crop, fertilizer})
      } else {
        console.log({crop})
      }
    }
  }

  return (
    <Modal
      size='tiny'
      open={farm.season === 'Preparation' && isModalVisible}
      onClose={() => setIsModalVisible(false)}
    >
      <Modal.Header>Land preparations</Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={handleSubmit}
        >
          <Form.Field
            id='form-control-input-crop'
            label='Which crop do you choose for this planting season?'
            control={Input}
            value={crop}
            placeholder='Crop selection'
            onChange={(e, { value }) => setCrop(value)}
            error={error.crop ? { content: `${error.crop}`, pointing: 'above' } : false}
          />
          <Form.Field
            id='form-control-checkbox-fertilizer'
            label='Do you use fertilizer during land preparations? (ignore if otherwise)'
            control={Checkbox}
            onChange={() => handleCheckbox()}
          />
          {checkboxChecked && 
            <Form.Field
              id='form-control-select-fertilizer'
              label='Type of fertilizer used'
              control={Select}
              options={options}
              placeholder='Fertlizer'
              onChange={handleChange}
              error={error.fertilizer ? { content: `${error.fertilizer}`, pointing: 'above' } : false}
            />
          }
          {fertilizer === 'Artificial' && checkboxChecked &&
            <Form.Field
              id='form-control-input-artificial-name'
              label='Name of the artificial fertilizer?'
              control={Input}
              value={fertilizerName}
              placeholder='Fertilizer name'
              onChange={(e, { value }) => setFertilizerName(value)}
              error={error.fertilizerName ? { content: `${error.fertilizerName}` } : false}
            />
          }
          <Form.Button control={Button} type='submit' color='violet' content='Confirm Preparations' /> 
        </Form>
       </Modal.Content>
       <Modal.Actions>
         <Button
           negative
           onClick={() => setIsModalVisible(false)}
         >
          Close
         </Button>
       </Modal.Actions>
     </Modal>
  )
}

/*
 *PreparationModal.propTypes = {
 *  farm: PropTypes.object.isRequired,
 *}
 *
 *function mapStateToProp(state) {
 *  return {
 *    farm: state.farm,
 *  }
 *}
 *
 *export default connect(mapStateToProp)(PreparationModal)
 */

