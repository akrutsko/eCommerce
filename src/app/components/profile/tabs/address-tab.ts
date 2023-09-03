import { Address } from '@commercetools/platform-sdk';

import trash from '../../../../assets/svg/trash.svg';
import plus from '../../../../assets/svg/plus.svg';

import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { codeCountries, countryCodes } from '../../../data/country-codes';
import { ElementOptionCreator } from '../../../utils/element-creator/element-option-creator';
import { FormInputCountryCreator } from '../../../utils/element-creator/form-country-input-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import {
  isValueExist,
  validateCountry,
  validateOnlyLetters,
  validatePostalCode,
} from '../../../utils/validation/input-validation';
import { ElementButtonCreator } from '../../../utils/element-creator/element-button-creator';
import { Addresses } from '../../../enums/addresses';
import { Consumer } from '../../consumer/consumer';
import { ElementLabelCreator } from '../../../utils/element-creator/element-label-creator';
import { ElementInputCreator } from '../../../utils/element-creator/element-input-creator';
import { ElementSelectCreator } from '../../../utils/element-creator/element-selector-creator';
import { Message } from '../../../utils/message/toastify-message';

export class AddressTab extends AccordionTab {
  tabType: Addresses;

  countryInputContainer: FormInputCountryCreator;

  cityInputContainer: FormInputCreator;

  streetInputContainer: FormInputCreator;

  postalCodeInputContainer: FormInputCreator;

  changeSelect: ElementSelectCreator;

  makeDefaultCheckbox: HTMLInputElement;

  get isBilling(): boolean {
    return this.tabType === Addresses.Billing;
  }

  get defaultAddressId(): string {
    if (!this.consumer.consumerData) return '';

    const defaultAddressId = this.isBilling
      ? this.consumer.consumerData.defaultBillingAddressId
      : this.consumer.consumerData.defaultShippingAddressId;

    return defaultAddressId || '';
  }

  get addressesList(): Address[] {
    if (!this.consumer.consumerData) return [];

    const addressIds = this.isBilling
      ? this.consumer.consumerData.billingAddressIds
      : this.consumer.consumerData.shippingAddressIds;
    return this.consumer.consumerData.addresses.filter((addr) => addr.id && addressIds?.includes(addr.id)) || [];
  }

  constructor(consumer: Consumer, svg: string, heading: string, tabType: Addresses) {
    super(consumer, svg, heading);
    this.tabType = tabType;
    this.changeSelect = new ElementSelectCreator({ classes: 'form-input' });
    this.makeDefaultCheckbox = new ElementInputCreator({ type: 'checkbox', id: 'del-def' }).getElement();
    this.countryInputContainer = new FormInputCountryCreator('country');
    this.cityInputContainer = new FormInputCreator({ placeholder: 'city', validation: validateOnlyLetters });
    this.streetInputContainer = new FormInputCreator({ placeholder: 'street', validation: validateOnlyLetters });
    this.postalCodeInputContainer = new FormInputCreator({
      placeholder: 'postal code',
      checkInput: this.countryInputContainer.getInput(),
      validation: validatePostalCode,
    });

    this.setHandlers();
  }

