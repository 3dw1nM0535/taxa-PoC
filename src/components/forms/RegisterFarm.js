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

function RegisterFarm({ submit }) {

  const [size, setSize] = useState("")
  const [lon, setLon] = useState("")
  const [lat, setLat] = useState("")
  const [soil, setSoil] = useState("")
  const [file, setFile] = useState()
  const [sizeUnit, setSizeUnit] = useState("")
  const [error, setError] = useState({})

  const [inputState, setInputState] = useState(false)

  // Validate input
  function validate(farmSize, lon, lat, soilType, file, sizeUnit) {
    const error = {}
    if (!Validator.isFloat(farmSize)) error.farmSize = 'Invalid size'
    if (lon.length === 0 || lat.length === 0) error.location = 'You must provide location data'
    if (soilType.length === 0 || !Validator.isAlpha(soilType)) error.soil = 'Invalid soil'
    if (file === undefined) error.file = 'Invalid file'
    if (sizeUnit === undefined) error.unit = 'Invalid size unit'
    if (sizeUnit.length === 0) error.unit = 'Invalid size unit'
    return error
  }

  function onSuccess(position) {
    const longitude = position.coords.longitude
    const latitude = position.coords.latitude
    setLon(longitude)
    setLat(latitude)
    setInputState(true)
  }
  function onError() {
    window.alert("Unable to get your current position")
  }

  // Handle geolocation permission
  function handleGeolocationPermissions() {
    window.navigator.permissions.query({name: 'geolocation'}).then(function(result) {
      if (result.state === 'prompt') {
        window.navigator.geolocation.getCurrentPosition(onSuccess, onError)
      } else if (result.state === 'granted') {
        window.navigator.geolocation.getCurrentPosition(onSuccess, onError)
      } else if (result.state === 'denied') {
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
    const error = validate(size, lon, lat, soil, file, sizeUnit)
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
          disabled={inputState}
        >
          Grant location access
        </Button>
        {error.location && <span className="error--span">{error.location}</span>}
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

export default RegisterFarm;

