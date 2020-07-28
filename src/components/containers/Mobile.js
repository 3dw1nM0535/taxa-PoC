import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  Responsive,
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

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

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
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item
            href='/'
            as='a'
            header>
            taxa
            <Label color='brown' horizontal>
              Beta
            </Label>
          </Menu.Item>
          <Menu.Item
            active={location.pathname === '/get-started/'}
            href='/'
            name='Get Started'
            as='a'
          />
          <Menu.Item
            active={location.pathname === '/farms/'}
            name='Farms'
            as='a'
            href='/farms/'
          />
          <Menu.Item
            active={location.pathname === '/tokenize/'}
            href='/tokenize/'
            name='Register Your Farm'
            as='a'
          />
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
                              horizontal color='green'
                              size='big'
                            >
                              Copied
                            </Label>}
											      {copying &&
                            <Label
                              stype={{ paddingRight: '1em', paddingLeft: '1em' }}
                              horizontal
                              size='big'
                            >
                              {truncateAddress(wallet.address[0], 10)}
                            </Label>}
										      </span>
									      </CopyToClipboard>
                      </span>
) : (
										<Button
											as='a'
											color='green'
											onClick={connectWallet}
										>
                    	<Icon name='plug' />
                    	Connect Wallet
                  	</Button>
									)}
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
                  <Icon name='sidebar' />
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
                              horizontal color='green'
                              size='big'
                            >
                              Copied
                            </Label>}
											      {copying &&
                            <Label
                              stype={{ paddingRight: '1em', paddingLeft: '1em' }}
                              horizontal
                              size='big'
                            >
                              {truncateAddress(wallet.address[0], 10)}
                            </Label>}
										      </span>
									      </CopyToClipboard>
                      </span>
) : (
										<Button
											as='a'
											color='green'
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
      </Responsive>
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