  createContent(): HTMLElement {
    const container = new ElementCreator({ tag: 'div' });
    const { addressesList } = this;

    if (!addressesList.length) return container.getElement();

    const defaultObj = addressesList.find((address) => address.id === this.defaultAddressId);

    if (defaultObj) {
      addressesList.splice(addressesList.indexOf(defaultObj), 1);
    }

    const defaultAddress = defaultObj
      ? `${codeCountries[defaultObj.country]} ${defaultObj.city} ${defaultObj.streetName} ${defaultObj.postalCode}`
      : '';

    const addresses = addressesList.map((address) => {
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
      const anotherContainer = new ElementCreator({ tag: 'div', classes: 'mt-3' });
      anotherContainer.appendNode(new ElementCreator({ tag: 'div', text: 'another addresses', classes: 'opacity-60 h5' }));
      addresses.forEach((address) => {
        anotherContainer.appendNode(new ElementCreator({ tag: 'div', text: address, classes: 'text-xs font-medium' }));
      });
      container.appendNode(anotherContainer);
    }
    return container.getElement();
  }

  createChangeAddressContainer(): HTMLElement {
    const changeContainer = new ElementCreator({ tag: 'div', classes: 'change-addresses flex flex-col gap-4' });
    const selectContainer = new ElementCreator({ tag: 'div' });

    if (!this.addressesList.length) return changeContainer.getElement();

    const changeTitle = new ElementCreator({ tag: 'div', text: 'change address', classes: 'opacity-60 h5' }).getElement();

    const emptyOption = new ElementOptionCreator({ tag: 'option', value: '', hidden: true });
    this.changeSelect.appendNode(emptyOption);

    this.addressesList.forEach((address) => {
      const isDefault = address.id === this.defaultAddressId;
      const country = codeCountries[address.country];
      const fullAddress = `${country} ${address.city} ${address.streetName} ${address.postalCode} ${
        isDefault ? '(✔ default)' : ''
      }`;
      const option = new ElementOptionCreator({ tag: 'option', text: fullAddress, value: address.id || '' });
      this.changeSelect.appendNode(option);
    });

    selectContainer.appendNode(changeTitle, this.changeSelect);
    changeContainer.appendNode(selectContainer);
    return changeContainer.getElement();
  }

  createNewAddressContainer(): HTMLElement {
    const newContainer = new ElementCreator({ tag: 'div', classes: 'new-addresses flex flex-col' });
    const addAddress = new ElementCreator({ tag: 'div', classes: 'flex items-center gap-2 cursor-pointer', html: plus });
    const addAddressTitle = new ElementCreator({ tag: 'div', text: 'add new address', classes: 'text-primary-color' });

    addAddress.appendNode(addAddressTitle);
    newContainer.appendNode(addAddress);

    addAddress.setHandler('click', () => this.handleAddAddress());

    return newContainer.getElement();
  }

  handleAddAddress(): void {
    this.saveButton.disabled = true;

    const changeContainer = this.getElement().querySelector('.change-addresses');
    if (changeContainer) changeContainer.remove();

    const newContainer = this.getElement().querySelector('.new-addresses');
    const newTitle = new ElementCreator({ tag: 'h5', classes: 'h5 opacity-60', text: 'new address' }).getElement();

    if (newContainer) {
      newContainer.innerHTML = '';
      newContainer.append(newTitle, this.createInputsContainer());
    }
  }

  handleSelectChange(): void {
    const currentId = this.changeSelect.getElement().value;
    console.log('currentId', currentId);
    console.log('this.addressesList', this.addressesList);

    const currentAddress = this.addressesList.find((addr) => addr.id === currentId);

    if (currentId === this.defaultAddressId) {
      this.makeDefaultCheckbox.checked = true;
      this.makeDefaultCheckbox.disabled = true;
    } else {
      this.makeDefaultCheckbox.checked = false;
      this.makeDefaultCheckbox.disabled = false;
    }

    const container = this.createInputsContainer(currentAddress);
    const existingContainer = this.getElement().querySelector('.change-addresses');

    if (existingContainer) {
      existingContainer.append(container);
    }
  }

  createEdit(): HTMLElement {
    this.resetInputs();

    const container = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    container.appendNode(this.createChangeAddressContainer());

    const newContainer = this.createNewAddressContainer();
    container.appendNode(newContainer);

    return container.getElement();
  }

  createInputsContainer(address?: Address): HTMLElement {
    const wrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
    });

    const checkboxContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm' });
    const label = new ElementLabelCreator({ text: 'set as default address', for: 'del-def' });
    checkboxContainer.appendNode(this.makeDefaultCheckbox, label);

