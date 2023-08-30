import { Address, Customer } from '@commercetools/platform-sdk';
import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { codeCountries } from '../../../data/country-codes';
import { ElementOptionCreator } from '../../../utils/element-creator/element-option-creator';
import { FormInputCountryCreator } from '../../../utils/element-creator/form-country-input-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { isValueExist, validateOnlyLetters, validatePostalCode } from '../../../utils/validation/input-validation';
import { ElementButtonCreator } from '../../../utils/element-creator/element-button-creator';
import trash from '../../../../assets/svg/trash.svg';
import plus from '../../../../assets/svg/plus.svg';
import { Addresses } from '../../../enums/addresses';

interface AddressInputs {
  id: string;
  countryInput: HTMLInputElement;
  cityInput: HTMLInputElement;
  streetInput: HTMLInputElement;
  postalCodeInput: HTMLInputElement;
}

export class AddressTab extends AccordionTab {
  tabType: Addresses;

  addresses: AddressInputs[];

  defaultSelect: ElementCreator<HTMLElement>;

  constructor(consumerData: Customer, svg: string, heading: string, tabType: Addresses) {
    super(consumerData, svg, heading);
    this.tabType = tabType;
    this.defaultSelect = new ElementCreator({ tag: 'select', classes: 'form-input' });
    this.addresses = [];
  }

  createContent(): HTMLElement {
    const container = new ElementCreator({ tag: 'div' });
    const addressesList = this.getAddressesList(this.tabType);
    const defaultId = this.getDefaultAddressId(this.tabType);

    if (addressesList) {
      const defaultObj = addressesList?.find((address) => address.id === defaultId);
      if (defaultObj) {
        addressesList?.splice(addressesList.indexOf(defaultObj), 1);
      }

      const defaultAddress = defaultObj
        ? `${codeCountries[defaultObj.country]} ${defaultObj.city} ${defaultObj.streetName} ${defaultObj.postalCode}`
        : '';

      const addresses = addressesList?.map((address) => {
        const country = codeCountries[address.country];
        return `${country} ${address.city} ${address.streetName} ${address.postalCode}`;
      });

      if (defaultAddress) {
        const defaultContainer = new ElementCreator({ tag: 'div', classes: 'default' });
        defaultContainer.appendNode(
          new ElementCreator({ tag: 'div', text: 'default address', classes: 'opacity-60 h5' }),
          new ElementCreator({ tag: 'div', text: defaultAddress, classes: 'text-xs font-medium' }),
        );
        container.appendNode(defaultContainer);
      }

      if (addresses.length) {
        const anotherContainer = new ElementCreator({ tag: 'div', classes: 'another mt-3' });
        anotherContainer.appendNode(new ElementCreator({ tag: 'div', text: 'another addresses', classes: 'opacity-60 h5' }));
        addresses.forEach((address) => {
          anotherContainer.appendNode(new ElementCreator({ tag: 'div', text: address, classes: 'text-xs font-medium' }));
        });
        container.appendNode(anotherContainer);
      }
    }
    return container.getElement();
  }

