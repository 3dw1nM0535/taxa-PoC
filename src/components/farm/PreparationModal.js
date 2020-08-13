import PropTypes from 'prop-types'
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
import { connect } from 'react-redux'
import Farm from '../../build/Farm.json'
import { initContract } from '../../utils'
import api from '../../api'
import { store } from '../../store'
import { submitting, openSeason } from '../../actions'
import { useParams } from 'react-router-dom'

const options = [
  { key: 'a', text: 'Artificial Fertilizer', value: 'Artificial' },
  { key: 'o', text: 'Organic Fertilizer', value: 'Organic' }
]

function PreparationModal({wallet, loading, loaded, netId, farm, isModalVisible, setIsModalVisible}) {

  const { tokenId } = useParams()

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
    setFertilizerName("")
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

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validate(crop, fertilizer, fertilizerName)
    setError(error)
    if (Object.keys(error).length === 0) {
      const appLoading = {}
      appLoading.status = true
      store.dispatch(submitting({ ...appLoading }))
      const formattedName = fertilizer === 'Artificial' ? `${fertilizer}(${fertilizerName})` : fertilizer
      const farmContract = initContract(Farm, netId)
      try {
        await farmContract.methods.finishPreparations(tokenId, crop, formattedName).send({from: wallet.address[0]})
          .on('transactionHash', () => {})
          .on('confirmation', async(confirmationNumber, receipt) => {
            if (confirmationNumber === 1) {
              const {_tokenId, _crop, _fertilizer} = receipt.events.Preparations.returnValues
              const updatedFarm = {}
              updatedFarm.season = await farmContract.methods.getTokenSeason(_tokenId).call()
              updatedFarm.presentSeason = await farmContract.methods.currentSeason(_tokenId).call()
              const _currentSeason = updatedFarm.presentSeason
              await api.farm.updatePreparations(_tokenId, _currentSeason, _crop, _fertilizer)
              store.dispatch(openSeason({ ...updatedFarm }))
            }
          })
          .on('error', error => console.log(error))
      } catch(error) {
        console.log(error)
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
          onSubmit={loaded ? handleSubmit : null}
        >
          <Form.Field
            id='form-control-input-crop'
            label='Which crop did you choose for this planting season?'
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
          <Form.Button loading={loading} control={Button} type='submit' color='violet' content='Confirm Preparations' /> 
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

PreparationModal.propTypes = {
  farm: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  netId: PropTypes.number.isRequired,
  wallet: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
}

function mapStateToProp(state) {
  return {
    farm: state.farm,
    loaded: state.wallet.loaded,
    netId: state.network.netId,
    wallet: state.wallet,
    loading: state.loading.status,
  }
}

export default connect(mapStateToProp)(PreparationModal)

