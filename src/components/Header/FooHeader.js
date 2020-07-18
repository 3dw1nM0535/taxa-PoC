import React, { useState } from 'react';
import {
  AddFilled32,
  Search32,
  EventSchedule32,
  Sprout32,
  UserAvatar20,
  Switcher20
} from '@carbon/icons-react';
import HeaderContainer from 'carbon-components-react/lib/components/UIShell/HeaderContainer';
import {
  Header,
  SkipToContent,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavLink
} from 'carbon-components-react/lib/components/UIShell';
import { Tag } from 'carbon-components-react';
import { UserPanel } from '../panels';
import { connect } from 'react-redux';

function Blockie({ imgString }) {
  return (
    <img alt="img" src={imgString} height="20" width="20" />
  )
}

function FooHeader ({ wallet, loaded }) {

  const [isUserPanelExpanded, setIsUserPanelExpanded] = useState(false);

  return (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <>
        <Header aria-label="Foo">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            isCollapsible
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="#" prefix="">
            Octopus
            <Tag type="green">Alpha</Tag>
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="User">
              { loaded ? (
                <Blockie
                  imgString={wallet.addressBlockie}
                 />
                ) : (
                  <UserAvatar20 />
                ) 
              }
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Switcher" onClick={() => setIsUserPanelExpanded(!isUserPanelExpanded)}>
              <Switcher20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <UserPanel isUserPanelExpanded={isUserPanelExpanded} />
          <SideNav aria-label="Side navigation" isRail expanded={isSideNavExpanded}>
            <SideNavItems>
              <SideNavLink renderIcon={Search32} href="#">Explore</SideNavLink>
              <SideNavLink renderIcon={AddFilled32} href="/add/farm">Register Farm</SideNavLink>
              <SideNavLink renderIcon={Sprout32} href="#">Harvests</SideNavLink>
              <SideNavLink renderIcon={EventSchedule32} href="#">Bookings</SideNavLink>
            </SideNavItems>
          </SideNav>
        </Header>
      </>
    )}
  />
  );
}

function mapStateToProps(state) {
  return {
    wallet: state.wallet,
    loaded: !!state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(FooHeader);
