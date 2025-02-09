import { ThemeFactory } from '../../lib/theming/ThemeFactory';
import { Theme } from '../../lib/theming/Theme';

export const getDropdownMenuTheme = (theme: Theme): Theme => {
  return ThemeFactory.create(
    {
      popupMargin: theme.dropdownMenuMenuOffsetY,
    },
    theme,
  );
};
