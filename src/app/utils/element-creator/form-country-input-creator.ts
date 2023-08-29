import { countryCodes } from '../../data/country-codes';
import { validateCountry } from '../validation/input-validation';
import { ElementCreator } from './element-creator';
import { ElementOptionCreator } from './element-option-creator';
import { FormInputCreator } from './form-input-creator';

export class FormInputCountryCreator extends FormInputCreator {
  constructor(containerClasses: string, list: string) {
    super({ placeholder: 'country', containerClasses, validationCallback: validateCountry, list });

    const countryList = new ElementCreator({
      tag: 'datalist',
      classes: 'absolute overflow-y-auto bg-gray-100 w-full z-10 max-h-[232px]',
    });

    Object.keys(countryCodes).forEach((country) => {
      const option = new ElementOptionCreator({ tag: 'option', value: country });
      countryList.appendNode(option);
    });

    this.inputContainer.appendNode(countryList);
  }
}
