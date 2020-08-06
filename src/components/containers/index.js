import PropTypes from 'prop-types'
import React from 'react'
import { wrappedMobileContainer as MobileContainer } from './Mobile'
import { wrappedDesktopContainer as DesktopContainer } from './Desktop'
import { MediaContextProvider } from './Media'

const ResponsiveContainer = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

export {
  ResponsiveContainer,
}