    inputsContainer.setHandler('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.validateAddressesInputs();
        this.validateSaveButton();
      }
    });

    inputsContainer.appendNode(
      this.countryInputContainer.getContainer(),
      this.cityInputContainer.getContainer(),
      this.streetInputContainer.getContainer(),
      this.postalCodeInputContainer.getContainer(),
    );

    if (address) {
      this.countryInputContainer.setInputValue(codeCountries[address.country]);
      if (address.city) this.cityInputContainer.setInputValue(address.city);
      if (address.streetName) this.streetInputContainer.setInputValue(address.streetName);
      if (address.postalCode) this.postalCodeInputContainer.setInputValue(address.postalCode);

      const deleteButton = new ElementButtonCreator({ html: trash, classes: 'self-end md: self-center' });
      deleteButton.setHandler('click', () => this.deleteAddress());

      inputsContainer.appendNode(deleteButton);
    } else {
      this.resetInputs();
    }

    return wrapper.appendNode(inputsContainer, checkboxContainer).getElement();
  }

  async deleteAddress(): Promise<void> {
    const selectedAddressId = this.changeSelect.getElement().value;

    try {
      await this.consumer.removeAddress(selectedAddressId);
      new Message('Address has been removed.', 'info').showMessage();

      this.resetState();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message) {
          new Message(err.message, 'error').showMessage();
        } else {
          new Message('Something went wrong. Try later.', 'error').showMessage();
        }
      }
    }
  }

  validateAddressesInputs(): void {
    this.countryInputContainer.validateInput(validateCountry);
    this.postalCodeInputContainer.validateInput(validatePostalCode);
    this.cityInputContainer.validateInput(validateOnlyLetters);
    this.streetInputContainer.validateInput(isValueExist);
  }

  async saveChanges(): Promise<void> {
    const selectedAddressId = this.changeSelect.getElement().value;

    const country = countryCodes[this.countryInputContainer.getInputValue()];
    const city = this.cityInputContainer.getInputValue();
    const streetName = this.streetInputContainer.getInputValue();
    const postalCode = this.postalCodeInputContainer.getInputValue();
    const isDefault = this.makeDefaultCheckbox.checked;

    try {
      if (selectedAddressId) {
        await this.consumer.changeAddress(selectedAddressId, country, city, streetName, postalCode);
        new Message('Address has been updated.', 'info').showMessage();

        if (isDefault && !this.isBilling) {
          await this.consumer.setDefaultShippingAddress(selectedAddressId);
        }

        if (isDefault && this.isBilling) {
          await this.consumer.setDefaultBillingAddress(selectedAddressId);
        }
      } else {
        await this.consumer.addAddress(country, city, streetName, postalCode);
        new Message('Address has been added.', 'info').showMessage();

        const addressId = this.consumer.consumerData?.addresses.at(-1)?.id;

        if (this.isBilling && addressId) {
          if (isDefault) {
            await this.consumer.setDefaultBillingAddress(addressId);
          } else {
            await this.consumer.addBillingAddressId(addressId);
          }
        }

        if (!this.isBilling && addressId) {
          if (isDefault) {
            await this.consumer.setDefaultShippingAddress(addressId);
          } else {
            await this.consumer.addShippingAddressId(addressId);
          }
        }
      }

      this.resetState();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message) {
          new Message(err.message, 'error').showMessage();
        } else {
          new Message('Something went wrong. Try later.', 'error').showMessage();
        }
      }
    }
  }

  setHandlers(): void {
    this.changeSelect.setHandler('change', () => this.handleSelectChange());
    this.makeDefaultCheckbox.addEventListener('change', () => this.validateSaveButton());
  }

  resetInputs(): void {
    this.makeDefaultCheckbox.checked = false;
    this.makeDefaultCheckbox.disabled = false;
    this.changeSelect.getElement().innerHTML = '';
    this.countryInputContainer.setInputValue('');
    this.cityInputContainer.setInputValue('');
    this.streetInputContainer.setInputValue('');
    this.postalCodeInputContainer.setInputValue('');
  }
}
