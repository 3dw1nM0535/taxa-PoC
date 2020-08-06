import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select } from 'semantic-ui-react'
import Validator from 'validator'
import { connect } from 'react-redux'
import { locationAccess } from '../../actions'
import { store } from '../../store'

import './forms.css'

const options = [
  { key: 'h', text: 'Hectares', value: 'ha' },
  { key: 'a', text: 'Acres', value: 'acres' },
]

function RegisterFarm({ addFarm, loadingStatus, walletLoaded, longitude, latitude }) {

  const [name, setName] = useState("")
  const [size, setSize] = useState("")
  const [unit, setUnit] = useState("")
  const [soil, setSoil] = useState("")
  const [file, setFile] = useState()
  const [error, setError] = useState({})

	function onsuccess(position) {
    const longitude = String(position.coords.longitude)
    const latitude = String(position.coords.latitude)
		const location = { lon: longitude, lat: latitude }
		store.dispatch(locationAccess({ ...location }))
  }

  function onerror() {
    window.alert('Unable to get your current position')
  }

	useEffect(() => {
		(() => {
			navigator.permissions.query({name: 'geolocation'}).then(function(result) {
				if (result.state === 'prompt') {
					navigator.geolocation.getCurrentPosition(onsuccess, onerror)
				} else if (result.state === 'granted') {
					navigator.geolocation.getCurrentPosition(onsuccess, onerror)
				}
			})
		})()
	})

  function validate(name, size, unit, soil, file) {
    const errors = {}
    if (Validator.isEmpty(name) || !Validator.isAlpha(name.replace(/\s+/g, ''))) errors.name = 'Invalid name'
    if (size === '0' || Validator.isEmpty(size) || !Validator.isFloat(size)) errors.size = 'Invalid size'
    if (Validator.isEmpty(unit)) errors.unit = 'Unit is required'
    if (Validator.isEmpty(soil.replace(/\s+/g, '')) || !Validator.isAlpha(soil.replace(/\s+/g, ''))) errors.soil = 'Invalid soil'
    if (file === undefined) errors.file = 'Farm image required'
    return errors
  }

  function captureFile(e) {
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => convertToBuffer(reader)
  }

  async function convertToBuffer(reader) {
    const buffer = await Buffer.from(reader.result)
    setFile(buffer)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validate(name, size, unit, soil, file)
		setError(error)
    if (Object.keys(error).length === 0) {
      const farmSize = size + unit
      addFarm(name, farmSize, longitude, latitude, file, soil)
    }
  }

  return (
    <Form
      className='form--container'
      onSubmit={walletLoaded ? handleSubmit : null}
      loading={loadingStatus}
    >
      <Form.Field
        id='form-input-control-farm-name'
        control={Input}
        type='text'
        label='Farm name'
        value={name}
        placeholder='Your farm name'
        onChange={(e, { value }) => setName(value)}
        error={error.name ? { content: `${error.name}`, pointing: 'above' } : false}
      />
      <Form.Field
        id='form-input-control-farm-size'
        control={Input}
        type='text'
        label='Farm size'
        value={size}
        placeholder='Your farm land size'
        onChange={(e, { value }) => setSize(value)}
        error={error.size ? { content: `${error.size}`, pointing: 'above' } : false}
      />
      <Form.Field
        onChange={(e, { value }) => setUnit(value)}
        control={Select}
        label='Farm size unit'
        placeholder='Unit'
        options={options}
        error={error.unit ? { content: `${error.unit}`, pointing: 'above' } : false}
      />
      <Form.Field
        id='form-input-soil'
        control={Input}
        type='text'
        value={soil}
        onChange={(e, { value }) => setSoil(value)}
        label='Soil'
        placeholder='Your farm soil type'
        error={error.soil ? { content: `${error.soil}`, pointing: 'above' } : false}
      />
      <Form.Field
        id='form-input-image'
        control={Input}
        type='file'
        label='Farm image'
        onChange={captureFile}
        error={error.file ? { content: `${error.file}`, pointing: 'above' } : false}
      />
      {error.location && <span className='error--span'>{error.location}</span>}
      <Form.Button control={Button} type='submit' color='violet' content='Register' />
    </Form>
  )
}

RegisterFarm.propTypes = {
  addFarm: PropTypes.func.isRequired,
  loadingStatus: PropTypes.bool.isRequired,
  walletLoaded: PropTypes.bool.isRequired,
	longitude: PropTypes.string.isRequired,
	latitude: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return {
    loadingStatus: state.loading.status,
    walletLoaded: state.wallet.loaded,
		longitude: state.location.lon,
		latitude: state.location.lat,
  }
}

export default connect(mapStateToProps)(RegisterFarm)

