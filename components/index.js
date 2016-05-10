// @flow

/**
 * This file is for IDE and Flow. NOT FOR PRODUCTION USAGE.
 */

export {default as Autocomplete} from './Autocomplete/Autocomplete';
export {default as Button} from './Button/Button';
export {default as Center} from './Center/Center';
export {default as Checkbox} from './Checkbox/Checkbox';
export {default as ComboBox} from './ComboBox/ComboBox';
export {default as DatePicker} from './DatePicker/DatePicker';
export {default as DateSelect} from './DateSelect/DateSelect';
export {default as Dropdown} from './Dropdown/Dropdown';
export {default as FxInput} from './FxInput/FxInput';
export {default as Gapped} from './Gapped/Gapped';
export {default as Group} from './Group/Group';
export {default as Icon} from './Icon/Icon';
export {default as Input} from './Input/Input';
export {default as Link} from './Link/Link';
export {default as Loader} from './Loader/Loader';
export {default as Menu} from './Menu/Menu';
export {default as MenuItem} from './MenuItem/MenuItem';
export {default as MenuSeparator} from './MenuSeparator/MenuSeparator';
export {default as Modal} from './Modal/Modal';
export {default as PhoneInput} from './PhoneInput/PhoneInput';
export {default as Radio} from './Radio/Radio';
export {default as RadioGroup} from './RadioGroup/RadioGroup';
export {default as RenderContainer} from './RenderContainer/RenderContainer';
export {default as ScrollContainer} from './ScrollContainer/ScrollContainer';
export {default as Select} from './Select/Select';
export {default as Spinner} from './Spinner/Spinner';
export {default as Sticky} from './Sticky/Sticky';
export {default as Textarea} from './Textarea/Textarea';
export {default as Tooltip} from './Tooltip/Tooltip';

import warning from 'warning';

warning(
  false,
  'The file retail-ui/components/index.js must only be used by IDEs and Flow.' +
  ' Use retail-ui/scripts/babel/component-imports babel plugin.'
);
