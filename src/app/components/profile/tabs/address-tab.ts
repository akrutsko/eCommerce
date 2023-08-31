import { Address, CustomerAddAddressAction, CustomerChangeAddressAction } from '@commercetools/platform-sdk';
import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { codeCountries, countryCodes } from '../../../data/country-codes';
import { ElementOptionCreator } from '../../../utils/element-creator/element-option-creator';
import { FormInputCountryCreator } from '../../../utils/element-creator/form-country-input-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { validateOnlyLetters, validatePostalCode } from '../../../utils/validation/input-validation';
import { ElementButtonCreator } from '../../../utils/element-creator/element-button-creator';
import trash from '../../../../assets/svg/trash.svg';
import plus from '../../../../assets/svg/plus.svg';
import { Addresses } from '../../../enums/addresses';
import { Consumer } from '../../consumer/consumer';

interface AddressInputs {
  id: string;
  countryInput: HTMLInputElement;
  cityInput: HTMLInputElement;
  streetInput: HTMLInputElement;
  postalCodeInput: HTMLInputElement;
}

export class AddressTab extends AccordionTab {
  tabType: Addresses;

  newAddresses: AddressInputs[];

  currentAddresses: AddressInputs[];

  defaultSelect: ElementCreator<HTMLElement>;

  temporalKey: number;

  constructor(consumer: Consumer, svg: string, heading: string, tabType: Addresses) {
    super(consumer, svg, heading);
    this.defaultSelect = new ElementCreator({ tag: 'select', classes: 'form-input' });
    this.tabType = tabType;
    this.temporalKey = 0;
    this.newAddresses = [];
    this.currentAddresses = [];
  }

  createContent(): HTMLElement {
    const container = new ElementCreator({ tag: 'div' });
    const addressesList = this.getAddressesList(this.tabType);
    const defaultId = this.getDefaultAddressId(this.tabType);

    if (addressesList) {
      const defaultObj = addressesList?.find((address) => address.id === defaultId);

      if (defaultObj) {
        addressesList.splice(addressesList.indexOf(defaultObj), 1);
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

  createEdit(): HTMLElement {
    this.temporalKey = 0;
    this.newAddresses = [];
    this.currentAddresses = [];

    const container = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    const addressesList = this.getAddressesList(this.tabType);
    const defaultId = this.getDefaultAddressId(this.tabType);

    if (addressesList) {
      const defaultContainer = new ElementCreator({ tag: 'div', classes: 'default flex flex-col gap-4' });
      const defaultObj = addressesList.find((address) => address.id === defaultId);
      const defaultAddress = defaultObj
        ? `${codeCountries[defaultObj.country]} ${defaultObj.city} ${defaultObj.streetName} ${defaultObj.postalCode}`
        : '';

      const defaultTitle = new ElementCreator({ tag: 'div', text: 'default address', classes: 'opacity-60 h5' }).getElement();
      if (!defaultAddress && addressesList.length) {
        const option = new ElementOptionCreator({ tag: 'option', value: '', hidden: true });
        this.defaultSelect.appendNode(option);
      }
      addressesList.forEach((address) => {
        const country = codeCountries[address.country];
        const fullAddress = `${country} ${address.city} ${address.streetName} ${address.postalCode}`;
        const option = new ElementOptionCreator({ tag: 'option', value: fullAddress, id: address.id });
        this.defaultSelect.appendNode(option);
      });
      defaultContainer.appendNode(defaultTitle, this.defaultSelect);

      const allContainer = new ElementCreator({ tag: 'div', classes: 'all flex flex-col gap-4' });

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
      let allContainer = container.getElement().querySelector('.all');
      if (!allContainer) allContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' }).getElement();
      allContainer.append(this.createInputsContainer(container.getElement()));
    });
    container.appendNode(addAddress);

    return container.getElement();
  }

  createInputsContainer(container: HTMLElement, address?: Address): HTMLElement {
    this.temporalKey += 1;
    const array = address ? this.currentAddresses : this.newAddresses;

    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
      id: address?.id || this.temporalKey.toString(),
    });

    const countryInputContainer = new FormInputCountryCreator('country');
    const cityInputContainer = new FormInputCreator({ placeholder: 'city', validation: validateOnlyLetters });
    const streetInputContainer = new FormInputCreator({ placeholder: 'street', validation: validateOnlyLetters });
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

    inputsContainer.getElement().addEventListener('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.validateSaveButton();
      }
    });

    const deleteButton = new ElementButtonCreator({ html: trash, classes: 'self-end md: self-center' });
    deleteButton.getElement().addEventListener('click', () => {
      const defaultContainer = container.querySelector('.default');
      const allContainer = container.querySelector('.all');
      const addressId = inputsContainer.getElement().id;

      if (this.currentAddresses.find((addr) => addr.id === addressId)) {
        this.actions.push({
          action: 'removeAddress',
          addressId: `${inputsContainer.getElement().id}`,
        });
        this.currentAddresses = this.currentAddresses.filter((addr) => addr.id !== inputsContainer.getElement().id);
      } else {
        this.newAddresses = this.newAddresses.filter((addr) => addr.id !== inputsContainer.getElement().id);
      }

      allContainer?.removeChild(inputsContainer.getElement());

      if (!this.currentAddresses.length && defaultContainer) {
        container.removeChild(defaultContainer);
      }
    });

    array.push({
      id: address?.id || this.temporalKey.toString(),
      countryInput: countryInputContainer.getInput(),
      cityInput: cityInputContainer.getInput(),
      streetInput: streetInputContainer.getInput(),
      postalCodeInput: postalCodeInputContainer.getInput(),
    });

    inputsContainer.appendNode(
      countryInputContainer.getContainer(),
      cityInputContainer.getContainer(),
      streetInputContainer.getContainer(),
      postalCodeInputContainer.getContainer(),
      deleteButton,
    );

    return inputsContainer.getElement();
  }

  setActions(): void {
    this.newAddresses.forEach((addr) => {
      const action: CustomerAddAddressAction = {
        action: 'addAddress',
        address: {
          country: countryCodes[addr.countryInput.value],
          city: addr.cityInput.value,
          streetName: addr.streetInput.value,
          postalCode: addr.postalCodeInput.value,
        },
      };
      this.actions.push(action);
    });
    this.currentAddresses.forEach((addr) => {
      const action: CustomerChangeAddressAction = {
        action: 'changeAddress',
        addressId: addr.id,
        address: {
          country: countryCodes[addr.countryInput.value],
          city: addr.cityInput.value,
          streetName: addr.streetInput.value,
          postalCode: addr.postalCodeInput.value,
        },
      };
      this.actions.push(action);
    });
  }

  async saveChanges(): Promise<void> {
    this.setActions();

    await super.saveChanges();
  }

  getAddressesList(tab: Addresses): Address[] | undefined {
    if (!this.consumer.consumer) return undefined;
    if (tab === Addresses.Billing) {
      return this.consumer.consumer.addresses.filter(
        (addr) => addr.id && this.consumer.consumer?.billingAddressIds?.includes(addr.id),
      );
    }
    return this.consumer.consumer.addresses.filter(
      (addr) => addr.id && this.consumer.consumer?.shippingAddressIds?.includes(addr.id),
    );
  }

  getDefaultAddressId(tab: Addresses): string | undefined {
    if (tab === Addresses.Billing) return this.consumer.consumer?.defaultBillingAddressId;
    return this.consumer.consumer?.defaultShippingAddressId;
  }

  updateCustomer(): Promise<void> {
    return super.updateCustomer();
  }
}
