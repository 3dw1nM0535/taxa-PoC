import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  Responsive,
  Segment,
  Sidebar,
  Menu,
  Container,
  Icon,
  Label,
  Button,
} from 'semantic-ui-react'
import { connectWallet } from '../../actions'
import { connect } from 'react-redux'
import { truncateAddress } from '../../utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class DesktopContainer extends Component {
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
    const { copying, copied, sidebarOpened } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        minWidth={Responsive.onlyTablet.minWidth}
      >
        <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          onHide={this.handleSidebarHide}
          inverted
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item
            as='a'
            header>
            taxa
            <Label color='brown' horizontal>
              Beta
            </Label>
          </Menu.Item>
          <Menu.Item
            active={location.pathname === '/farms/'}
            as='a'
            href='/farms/'
          >
            <Icon name='search' />
            Farms
          </Menu.Item>
          <Menu.Item
            active={location.pathname === '/tokenize/'}
            href='/tokenize/'
            as='a'
          >
            <Icon name='add' />
            Add farm
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            inverted
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size="small">
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
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
	wallet: PropTypes.object.isRequired,
	connectWallet: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
	return {
		wallet: state.wallet,
	}
}

export const wrappedDesktopContainer = connect(mapStateToProps, { connectWallet })(withRouter(DesktopContainer))

