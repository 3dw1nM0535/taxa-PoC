import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  Responsive,
  Visibility,
  Segment,
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

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })
	handleCopy = () => this.setState(prevState => ({
		copying: !prevState.copying
	}))
	handleCopied = () => this.setState(prevState => ({
		copied: !prevState.copied
	}))

  render() {
    const { children, wallet, connectWallet, location } = this.props
    const { fixed, copying, copied } = this.state

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            textAlign='center'
            inverted
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item
                  as='a'
                  href='/'
                  header>
                  taxa
                  <Label color='brown' horizontal>
                    Beta
                  </Label>
                </Menu.Item>
                <Menu.Item
                  active={location.pathname === '/get-started/'}
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
                  name='Register Your Farm'
                  as='a'
                  href='/tokenize/'
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
                              size='medium'
                            >
                              Copied
                            </Label>}
											      {copying &&
                            <Label
                              stype={{ paddingRight: '1em', paddingLeft: '1em' }}
                              horizontal
                              size='medium'
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
              </Container>
            </Menu>
          </Segment>
        </Visibility>
        {children}
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

