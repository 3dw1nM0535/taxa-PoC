import PropTypes from 'prop-types'
import React from 'react'
import { wrappedMobileContainer as MobileContainer } from './Mobile'
import { wrappedDesktopContainer as DesktopContainer } from './Desktop'

const ResponsiveContainer = ({ children }) => (
  <>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

export {
  ResponsiveContainer,
}