  createEdit(): HTMLElement {
    const container = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    const addressesList = this.getAddressesList(this.tabType);
    const defaultId = this.getDefaultAddressId(this.tabType);
    let defaultContainer: ElementCreator<HTMLElement> | null = null;
    let allContainer: ElementCreator<HTMLElement> | null = null;

    if (addressesList) {
      defaultContainer = new ElementCreator({ tag: 'div', classes: 'default flex flex-col gap-4' });
      const defaultObj = addressesList.find((address) => address.id === defaultId);
      const defaultAddress = defaultObj
        ? `${codeCountries[defaultObj.country]} ${defaultObj.city} ${defaultObj.streetName} ${defaultObj.postalCode}`
        : '';

      const addresses = addressesList.map((address) => {
        const country = codeCountries[address.country];
        return `${country} ${address.city} ${address.streetName} ${address.postalCode}`;
      });

      const defaultTitle = new ElementCreator({ tag: 'div', text: 'default address', classes: 'opacity-60 h5' }).getElement();
      if (!defaultAddress && addresses.length) {
        const option = new ElementOptionCreator({ tag: 'option', value: '', hidden: true });
        this.defaultSelect.appendNode(option);
      }
      addresses.forEach((address) => {
        const option = new ElementOptionCreator({ tag: 'option', value: address });
        this.defaultSelect.appendNode(option);
      });
      defaultContainer.appendNode(defaultTitle, this.defaultSelect);

      allContainer = new ElementCreator({ tag: 'div', classes: 'all flex flex-col gap-4' });

      addressesList.forEach((address) => {
        allContainer?.appendNode(this.createInputsContainer(container.getElement(), address));
      });

      if (defaultContainer) container.appendNode(defaultContainer);
      if (allContainer) container.appendNode(allContainer);
    }
    const addAddress = new ElementCreator({ tag: 'div', classes: 'flex items-center gap-2 cursor-pointer', html: plus });
    const addAddressTitle = new ElementCreator({ tag: 'div', text: 'add new address', classes: 'text-primary-color' });
    addAddress.appendNode(addAddressTitle);

    addAddress.getElement().addEventListener('click', () => {
      this.saveButton.disabled = true;
      if (!allContainer) allContainer = new ElementCreator({ tag: 'div', classes: 'another flex flex-col gap-4' });
      allContainer.appendNode(this.createInputsContainer(container.getElement()));
    });
    container.appendNode(addAddress);
    return container.getElement();
  }

  createInputsContainer(container: HTMLElement, address?: Address): HTMLElement {
    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
      id: address?.id || 'new',
    });

    const countryInputContainer = new FormInputCountryCreator('country');
    const cityInputContainer = new FormInputCreator({ placeholder: 'city', validation: validateOnlyLetters });
    const streetInputContainer = new FormInputCreator({ placeholder: 'street', validation: isValueExist });
    const postalCodeInputContainer = new FormInputCreator({
      placeholder: 'postal code',
      checkInput: countryInputContainer.getInput(),
      validation: validatePostalCode,
    });

    if (address) {
      countryInputContainer.setInputValue(codeCountries[address.country]);
      if (address.city) cityInputContainer.setInputValue(address.city);
      if (address.streetName) streetInputContainer.setInputValue(address.streetName);
      if (address.postalCode) postalCodeInputContainer.setInputValue(address.postalCode);
    }

    countryInputContainer.getInput().addEventListener('input', () => this.validateSaveButton());
    cityInputContainer.getInput().addEventListener('input', () => this.validateSaveButton());
    streetInputContainer.getInput().addEventListener('input', () => this.validateSaveButton());
    postalCodeInputContainer.getInput().addEventListener('input', () => this.validateSaveButton());

    const deleteButton = new ElementButtonCreator({ html: trash, classes: 'self-end md: self-center' });
    deleteButton.getElement().addEventListener('click', () => {
      const defaultContainer = container.querySelector('.default');
      const allContainer = container.querySelector('.another');

      allContainer?.removeChild(inputsContainer.getElement());
      if (!allContainer?.firstChild && defaultContainer) {
        container.removeChild(defaultContainer);
      }
    });
    inputsContainer.appendNode(
      countryInputContainer.getContainer(),
      cityInputContainer.getContainer(),
      streetInputContainer.getContainer(),
      postalCodeInputContainer.getContainer(),
      deleteButton,
    );
    this.addresses.push({
      id: inputsContainer.getElement().id,
      countryInput: countryInputContainer.getInput(),
      cityInput: cityInputContainer.getInput(),
      streetInput: streetInputContainer.getInput(),
      postalCodeInput: postalCodeInputContainer.getInput(),
    });
    return inputsContainer.getElement();
  }

  getAddressesList(tab: Addresses): Address[] | undefined {
    if (!this.consumerData) return undefined;
    if (tab === Addresses.Billing) {
      return this.consumerData.addresses.filter((addr) => addr.id && this.consumerData?.billingAddressIds?.includes(addr.id));
    }
    return this.consumerData.addresses.filter((addr) => addr.id && this.consumerData?.shippingAddressIds?.includes(addr.id));
  }

  getDefaultAddressId(tab: Addresses): string | undefined {
    if (tab === Addresses.Billing) return this.consumerData?.defaultBillingAddressId;
    return this.consumerData?.defaultShippingAddressId;
  }

  updateCustomer(): Promise<void> {
    return super.updateCustomer();
  }
}
