import React, { useState } from 'react';
import { HeaderPanel } from 'carbon-components-react/lib/components/UIShell';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { Switcher, SwitcherItem, SwitcherDivider } from 'carbon-components-react';

import { connectWallet } from '../../actions';

export function UserPanel({ isUserPanelExpanded, connectWallet, wallet, loaded }) {
  const[copied, setCopied] = useState(false)
  const[copying, setCopying] = useState(true)

  function truncateAddress(address, len) {
    if (address.length <= len) {
      return address
    }
    return address.slice(0, len) + '......'
  }

  return (
    <HeaderPanel aria-label="Header panel" expanded={isUserPanelExpanded}>
      {
        loaded ? (
           <>
            <Switcher aria-label='Switcher Container'>
              <SwitcherItem aria-label="Wallet Address">
                <p>
                  {truncateAddress(wallet[0], 12)}
                  <CopyToClipboard text={wallet[0]}
                    onCopy={() => setTimeout(() => {
                      setCopying(false)
                      setCopied(true)

                      setTimeout(() => {
                        setCopying(true)
                        setCopied(false)
                      }, 2000)
                    }, 500)}>
                    <span>
                      {copying && <span className="tag-line">Copy</span>}
                      {copied && <span className="tag-line" type="green">Copied</span>}
                    </span>
                  </CopyToClipboard>
                </p>
              </SwitcherItem>
            </Switcher>
            <SwitcherDivider />
          </>
        ) : (
          <>
            <Switcher aria-label='Switcher Container'>
              <SwitcherItem data-testid="connect-wallet" aria-label="Connect Wallet" onClick={connectWallet}>
                Connect Wallet
              </SwitcherItem>
            </Switcher>
           <SwitcherDivider />
          </>
        )
      }
    </HeaderPanel>

   );
}

function mapStateToProps (state) {
  return {
    wallet: state.wallet.address,
    loaded: !!state.wallet.loaded,
  }
}

export default connect(mapStateToProps, { connectWallet })(UserPanel);
