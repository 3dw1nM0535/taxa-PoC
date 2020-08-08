import PropTypes from 'prop-types'
import Validator from 'validator'
import React, { useState } from 'react'
import Contract from 'web3-eth-contract'
import Farm from '../../build/Farm.json'
import { connect } from 'react-redux'
import makeBlockie from 'ethereum-blockies-base64'
import {
  Header,
  Segment,
  Label,
  Image,
  Button,
  Grid,
  Table,
  Popup,
  Modal,
  Form,
  Checkbox,
  Input,
  Select,
} from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { truncateAddress } from '../../utils'
import {
  HeaderPlaceholder,
  LabelPlaceholder,
  ImagePlaceholder,
} from './HeaderPlaceholder'
import { store } from '../../store'
import { openSeason } from '../../actions'

const options = [
  { key: 'a', text: 'Artificial Fertilizer', value: 'Artificial' },
  { key: 'o', text: 'Organic Fertilizer', value: 'Organic' }
]

function FarmHeader({ farm, loaded, netId, tokenId, account }) {

  const [copying, setCopying] = useState(true)
  const [copied, setCopied] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [fertilizer, setFertilizer] = useState("")
  const [fertilizerName, setFertilizerName] = useState("")
  const [crop, setCrop] = useState("")
  const [error, setError] = useState({})

  async function handleOpenSeason() {
    try {
      setButtonLoading(true)
      const networkData = Farm.networks[netId]
      Contract.setProvider(window.web3.currentProvider)
      const farmContract = new Contract(Farm.abi, networkData.address)
      await farmContract.methods.openSeason(tokenId).send({from: account.address[0]})
        .on('transactionHash', () => {
          setButtonLoading(false)
        })
        .on('confirmation', async(confirmationNumber, receipt) => {
          if (confirmationNumber === 1) {
            const resp = {}
            resp.season = await farmContract.methods.getTokenSeason(tokenId).call()
            store.dispatch(openSeason({ ...resp }))
          }
        })
    } catch(error) {
      setButtonLoading(false)
      console.log(error)
    }
  }

  function handleFarmPreparation() {
    setIsModalVisible(true)
  }

  function handleFarmPlanting() {
    console.log('clicked')
  }

  function handleFarmHarvesting() {
    console.log('clicked')
  }

  function handleNull() {
    console.log('null happened')
  }
  
  function handleChange(e, { value }) {
    setFertilizer(value)
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
      }
    }
  }

  return (
    <Grid stackable columns={2}>
      <Grid.Row>
        <Grid.Column>
          <Segment placeholder>
            <Segment basic>
              {farm.season === undefined ? (
                <LabelPlaceholder />
              ) : (
                <Label
                  content={farm.season}
                  color='violet'
                  horizontal
                />
              )} 
              {farm.imageHash === undefined ? (<ImagePlaceholder />) : (
                <Image
                  style={{ marginTop: '1em' }}
                  src={
                    farm.imageHash === undefined ?
                    'https://react.semantic-ui.com/images/wireframe/square-image.png' :
                    `https://ipfs.io/ipfs/${farm.imageHash}`
                  }
                  rounded
                  fluid
                />
              )} 
              {farm.season === undefined ? <LabelPlaceholder /> : (
                <Button
                  color='violet'
                  loading={buttonLoading}
                  floated='left'
                  onClick={loaded && farm.season === 'Dormant' ? () => handleOpenSeason() : 
                      loaded && farm.season === 'Preparation' ? () => handleFarmPreparation() :
                      loaded && farm.season === 'Planting' ? () => handleFarmPlanting() :
                      loaded && farm.season === 'Harvesting' ? () => handleFarmHarvesting() :
                      handleNull
                  }
                  style={{ marginTop: '1em' }}
                >
                  {farm.season === 'Dormant' ? 'Open Season' : 
                      farm.season === 'Preparation' ? 'Complete Preparations' :
                      farm.season === 'Planting' ? 'Complete Planting' : null
                  }
                </Button>
              )} 
              <Modal
                size='tiny'
                open={isModalVisible}
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
                      onChange={() => setCheckboxChecked(!checkboxChecked)}
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
            </Segment>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {farm.name === undefined ? (
            <>
              <HeaderPlaceholder />
            </>
          ) : (
            <Header as='h1'>{farm.name}</Header>
          )}
            <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={2}>
                      Owner
                    </Table.Cell>
                    <Table.Cell>
                      {farm.owner === undefined ? (
                        <LabelPlaceholder />
                      ) : (
                        <>
                          <Image style={{ width: 30, height: 30 }} src={makeBlockie(String(farm.owner))} size="tiny" circular avatar />
                          <Popup
                            trigger={
                              <Label
                                as='a'
                                target='blank'
                                color='violet'
                                href={`https://etherscan.io/address/${farm.owner}`}
                              >
                                {farm.owner === undefined ? null : truncateAddress(farm.owner, 25)}
                              </Label>
                            }
                            content='View address on etherscan'
                            inverted
                          />
                        <span>
                          <CopyToClipboard
                            text={farm.owner}
                            onCopy={() => setTimeout(() => {
                                setCopying(false)
                                setCopied(true)

                                setTimeout(() => {
                                setCopying(true)
                                setCopied(false)
                              }, 3000)
                            }, 500)}
                          >
                            <span>
                              {copied &&
                                <Label
                                  as={Button}
                                  horizontal
                                  size='medium'
                                  color='violet'
                                >
                                  Copied
                                </Label>}
                              {copying &&
                                <Label
                                  as={Button}
                                  horizontal
                                  size='medium'
                                  color='violet'
                                >
                                  Copy
                                </Label>}
                            </span>
                          </CopyToClipboard>
                        </span>
                      </>
                     )} 
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Size</Table.Cell>
                    <Table.Cell>{farm.size === undefined ? <LabelPlaceholder /> : farm.size}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Soil</Table.Cell>
                    <Table.Cell>{farm.soil === undefined ? <LabelPlaceholder /> : farm.soil}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Location</Table.Cell>
                    <Table.Cell>{farm.location !== undefined ? (
                      <>
                       {farm.location.formatted_address}
                        <a
                          style={{
                            marginLeft: '0.5em',
                            color: '#7f00ff',
                            textDecoration: 'underline'
                          }}
                          href={`https://www.google.com/maps/search/?api=1&query=${farm.lat},${farm.lon}`}
                          target='blank'
                        >
                          View access roads
                        </a>
                      </>
                    ) : <span style={{ fontStyle: 'italic' }}>null</span>}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>#tokenId</Table.Cell>
                    <Table.Cell>{farm.token === undefined ? <LabelPlaceholder /> : farm.token}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>State</Table.Cell>
                    <Table.Cell>
                      {farm.season === undefined ? <LabelPlaceholder /> : (
                        <Label
                          content={farm.season}
                          color='violet'
                          horizontal
                        />
                      )} 
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Completed Seasons</Table.Cell>
                    <Table.Cell>{farm.seasons === undefined ? <LabelPlaceholder /> : farm.seasons}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

FarmHeader.propTypes = {
  farm: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  netId: PropTypes.number.isRequired,
  tokenId: PropTypes.number.isRequired,
  account: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
    netId: state.network.netId,
    tokenId: Number(state.farm.token),
    account: state.wallet,
  }
}

export default connect(mapStateToProps)(FarmHeader)

