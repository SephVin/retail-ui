import React from 'react';

import { MenuItem, MenuItemProps, isMenuItem } from '../MenuItem/MenuItem';

export function isActiveElement(element: any): element is React.ComponentElement<MenuItemProps, MenuItem> {
  return isMenuItem(element) && !element.props.disabled;
}
