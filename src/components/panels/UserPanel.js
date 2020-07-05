import React from 'react';
import { HeaderPanel } from 'carbon-components-react/lib/components/UIShell';

export const UserPanel = ({ isUserPanelExpanded }) => (
  <HeaderPanel aria-label="Header panel" expanded={isUserPanelExpanded} />
)
