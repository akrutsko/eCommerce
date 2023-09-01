import { Address } from '@commercetools/platform-sdk';
import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { codeCountries } from '../../../data/country-codes';
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

  changeSelect: ElementCreator<HTMLElement>;

  temporalKey: number;

  countryInputContainer: FormInputCountryCreator;

  cityInputContainer: FormInputCreator;

  streetInputContainer: FormInputCreator;

  postalCodeInputContainer: FormInputCreator;

  constructor(consumer: Consumer, svg: string, heading: string, tabType: Addresses) {
    super(consumer, svg, heading);
    this.changeSelect = new ElementCreator({ tag: 'select', classes: 'form-input' });
    this.countryInputContainer = new FormInputCountryCreator('country');
    this.cityInputContainer = new FormInputCreator({ placeholder: 'city', validation: validateOnlyLetters });
    this.streetInputContainer = new FormInputCreator({ placeholder: 'street', validation: validateOnlyLetters });
    this.postalCodeInputContainer = new FormInputCreator({
      placeholder: 'postal code',
      checkInput: this.countryInputContainer.getInput(),
      validation: validatePostalCode,
    });
    this.tabType = tabType;

    this.temporalKey = 0;
    this.newAddresses = [];
    this.currentAddresses = [];
  }

  createContent(): HTMLElement {
    const container = new ElementCreator({ tag: 'div' });
    const addressesList = this.getAddressesList();
    const defaultId = this.getDefaultAddressId();

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
    this.changeSelect.getElement().innerHTML = '';

    const container = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    const addressesList = this.getAddressesList();
    const defaultId = this.getDefaultAddressId();

    let changeContainer: ElementCreator<HTMLElement> | null = null;

    if (addressesList) {
      changeContainer = new ElementCreator({ tag: 'div', classes: 'cnange-addresses' });
      const changeTitle = new ElementCreator({ tag: 'div', text: 'change address', classes: 'opacity-60 h5' }).getElement();

      const emptyOption = new ElementOptionCreator({ tag: 'option', value: '', hidden: true });
      this.changeSelect.appendNode(emptyOption);
      addressesList.forEach((address) => {
        const isDefault = address.id === defaultId;
        const country = codeCountries[address.country];
        const fullAddress = `${country} ${address.city} ${address.streetName} ${address.postalCode} ${
          isDefault ? '(✔ default)' : ''
        }`;
        const option = new ElementOptionCreator({ tag: 'option', value: fullAddress, id: address.id });
        this.changeSelect.appendNode(option);
      });
      changeContainer.appendNode(changeTitle, this.changeSelect);

      container.appendNode(changeContainer);
    }
    let newContainer: ElementCreator<HTMLElement> | null = new ElementCreator({
      tag: 'div',
      classes: 'new-addresses flex flex-col gap-4',
    });
    const addAddress = new ElementCreator({ tag: 'div', classes: 'flex items-center gap-2 cursor-pointer', html: plus });
    const addAddressTitle = new ElementCreator({ tag: 'div', text: 'add new address', classes: 'text-primary-color' });
    addAddress.appendNode(addAddressTitle);
    newContainer.appendNode(addAddress);
    container.appendNode(newContainer);

    addAddress.getElement().addEventListener('click', () => {
      this.saveButton.disabled = true;
      if (changeContainer) {
        container.getElement().removeChild(changeContainer.getElement());
        changeContainer = null;
      }
      if (newContainer) {
        newContainer.getElement().innerHTML = '';
        newContainer.appendNode(this.createInputsContainer(container.getElement()));
      }
    });
    this.changeSelect.setHandler('change', () => {
      if (newContainer) {
        container.getElement().removeChild(newContainer.getElement());
        newContainer = null;
      }
      this.createInputsContainer(container.getElement());
    });

    return container.getElement();
  }

  createInputsContainer(container: HTMLElement, address?: Address): HTMLElement {
    this.temporalKey += 1;

    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
      id: address?.id || this.temporalKey.toString(),
    });

    if (address) {
      this.countryInputContainer.setInputValue(codeCountries[address.country]);
      if (address.city) this.cityInputContainer.setInputValue(address.city);
      if (address.streetName) this.streetInputContainer.setInputValue(address.streetName);
      if (address.postalCode) this.postalCodeInputContainer.setInputValue(address.postalCode);
    } else {
      this.resetInputs();
    }

    inputsContainer.getElement().addEventListener('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.validateSaveButton();
      }
    });

    const deleteButton = new ElementButtonCreator({ html: trash, classes: 'self-end md: self-center' });
    deleteButton.getElement().addEventListener('click', () => {
      const addressId = inputsContainer.getElement().id;

      if (this.currentAddresses.find((addr) => addr.id === addressId)) {
        // this.actions.push({
        //   action: 'removeAddress',
        //   addressId: `${inputsContainer.getElement().id}`,
        // });
        this.currentAddresses = this.currentAddresses.filter((addr) => addr.id !== inputsContainer.getElement().id);
      } else {
        this.newAddresses = this.newAddresses.filter((addr) => addr.id !== inputsContainer.getElement().id);
      }

      const parrentContainer = address ? '.change-addresses' : '.new-addresses';

      container.querySelector(parrentContainer)?.removeChild(inputsContainer.getElement());

      // if (!this.currentAddresses.length && defaultContainer) {
      //   container.removeChild(defaultContainer);
      // }
    });

    inputsContainer.appendNode(
      this.countryInputContainer.getContainer(),
      this.cityInputContainer.getContainer(),
      this.streetInputContainer.getContainer(),
      this.postalCodeInputContainer.getContainer(),
      deleteButton,
    );

    return inputsContainer.getElement();
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

  resetInputs(): void {
    this.countryInputContainer.setInputValue('');
    this.cityInputContainer.setInputValue('');
    this.streetInputContainer.setInputValue('');
    this.postalCodeInputContainer.setInputValue('');
  }

  getAddressesList(): Address[] | undefined {
    if (!this.consumer.consumerData) return undefined;
    if (this.tabType === Addresses.Billing) {
      return this.consumer.consumerData.addresses.filter(
        (addr) => addr.id && this.consumer.consumerData?.billingAddressIds?.includes(addr.id),
      );
    }
    return this.consumer.consumerData.addresses.filter(
      (addr) => addr.id && this.consumer.consumerData?.shippingAddressIds?.includes(addr.id),
    );
  }

  getDefaultAddressId(): string | undefined {
    if (this.tabType === Addresses.Billing) return this.consumer.consumerData?.defaultBillingAddressId;
    return this.consumer.consumerData?.defaultShippingAddressId;
  }
}
