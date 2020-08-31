import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  Segment,
  Menu,
  Container,
  Sidebar,
  Icon,
  Label,
  Button,
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { connectWallet } from '../../actions'
import { truncateAddress } from '../../utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Media } from './Media'

class MobileContainer extends Component {
	state = {
		copying: true,
		copied: false,
	}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })
  handleToggle = () => this.setState({ sidebarOpened: true })
	handleCopy = () => this.setState(prevState => ({
		copying: !prevState.copying
	}))
	handleCopied = () => this.setState(prevState => ({
		copied: !prevState.copied
	}))


  render() {
    const { children, wallet, connectWallet, location } = this.props
    const { sidebarOpened, copying, copied } = this.state

    return (
      <Media at='mobile'>
        <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation='overlay'
          onHide={this.handleSidebarHide}
          icon='labeled'
          inverted
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item
            as='a'
            href='/farms/'
            header>
            taxa
            <Label color='brown' horizontal>
              Beta
            </Label>
          </Menu.Item>
          <Menu.Item
              active={location.pathname === '/tokenize/'}
              as='a'
              href='/tokenize/'
              color='violet'
            >
              <Icon name='add' />
              Register
            </Menu.Item>
          <Menu.Item
            active={location.pathname === '/dormant/'}
            href='/dormant/'
            as='a'
            color='violet'
          >
            <Icon name='bullseye' />
            Dormant
          </Menu.Item>
          <Menu.Item
            active={location.pathname === '/preparations/'}
            href='/preparations/'
            as='a'
            color='violet'
          >
            <Icon name='hourglass half' />
            Preparations
          </Menu.Item>
          <Menu.Item
            active={location.pathname === '/planting/'}
            href='/planting/'
            as='a'
            color='violet'
          >
            <Icon name='tint' />
            Planting
          </Menu.Item>
          <Menu.Item
            active={location.pathname === '/growth/'}
            href='/growth/'
            as='a'
            color='violet'
          >
            <Icon name='dashboard' />
            Crop Growth
          </Menu.Item>
          <Menu.Item
            active={location.pathname === '/harvesting/'}
            href='/harvesting/'
            as='a'
            color='violet'
          >
            <Icon name='bullhorn' />
            Harvesting
          </Menu.Item>
         </Sidebar>
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            inverted
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='chevron right' size='large' />
                </Menu.Item>
                <Menu.Item position='right'>
                  {wallet.loaded ? (
                    <span>
									    <CopyToClipboard
										    text={wallet.address[0]}
										    onCopy={() => setTimeout(() => {
											    this.handleCopy(false)
											    this.handleCopied(true)

											    setTimeout(() => {
												    this.handleCopy(true)
												    this.handleCopied(false)
											    }, 3000)
										    }, 500)}
									      >
									        <span>
											      {copied &&
                            <Label
                              style={{ paddingRight: '2.7em', paddingLeft: '2.7em' }}
                              horizontal
                              color='violet'
                              size='large'
                            >
                              <Icon name='user circle' />
                              Copied
                            </Label>}
											      {copying &&
                            <Label
                              stype={{ paddingRight: '1em', paddingLeft: '1em' }}
                              horizontal
                              size='large'
                              color='violet'
                            >
                              <Icon name='user circle' />
                              {truncateAddress(wallet.address[0], 10)}
                            </Label>}
										      </span>
									      </CopyToClipboard>
                      </span>
) : (
										<Button
											as='a'
											color='violet'
											onClick={connectWallet}
										>
                    	<Icon name='plug' />
                    	Connect Wallet
                  	</Button>
									)}
								</Menu.Item>
              </Menu>
            </Container>
          </Segment>

          {children}
        </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
	connectWallet: PropTypes.func.isRequired,
	wallet: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
	return {
		wallet: state.wallet,
	}
}

export const wrappedMobileContainer = connect(mapStateToProps, { connectWallet })(withRouter(MobileContainer))

