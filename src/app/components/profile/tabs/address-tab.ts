import { Address } from '@commercetools/platform-sdk';

import trash from '../../../../assets/svg/trash.svg';
import plus from '../../../../assets/svg/plus.svg';

import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { codeCountries } from '../../../data/country-codes';
import { ElementOptionCreator } from '../../../utils/element-creator/element-option-creator';
import { FormInputCountryCreator } from '../../../utils/element-creator/form-country-input-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { validateOnlyLetters, validatePostalCode } from '../../../utils/validation/input-validation';
import { ElementButtonCreator } from '../../../utils/element-creator/element-button-creator';
import { Addresses } from '../../../enums/addresses';
import { Consumer } from '../../consumer/consumer';
import { ElementLabelCreator } from '../../../utils/element-creator/element-label-creator';
import { ElementInputCreator } from '../../../utils/element-creator/element-input-creator';
import { ElementSelectCreator } from '../../../utils/element-creator/element-selector-creator';

export class AddressTab extends AccordionTab {
  tabType: Addresses;

  countryInputContainer: FormInputCountryCreator;

  cityInputContainer: FormInputCreator;

  streetInputContainer: FormInputCreator;

  postalCodeInputContainer: FormInputCreator;

  changeSelect: ElementSelectCreator;

  saveCheckbox: HTMLInputElement;

  defaultId: string | undefined;

  addressesList: Address[] | undefined;

  constructor(consumer: Consumer, svg: string, heading: string, tabType: Addresses) {
    super(consumer, svg, heading);
    this.tabType = tabType;
    this.changeSelect = new ElementSelectCreator({ classes: 'form-input' });
    this.saveCheckbox = new ElementInputCreator({ type: 'checkbox', id: 'del-def' }).getElement();
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
    this.getAddressesList();
    this.getDefaultAddressId();

    if (this.addressesList) {
      const defaultObj = this.addressesList?.find((address) => address.id === this.defaultId);

      if (defaultObj) {
        this.addressesList.splice(this.addressesList.indexOf(defaultObj), 1);
      }

      const defaultAddress = defaultObj
        ? `${codeCountries[defaultObj.country]} ${defaultObj.city} ${defaultObj.streetName} ${defaultObj.postalCode}`
        : '';

      const addresses = this.addressesList?.map((address) => {
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
    }
    return container.getElement();
  }

  createChangeAddressContainer(): HTMLElement | null {
    if (!this.addressesList) {
      return null;
    }

    const changeContainer = new ElementCreator({ tag: 'div', classes: 'change-addresses' });
    const changeTitle = new ElementCreator({ tag: 'div', text: 'change address', classes: 'opacity-60 h5' }).getElement();

    const emptyOption = new ElementOptionCreator({ tag: 'option', value: '', hidden: true });
    this.changeSelect.appendNode(emptyOption);

    this.addressesList.forEach((address) => {
      const isDefault = address.id === this.defaultId;
      const country = codeCountries[address.country];
      const fullAddress = `${country} ${address.city} ${address.streetName} ${address.postalCode} ${
        isDefault ? '(✔ default)' : ''
      }`;
      const option = new ElementOptionCreator({ tag: 'option', value: fullAddress, id: address.id });
      this.changeSelect.appendNode(option);
    });

    changeContainer.appendNode(changeTitle, this.changeSelect);
    return changeContainer.getElement();
  }

  createNewAddressContainer(): HTMLElement {
    const newContainer = new ElementCreator({ tag: 'div', classes: 'new-addresses flex flex-col gap-4' });
    const addAddress = new ElementCreator({ tag: 'div', classes: 'flex items-center gap-2 cursor-pointer', html: plus });
    const addAddressTitle = new ElementCreator({ tag: 'div', text: 'add new address', classes: 'text-primary-color' });

    addAddress.appendNode(addAddressTitle);
    newContainer.appendNode(addAddress);

    addAddress.setHandler('click', () => this.handleAddAddress());

    return newContainer.getElement();
  }

  handleAddAddress(): void {
    this.saveButton.disabled = true;

    const changeContainer = document.querySelector('.change-addresses');
    if (changeContainer) changeContainer.remove();

    const newContainer = document.querySelector('.new-addresses');
    if (newContainer) {
      newContainer.innerHTML = '';
      newContainer.append(this.createInputsContainer());
    }
  }

  handleSelectChange(): void {
    const select = this.changeSelect.getElement();
    const selectValue = select.value;
    const currentId = select.querySelector(`option[value="${selectValue}"]`)?.id;
    const currentAddress = this.addressesList?.find((addr) => addr.id === currentId);

    if (currentId === this.defaultId) {
      this.saveCheckbox.checked = true;
    }

    const container = this.createInputsContainer(currentAddress);

    const existingContainer = document.querySelector('.new-addresses');
    if (existingContainer) {
      existingContainer.innerHTML = '';
      existingContainer.appendChild(container);
    }
  }

  createEdit(): HTMLElement {
    this.resetInputs();
    this.getAddressesList();
    this.getDefaultAddressId();

    const container = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });

    const changeContainer = this.createChangeAddressContainer();
    if (changeContainer) container.appendNode(changeContainer);

    const newContainer = this.createNewAddressContainer();
    container.appendNode(newContainer);

    return container.getElement();
  }

