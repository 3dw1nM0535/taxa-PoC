import React, { useState } from 'react';
import {
  AddFilled32,
  Search32,
  EventSchedule32,
  Sprout32,
  Notification20,
  UserAvatar20
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
import { Notification, UserPanel } from './panels';

function FooHeader () {
  const [isNotificationPanelExpanded, setIsNotificationPanelExpanded] = useState(false);
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
            Farmer Marketplace(Beta)
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Notifications" onClick={() => isUserPanelExpanded ? null : setIsNotificationPanelExpanded(!isNotificationPanelExpanded)}>
              <Notification20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="User" onClick={() => isNotificationPanelExpanded ? null : setIsUserPanelExpanded(!isUserPanelExpanded)}>
              <UserAvatar20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <Notification isNotificationPanelExpanded={isNotificationPanelExpanded} />
          <UserPanel isUserPanelExpanded={isUserPanelExpanded} />
          <SideNav aria-label="Side navigation" isRail expanded={isSideNavExpanded}>
            <SideNavItems>
              <SideNavLink renderIcon={Search32} href="#">Explore</SideNavLink>
              <SideNavLink renderIcon={AddFilled32} href="#">Register Farm</SideNavLink>
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

export default FooHeader;
