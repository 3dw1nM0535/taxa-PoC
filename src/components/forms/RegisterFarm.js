import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  FileUploader,
  Select,
  SelectItem
} from 'carbon-components-react';
import Validator from 'validator';
import { connect } from 'react-redux'
import { grantLocationPermission, grantLocationPermissionError } from '../../actions'
import { store } from '../../store'


function RegisterFarm({ submit, grantLocationPermission, locationPermission }) {

  const [size, setSize] = useState("")
  const [lon, setLon] = useState("")
  const [lat, setLat] = useState("")
  const [soil, setSoil] = useState("")
  const [farmName, setFarmName] = useState("")
  const [file, setFile] = useState()
  const [sizeUnit, setSizeUnit] = useState("")
  const [error, setError] = useState({})

  const [inputState, setInputState] = useState(false)

  // Validate input
  function validate(farmSize, farmLocation, soilType, farmName, file, sizeUnit) {
    const error = {}
    if (Validator.isEmpty(farmSize) || !Validator.isFloat(farmSize)) error.farmSize = 'Invalid size'
    if (Validator.isEmpty(soilType) || !Validator.isAlpha(soilType)) error.soil = 'Invalid soil'
    if (Validator.isEmpty(farmName) || !Validator.isAlpha(farmName.replace(/\s+/g, ''))) error.farmName = 'Invalid name'
    if (file === undefined) error.file = 'Invalid file'
    if (sizeUnit === undefined) error.unit = 'Invalid size unit'
    if (Validator.isEmpty(sizeUnit) || !Validator.isAlpha(sizeUnit)) error.unit = 'Invalid size unit'
    return error
  }

  function onSuccess(position) {
    const longitude = position.coords.longitude
    const latitude = position.coords.latitude
    const permissionsState = {}
    setLon(longitude)
    setLat(latitude)
    permissionsState.locationPermissionsState = 'granted'
    store.dispatch(grantLocationPermission({ ...permissionsState }))
  }
  function onError() {
    const permissionsState = {}
    permissionsState.locationPermissionsState = 'denied'
    store.dispatch(grantLocationPermissionError({ ...permissionsState }))
    window.alert("Unable to get your current position")
  }

  // Handle geolocation permission
  function handleGeolocationPermissions() {
    window.navigator.permissions.query({name: 'geolocation'}).then(function(result) {
      if (result.state === 'prompt') {
        setInputState(true)
        window.navigator.geolocation.getCurrentPosition(onSuccess, onError)
      } else if (result.state === 'granted') {
        setInputState(true)
        window.navigator.geolocation.getCurrentPosition(onSuccess, onError)
      } else if (result.state === 'denied') {
        setInputState(true)
        window.navigator.geolocation.getCurrentPosition(onSuccess, onError)
      }
      result.onchange = function() {
        console.log(result.state)
      }
    })
  }


  // Submit form input
  function handleSubmit(e) {
    e.preventDefault()
    const error = validate(size, soil, farmName, file, sizeUnit)
    setError(error)
    if (Object.keys(error).length === 0) {
      submit(size, lon, lat, file, soil, sizeUnit)
    }
  }
  return (
    <Form className="farm--input" onSubmit={(e) => handleSubmit(e)}>
      <FormGroup legendText="Farm size">
        <TextInput
          id="testSize"
          labelText="How large is your farm? e.g 89.32ha"
          helperText="e.g 89.73ha"
          invalid={!!error.farmSize}
          invalidText={error.farmSize}
          defaultValue={size}
          onChange={(e) => setSize(e.target.value)}
          required
          size="sm"
          type="text"
        />
        <Select
          id="select-1"
          labelText="Choose farm size unit"
          helperText="ha/acres"
          defaultValue="placeholder-item"
          disabled={false}
          onChange={(e) => setSizeUnit(e.target.value)}
          invalid={!!error.unit}
          invalidText={error.unit}
        >
          <SelectItem
            disabled
            hidden
            text="Choose size unit"
            value="placeholder-item"
          />
          <SelectItem
            disabled={false}
            hidden={false}
            text="Hectares"
            value="ha"
          />
          <SelectItem
            disabled={false}
            hidden={false}
            text="Acres"
            value="acres"
          />
        </Select>
      </FormGroup>
      <FormGroup legendText="Location permission">
        <Button
          type="button"
          onClick={() => handleGeolocationPermissions()}
          disabled={locationPermission === 'granted'}
        >
          {locationPermission === 'granted' ? 'Granted!' : 'Grant location access'}
        </Button>
      </FormGroup>
      <TextInput
        id="test--soil-type"
        labelText="What is your farm's soil type?"
        invalid={!!error.soil}
        invalidText={error.soil}
        defaultValue={soil}
        onChange={(e) => setSoil(e.target.value)}
        required
        size="sm"
        type="text"
      />
      <TextInput
        id="test--farm-name"
        labelText="Farm name"
        helperText="e.g Adagala Vineyard"
        invalid={!!error.farmName}
        invalidText={error.farmName}
        defaultValue={farmName}
        onChange={(e) => setFarmName(e.target.value)}
        required
        size="sm"
        type="text"
      />
      <FormGroup legendText="Upload farm image">
        <FileUploader
          id="test--farm-image"
          labelDescription="Everyone will see the state of your farm and can't be deleted from the blockchain"
          buttonLabel="Select file"
          filenameStatus="edit"
          buttonKind="primary"
          onChange={(e) => setFile(e.target.files)}
        />
        {error.file && <span className="error--span">{error.file}</span>}
      </FormGroup>
      <Button
        kind="primary"
        type="submit"
        disabled={false}
      >
        Register
      </Button>
    </Form>
  )
}

function mapStateToProps(state) {
  return {
    locationPermission: state.permissions.locationPermissionsState,
  }
}

export default connect(mapStateToProps, { grantLocationPermission })(RegisterFarm);