  createInputsContainer(address?: Address): HTMLElement {
    const wrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
      id: address?.id,
    });

    const checkboxContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm' });
    const label = new ElementLabelCreator({ text: 'set as default address', for: 'del-def' });
    checkboxContainer.appendNode(this.saveCheckbox, label);

    inputsContainer.setHandler('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
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
      deleteButton.setHandler('click', () => this.handleDeleteAddresInputs(wrapper.getElement(), address));

      inputsContainer.appendNode(deleteButton);
    }

    return wrapper.appendNode(inputsContainer, checkboxContainer).getElement();
  }

  handleDeleteAddresInputs(wrapper: HTMLElement, address: Address): void {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const userConfirm = confirm('Are you sure that you want to delete this address?');
    if (userConfirm) wrapper.remove();

    const option = this.changeSelect.getElement().querySelector(`option#${address.id}`);
    option?.remove();

    this.validateSaveButton();
  }

  // setActions(): void {
  //   this.newAddresses.forEach((addr) => {
  //     const action: CustomerAddAddressAction = {
  //       action: 'addAddress',
  //       address: {
  //         country: countryCodes[addr.countryInput.value],
  //         city: addr.cityInput.value,
  //         streetName: addr.streetInput.value,
  //         postalCode: addr.postalCodeInput.value,
  //       },
  //     };
  //     this.actions.push(action);
  //   });
  //   this.currentAddresses.forEach((addr) => {
  //     const action: CustomerChangeAddressAction = {
  //       action: 'changeAddress',
  //       addressId: addr.id,
  //       address: {
  //         country: countryCodes[addr.countryInput.value],
  //         city: addr.cityInput.value,
  //         streetName: addr.streetInput.value,
  //         postalCode: addr.postalCodeInput.value,
  //       },
  //     };
  //     this.actions.push(action);
  //   });
  // }

  async saveChanges(): Promise<void> {
    // TODO: implement API
  }

  setHandlers(): void {
    this.changeSelect.setHandler('change', () => this.handleSelectChange());
    this.saveCheckbox.addEventListener('change', () => this.validateSaveButton());
  }

  resetInputs(): void {
    this.saveCheckbox.checked = false;
    this.changeSelect.getElement().innerHTML = '';
    this.countryInputContainer.setInputValue('');
    this.cityInputContainer.setInputValue('');
    this.streetInputContainer.setInputValue('');
    this.postalCodeInputContainer.setInputValue('');
  }

  getAddressesList(): void {
    const data = this.consumer.consumerData;
    if (!data) return;

    const isBilling = this.tabType === Addresses.Billing;
    const addressIds = isBilling ? data.billingAddressIds : data.shippingAddressIds;
    this.addressesList = data.addresses.filter((addr) => addr.id && addressIds?.includes(addr.id));
  }

  getDefaultAddressId(): void {
    const data = this.consumer.consumerData;
    if (!data) return;

    const isBilling = this.tabType === Addresses.Billing;
    this.defaultId = isBilling ? data.defaultBillingAddressId : data.defaultShippingAddressId;
  }
}
