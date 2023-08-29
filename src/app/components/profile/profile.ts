import { Address, Customer } from '@commercetools/platform-sdk';
import { Consumer } from '../consumer/consumer';
import { codeCountries } from '../../data/country-codes';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import info from '../../../assets/svg/info.svg';
import delivery from '../../../assets/svg/delivery.svg';
import login from '../../../assets/svg/login.svg';
import billing from '../../../assets/svg/billing.svg';
import key from '../../../assets/svg/key.svg';
import trash from '../../../assets/svg/trash.svg';
import plus from '../../../assets/svg/plus.svg';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { FormInputCreator } from '../../utils/element-creator/form-input-creator';
import { ElementOptionCreator } from '../../utils/element-creator/element-option-creator';
import { FormInputCountryCreator } from '../../utils/element-creator/form-country-input-creator';
import { Router } from '../../router/router';
import * as validator from '../../utils/validation/input-validation';
import { AccordionTab } from './tab';
import { FormInputBirthdateCreator } from '../../utils/element-creator/form-birthdate-inputCreator';

enum Addresses {
  Billing,
  Shipping,
}

export class Profile {
  profileView: ElementCreator<HTMLElement>;

  router: Router;

  consumerData: Customer | null;

  constructor(router: Router, consumer: Consumer) {
    this.router = router;
    this.consumerData = consumer.consumer;
    this.profileView = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] rounded-xl w-full flex-1 p-5 md:p-10 relative' });
    this.createView();
    this.handleAccordion();
  }

  createView(): void {
    const title = new ElementCreator({ tag: 'h2', text: 'My account', classes: 'text-center' });

    const accordion = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-6 mt-5' });

    if (this.consumerData) {
      const personalTab = new AccordionTab(
        this.consumerData,
        info,
        'Personal info',
        this.createPersonalContent.bind(this),
        this.createPersonalEdit.bind(this),
      ).getElement();
      const deliveryTab = new AccordionTab(
        this.consumerData,
        delivery,
        'Delivery addresses',
        this.createAddressContent.bind(this, Addresses.Shipping),
        this.createAddressEdit.bind(this, Addresses.Shipping),
      ).getElement();
      const billingTab = new AccordionTab(
        this.consumerData,
        billing,
        'Billing addresses',
        this.createAddressContent.bind(this, Addresses.Billing),
        this.createAddressEdit.bind(this, Addresses.Billing),
      ).getElement();
      const loginTab = new AccordionTab(
        this.consumerData,
        login,
        'Login info',
        this.createLoginContent.bind(this),
        this.createLoginEdit.bind(this),
      ).getElement();

      const changePasswordLink = new ElementCreator({ tag: 'div', classes: 'flex gap-1 items-center', html: key });
      const changePasswordText = new ElementAnchorCreator({
        href: '#',
        classes: 'text-primary-color text-xs font-medium',
        text: 'Change password',
      });

      changePasswordLink.appendNode(changePasswordText);
      accordion.appendNode(personalTab, deliveryTab, billingTab, loginTab, changePasswordLink);
    }

    this.profileView.appendNode(title, accordion);
  }

  handleAccordion(): void {
    const headers = this.getElement().querySelectorAll('.ac-header');
    headers.forEach((header) => {
      header.addEventListener('click', () => {
        header.nextElementSibling?.classList.toggle('hidden');
      });
    });
  }

  createLoginContent(): HTMLElement {
    if (!this.consumerData) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' });
    const email = new ElementCreator({ tag: 'div', text: this.consumerData.email, classes: 'text-xs font-medium' });

    container.appendNode(emailTitle, email);
    return container.getElement();
  }

  createLoginEdit(): HTMLElement {
    if (!this.consumerData) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' }).getElement();
    const emailInputContainer = new FormInputCreator({
      placeholder: 'email',
      containerClasses: 'relative w-full',
      validationCallback: validator.validateEmail,
    });

    if (this.consumerData.email) emailInputContainer.setInputValue(this.consumerData.email);
    container.appendNode(emailTitle, emailInputContainer.getContainer());
    return container.getElement();
  }

  createPersonalContent(): HTMLElement {
    if (!this.consumerData) throw new Error('consumerData is undefined');

    const nameContainer = new ElementCreator({ tag: 'div' });
    const nameTitle = new ElementCreator({ tag: 'div', text: 'name', classes: 'opacity-60 h5' });
    const name = new ElementCreator({
      tag: 'div',
      text: this.consumerData.firstName,
      classes: 'data-field text-xs font-medium',
    });
    nameContainer.appendNode(nameTitle, name);

    const surnameContainer = new ElementCreator({ tag: 'div' });
    const surnameTitle = new ElementCreator({ tag: 'div', text: 'surname', classes: 'opacity-60 h5' });
    const surname = new ElementCreator({
      tag: 'div',
      text: this.consumerData.lastName,
      classes: 'data-field text-xs font-medium',
    });
    surnameContainer.appendNode(surnameTitle, surname);

    const dateContainer = new ElementCreator({ tag: 'div' });
    const dateTitle = new ElementCreator({ tag: 'div', text: 'date of birth', classes: 'opacity-60 h5' });

    const date = new ElementCreator({
      tag: 'div',
      text: this.consumerData.dateOfBirth,
      classes: 'data-field text-xs font-medium',
    });
    dateContainer.appendNode(dateTitle, date);

    const personalInfoContainer = new ElementCreator({ tag: 'div', classes: 'flex justify-between' });
    personalInfoContainer.appendNode(nameContainer, surnameContainer, dateContainer);

    return personalInfoContainer.getElement();
  }

  createPersonalEdit(): HTMLElement {
    const content = new ElementCreator({ tag: 'div' });

    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
    });

    const nameInputContainer = new FormInputCreator({
      placeholder: 'name',
      containerClasses: 'relative w-full',
      validationCallback: validator.validateOnlyLetters,
    });
    const surnameInputContainer = new FormInputCreator({
      placeholder: 'surname',
      containerClasses: 'relative w-full',
      validationCallback: validator.validateOnlyLetters,
    });
    const dateInputContainer = new FormInputBirthdateCreator('relative w-full');

    nameInputContainer.addLabel('name');
    surnameInputContainer.addLabel('surname');
    dateInputContainer.addLabel('date of birth');

    if (this.consumerData) {
      if (this.consumerData.firstName) nameInputContainer.setInputValue(this.consumerData.firstName);
      if (this.consumerData.lastName) surnameInputContainer.setInputValue(this.consumerData.lastName);
      if (this.consumerData.dateOfBirth) dateInputContainer.setInputValue(this.consumerData.dateOfBirth);
    }

    inputsContainer.appendNode(
      nameInputContainer.getContainer(),
      surnameInputContainer.getContainer(),
      dateInputContainer.getContainer(),
    );

    return content.appendNode(inputsContainer.getElement()).getElement();
  }

  createAddressContent(tab: Addresses): HTMLElement {
    const container = new ElementCreator({ tag: 'div' });
    const addressesList = this.getAddressesList(tab);
    const defaultId = this.getDefaultAddressId(tab);

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

  createAddressEdit(tab: Addresses): HTMLElement {
    const container = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    const addressesList = this.getAddressesList(tab);
    const defaultId = this.getDefaultAddressId(tab);
    let defaultContainer: ElementCreator<HTMLElement> | null = null;
    let anotherContainer: ElementCreator<HTMLElement> | null = null;

    if (addressesList) {
      defaultContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
      const defaultObj = addressesList.find((address) => address.id === defaultId);
      const defaultAddress = defaultObj
        ? `${codeCountries[defaultObj.country]} ${defaultObj.city} ${defaultObj.streetName} ${defaultObj.postalCode}`
        : '';

      const addresses = addressesList.map((address) => {
        const country = codeCountries[address.country];
        return `${country} ${address.city} ${address.streetName} ${address.postalCode}`;
      });

      const defaultTitle = new ElementCreator({ tag: 'div', text: 'default address', classes: 'opacity-60 h5' }).getElement();
      const defaultSelect = new ElementCreator({ tag: 'select', classes: 'form-input' });
      if (!defaultAddress && addresses.length) {
        const option = new ElementOptionCreator({ tag: 'option', value: '', hidden: true });
        defaultSelect.appendNode(option);
      }
      addresses.forEach((address) => {
        const option = new ElementOptionCreator({ tag: 'option', value: address });
        defaultSelect.appendNode(option);
      });
      defaultContainer.appendNode(defaultTitle, defaultSelect);

      anotherContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });

      addressesList.forEach((address) => {
        anotherContainer?.appendNode(this.createAddressInputsContainer(anotherContainer.getElement(), address));
      });

      if (defaultContainer) container.appendNode(defaultContainer);
      if (anotherContainer) container.appendNode(anotherContainer);
    }
    const addAddress = new ElementCreator({ tag: 'div', classes: 'flex items-center gap-2 cursor-pointer', html: plus });
    const addAddressTitle = new ElementCreator({ tag: 'div', text: 'add new address', classes: 'text-primary-color' });
    addAddress.appendNode(addAddressTitle);

    addAddress.getElement().addEventListener('click', () => {
      if (!anotherContainer) anotherContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
      anotherContainer.appendNode(this.createAddressInputsContainer(anotherContainer.getElement()));
    });
    container.appendNode(addAddress);
    return container.getElement();
  }

  createAddressInputsContainer(container: HTMLElement, address?: Address): HTMLElement {
    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
      id: address?.id,
    });
    const countryInputContainer = new FormInputCountryCreator('relative w-full');

    const cityInputContainer = new FormInputCreator({
      placeholder: 'city',
      containerClasses: 'relative w-full',
      validationCallback: validator.validateOnlyLetters,
    });
    const streetInputContainer = new FormInputCreator({
      placeholder: 'street',
      containerClasses: 'relative w-full',
      validationCallback: validator.validateOnlyLetters,
    });
    const postalCodeInputContainer = new FormInputCreator({
      placeholder: 'postal code',
      containerClasses: 'relative w-full',
      checkInput: countryInputContainer.getInput(),
      validationCallback: validator.validatePostalCode,
    });

    if (address) {
      countryInputContainer.setInputValue(codeCountries[address.country]);
      if (address.city) cityInputContainer.setInputValue(address.city);
      if (address.streetName) streetInputContainer.setInputValue(address.streetName);
      if (address.postalCode) postalCodeInputContainer.setInputValue(address.postalCode);
    }

    const deleteButton = new ElementButtonCreator({ html: trash, classes: 'self-end md: self-center' });
    deleteButton.getElement().addEventListener('click', () => {
      container.removeChild(inputsContainer.getElement());
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

  createSaveCancelButton(callback: (tab: string, content: HTMLElement) => void, tab: string, content: HTMLElement): HTMLElement {
    const buttonsContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 mt-3' });
    const saveButton = new ElementButtonCreator({ disabled: true, classes: 'primary-button py-1', text: 'save' });
    const cancelButton = new ElementButtonCreator({ classes: 'secondary-button py-1', text: 'cancel' });
    buttonsContainer.appendNode(saveButton, cancelButton);

    cancelButton.getElement().addEventListener('click', () => {
      callback(tab, content);
    });
    return buttonsContainer.getElement();
  }

  getView(): ElementCreator<HTMLElement> {
    return this.profileView;
  }

  getElement(): HTMLElement {
    return this.profileView.getElement();
  }
}
