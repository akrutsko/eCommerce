import './registration.css';

import { BaseAddress, MyCustomerDraft } from '@commercetools/platform-sdk';

import passwordHide from '../../../assets/svg/passwordHide.svg';
import passwordShow from '../../../assets/svg/passwordShow.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { ElementOptionCreator } from '../../utils/element-creator/element-option-creator';
import { ElementLabelCreator } from '../../utils/element-creator/element-label-creator';
import * as validator from '../../utils/validation/input-validation';
import { ValidationResult } from '../../types/validation-result-type';
import { Router } from '../../router/router';
import { Consumer } from '../consumer/consumer';
import { getCtpClient } from '../../utils/api/api-client';
import { createConsumer } from '../../utils/api/api-consumer';
import { countryCodes } from '../../data/country-codes';
import { HandlerLinks } from '../../router/handler-links';

export class Registration extends HandlerLinks {
  router: Router;

  consumer: Consumer;

  registrationView: ElementCreator<HTMLElement>;

  emailInput: HTMLInputElement;

  nameInput: HTMLInputElement;

  surnameInput: HTMLInputElement;

  birthDayInput: HTMLInputElement;

  passwordInput: HTMLInputElement;

  passwordRepeatInput: HTMLInputElement;

  deliveryCountryInput: HTMLInputElement;

  deliveryCityInput: HTMLInputElement;

  deliveryStreetInput: HTMLInputElement;

  deliveryPostalCodeInput: HTMLInputElement;

  billingCountryInput: HTMLInputElement;

  billingStreetInput: HTMLInputElement;

  billingCityInput: HTMLInputElement;

  billingPostalCodeInput: HTMLInputElement;

  saveDeliveryCheckbox: HTMLInputElement;

  saveBillingCheckbox: HTMLInputElement;

  setSameAddressCheckbox: HTMLInputElement;

  showButton: HTMLButtonElement;

  showRepeatButton: HTMLButtonElement;

  submitButton: HTMLButtonElement;

  constructor(router: Router, consumer: Consumer) {
    super(router);
    this.router = router;
    this.consumer = consumer;

    this.registrationView = new ElementCreator({
      tag: 'div',
      classes: 'registration-form max-w-xl w-full form flex flex-col gap-4 md:gap-6',
    });
    this.emailInput = new ElementInputCreator({ placeholder: 'email', classes: 'form-input' }).getElement();
    this.nameInput = new ElementInputCreator({ placeholder: 'name', classes: 'form-input' }).getElement();
    this.surnameInput = new ElementInputCreator({ placeholder: 'surname', classes: 'form-input' }).getElement();
    this.birthDayInput = new ElementInputCreator({ placeholder: 'birth date', classes: 'form-input' }).getElement();
    this.deliveryCountryInput = new ElementInputCreator({
      placeholder: 'country',
      classes: 'form-input',
      list: 'delivery-country',
    }).getElement();
    this.deliveryCityInput = new ElementInputCreator({ placeholder: 'city', classes: 'form-input' }).getElement();
    this.deliveryStreetInput = new ElementInputCreator({ placeholder: 'street', classes: 'form-input' }).getElement();
    this.deliveryPostalCodeInput = new ElementInputCreator({ placeholder: 'postal code', classes: 'form-input' }).getElement();
    this.saveDeliveryCheckbox = new ElementInputCreator({ type: 'checkbox', disabled: true, id: 'del-def' }).getElement();
    this.setSameAddressCheckbox = new ElementInputCreator({ type: 'checkbox', disabled: true, id: 'del-bil' }).getElement();
    this.billingCountryInput = new ElementInputCreator({
      placeholder: 'country',
      classes: 'form-input',
      list: 'billing-country',
    }).getElement();
    this.billingCityInput = new ElementInputCreator({ placeholder: 'city', classes: 'form-input' }).getElement();
    this.billingStreetInput = new ElementInputCreator({ placeholder: 'street', classes: 'form-input' }).getElement();
    this.billingPostalCodeInput = new ElementInputCreator({ placeholder: 'postal code', classes: 'form-input' }).getElement();
    this.passwordInput = new ElementInputCreator({
      type: 'password',
      placeholder: 'password',
      classes: 'form-input',
    }).getElement();
    this.passwordRepeatInput = new ElementInputCreator({
      type: 'password',
      placeholder: 'repeat password',
      classes: 'form-input',
    }).getElement();
    this.saveBillingCheckbox = new ElementInputCreator({ type: 'checkbox', disabled: true, id: 'bil-def' }).getElement();
    this.submitButton = new ElementButtonCreator({ classes: 'primary-button', text: 'sign up', disabled: true }).getElement();
    this.showButton = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();
    this.showRepeatButton = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();

    this.createView();
    this.handleButtons();
    this.handleInputs();
    this.handleCheckbox();
    this.handleLinks();
  }

  createView(): void {
    const titleContainer = new ElementCreator({ tag: 'div', classes: 'text-center' });
    const title = new ElementCreator({ tag: 'h2', text: "We'd love to have you join us" });
    const subtitle = new ElementCreator({
      tag: 'p',
      classes: 'opacity-60 pt-2',
      text: "Beat yourself and you'll always be first",
    });
    titleContainer.appendNode(title, subtitle);

    const personalInfoContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });
    const personalInfoTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Personal info' });
    const personalInfoFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });

    const emailInputContainer = new ElementCreator({ tag: 'div', classes: 'relative' });
    const emailError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color absolute' });
    emailInputContainer.appendNode(this.emailInput, emailError);

    const nameInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const nameError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color absolute' });
    nameInputContainer.appendNode(this.nameInput, nameError);

    const surnameInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const surnameError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color absolute' });
    surnameInputContainer.appendNode(this.surnameInput, surnameError);

    const birthDayInputContainer = new ElementCreator({ tag: 'div', classes: 'relative' });
    const birthDayError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color absolute' });
    birthDayInputContainer.appendNode(this.birthDayInput, birthDayError);

    personalInfoFlexContainer.appendNode(nameInputContainer, surnameInputContainer);
    personalInfoContainer.appendNode(personalInfoTitle, emailInputContainer, personalInfoFlexContainer, birthDayInputContainer);

    const addressTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Address' });

    const addressDeliveryContainer = new ElementCreator({ tag: 'div', classes: 'delivery-address flex flex-col gap-4 md:gap-5' });
    const addressBillingContainer = new ElementCreator({ tag: 'div', classes: 'billing-address flex flex-col gap-4 md:gap-5' });

    const addressDeliverySubtitle = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Delivery address' });
    const addressDeliveryFirstFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });
    const addressDeliverySecondFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });

    const countryDeliveryInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const countryDeliveryError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    const countryDeliveryList = new ElementCreator({
      tag: 'datalist',
      id: 'delivery-country',
      classes: 'absolute overflow-y-auto bg-gray-100 w-full z-10 max-h-[232px]',
    });
    Object.keys(countryCodes).forEach((country) => {
      const option = new ElementOptionCreator({ tag: 'option', value: country });
      countryDeliveryList.appendNode(option);
    });
    countryDeliveryInputContainer.appendNode(this.deliveryCountryInput, countryDeliveryError, countryDeliveryList);

    const cityDeliveryInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const cityDeliveryError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    cityDeliveryInputContainer.appendNode(this.deliveryCityInput, cityDeliveryError);

    const streetDeliveryInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const streetDeliveryError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    streetDeliveryInputContainer.appendNode(this.deliveryStreetInput, streetDeliveryError);

    const postalDeliveryCodeInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const postalDeliveryCodeError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    postalDeliveryCodeInputContainer.appendNode(this.deliveryPostalCodeInput, postalDeliveryCodeError);

    addressDeliveryFirstFlexContainer.appendNode(countryDeliveryInputContainer, cityDeliveryInputContainer);
    addressDeliverySecondFlexContainer.appendNode(streetDeliveryInputContainer, postalDeliveryCodeInputContainer);

    const deliveryFirstCheckboxContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm' });
    const deliverySecondCheckboxContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm' });
    const deliveryFirstLabel = new ElementLabelCreator({ text: 'set as default address', for: 'del-def' });
    const deliverySecondLabel = new ElementLabelCreator({ text: 'set delivery address as billing address', for: 'del-bil' });

    deliveryFirstCheckboxContainer.appendNode(this.saveDeliveryCheckbox, deliveryFirstLabel);
    deliverySecondCheckboxContainer.appendNode(this.setSameAddressCheckbox, deliverySecondLabel);

    addressDeliveryContainer.appendNode(
      addressDeliverySubtitle,
      addressDeliveryFirstFlexContainer,
      addressDeliverySecondFlexContainer,
      deliveryFirstCheckboxContainer,
      deliverySecondCheckboxContainer,
    );

    const addressBillingSubtitle = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Billing address' });
    const addressBillingFirstFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });
    const addressBillingSecondFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });
    const countryBillingInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const countryBillingError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    const countryBillingList = new ElementCreator({
      tag: 'datalist',
      id: 'billing-country',
      classes: 'absolute overflow-y-auto bg-gray-100 w-full z-10 max-h-[232px]',
    });
    Object.keys(countryCodes).forEach((country) => {
      const option = new ElementOptionCreator({ tag: 'option', value: country });
      countryBillingList.appendNode(option);
    });
    countryBillingInputContainer.appendNode(this.billingCountryInput, countryBillingError, countryBillingList);

    const cityBillingInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const cityBillingError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    cityBillingInputContainer.appendNode(this.billingCityInput, cityBillingError);

    const streetBillingInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const streetBillingError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    streetBillingInputContainer.appendNode(this.billingStreetInput, streetBillingError);

    const postalBillingCodeInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const postalBillingCodeError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    postalBillingCodeInputContainer.appendNode(this.billingPostalCodeInput, postalBillingCodeError);

    addressBillingFirstFlexContainer.appendNode(countryBillingInputContainer, cityBillingInputContainer);
    addressBillingSecondFlexContainer.appendNode(streetBillingInputContainer, postalBillingCodeInputContainer);

    const billingCheckboxContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm' });
    const billingLabel = new ElementLabelCreator({ text: 'set as default address', for: 'bil-def' });

    billingCheckboxContainer.appendNode(this.saveBillingCheckbox, billingLabel);

    addressBillingContainer.appendNode(
      addressBillingSubtitle,
      addressBillingFirstFlexContainer,
      addressBillingSecondFlexContainer,
      billingCheckboxContainer,
    );

    const addressContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });
    addressContainer.appendNode(addressTitle, addressDeliveryContainer, addressBillingContainer);

    const passwordInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    const passwordError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color absolute' });
    passwordInputContainer.appendNode(this.passwordInput, passwordError, this.showButton);

    const passwordRepeatInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    const passwordRepeatError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    passwordRepeatInputContainer.appendNode(this.passwordRepeatInput, passwordRepeatError, this.showRepeatButton);

    const passwordContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });
    const passwordTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Choose password' });
    passwordContainer.appendNode(passwordTitle, passwordInputContainer, passwordRepeatInputContainer);

    const registrationForm = new ElementCreator({ tag: 'form', classes: 'flex flex-col gap-6 md:gap-9' });
    registrationForm.appendNode(personalInfoContainer, addressContainer, passwordContainer, this.submitButton);

    const question = new ElementCreator({ tag: 'div', text: 'Already have an account? ' });
    const signInAnchor = new ElementAnchorCreator({ href: '/login', classes: 'link', text: 'Log in' });
    this.listOfLinks.push(signInAnchor.getElement());
    question.appendNode(signInAnchor);

    this.registrationView.appendNode(titleContainer, registrationForm, question);
  }

  handleButtons(): void {
    this.showButton.addEventListener('click', () => this.changePasswordVisibility(this.showButton, this.passwordInput));
    this.showRepeatButton.addEventListener('click', () => {
      this.changePasswordVisibility(this.showRepeatButton, this.passwordRepeatInput);
    });
    this.submitButton.addEventListener('click', () => this.signUp());
  }

  validateDeliveryAddressesInputs(): void {
    this.validateInput(this.deliveryCountryInput, validator.validateCountry);
    this.validateInput(this.deliveryPostalCodeInput, validator.validatePostalCode, this.deliveryCountryInput);
    this.validateInput(this.deliveryCityInput, validator.validateOnlyLetters);
    this.validateInput(this.deliveryStreetInput, validator.isValueExist);
    this.validateInput(this.deliveryPostalCodeInput, validator.validatePostalCode, this.deliveryCountryInput);

    const isCountryExist = this.deliveryCountryInput.value;
    const isCityExist = this.deliveryCityInput.value;
    const isStreetExist = this.deliveryStreetInput.value;
    const isPostalCodeExist = this.deliveryPostalCodeInput.value;
    if (isCountryExist && isCityExist && isStreetExist && isPostalCodeExist) {
      const addressErrors = this.getElement().querySelectorAll('.delivery-address div.error');
      const showingErrors = [...addressErrors].filter((error) => !error.classList.contains('hidden'));
      this.saveDeliveryCheckbox.disabled = Boolean(showingErrors.length);
      this.setSameAddressCheckbox.disabled = Boolean(showingErrors.length);
    }
  }

  validateBillingAddressesInputs(): void {
    this.validateInput(this.billingCountryInput, validator.validateCountry);
    this.validateInput(this.billingPostalCodeInput, validator.validatePostalCode, this.billingCountryInput);
    this.validateInput(this.billingCityInput, validator.validateOnlyLetters);
    this.validateInput(this.billingStreetInput, validator.isValueExist);
    this.validateInput(this.billingPostalCodeInput, validator.validatePostalCode, this.billingCountryInput);

    const isCountryExist = this.billingCountryInput.value;
    const isCityExist = this.billingCityInput.value;
    const isStreetExist = this.billingStreetInput.value;
    const isPostalCodeExist = this.billingPostalCodeInput.value;
    if (isCountryExist && isCityExist && isStreetExist && isPostalCodeExist) {
      const addressErrors = this.getElement().querySelectorAll('.billing-address div.error');
      const showingErrors = [...addressErrors].filter((error) => !error.classList.contains('hidden'));
      this.saveBillingCheckbox.disabled = Boolean(showingErrors.length);
    }
  }

  validateSubmitButton(): void {
    const allErrors = this.getElement().querySelectorAll('div.error');
    const showingErrors = [...allErrors].filter((error) => !error.classList.contains('hidden'));
    this.submitButton.disabled = Boolean(showingErrors.length);
  }

  validateInput(
    input: HTMLInputElement,
    callback: (checkValue: string, value?: string) => ValidationResult,
    checkInput?: HTMLInputElement,
  ): void {
    const { isValid, message } = checkInput ? callback(input.value, checkInput.value) : callback(input.value);

    const errorField = input.parentElement?.querySelector('div');

    if (errorField) {
      errorField.classList.toggle('hidden', isValid);
      errorField.innerHTML = message || '';
    }
  }

  handleInputs(): void {
    this.emailInput.addEventListener('input', () => {
      this.validateInput(this.emailInput, validator.validateEmail);
    });
    this.nameInput.addEventListener('input', () => {
      this.validateInput(this.nameInput, validator.validateOnlyLetters);
    });
    this.surnameInput.addEventListener('input', () => {
      this.validateInput(this.surnameInput, validator.validateOnlyLetters);
    });
    this.birthDayInput.addEventListener('input', () => {
      this.validateInput(this.birthDayInput, validator.validateDateOfBirth);
    });
    this.birthDayInput.addEventListener('focus', () => {
      this.birthDayInput.type = 'date';
    });
    this.birthDayInput.addEventListener('blur', () => {
      if (!this.birthDayInput.value) this.birthDayInput.type = 'text';
    });
    this.deliveryCountryInput.addEventListener('input', () => {
      this.validateDeliveryAddressesInputs();
    });
    this.deliveryCityInput.addEventListener('input', () => {
      this.validateDeliveryAddressesInputs();
    });
    this.deliveryStreetInput.addEventListener('input', () => {
      this.validateDeliveryAddressesInputs();
    });
    this.deliveryPostalCodeInput.addEventListener('input', () => {
      this.validateDeliveryAddressesInputs();
    });

    this.billingCountryInput.addEventListener('input', () => {
      this.validateBillingAddressesInputs();
    });
    this.billingCityInput.addEventListener('input', () => {
      this.validateBillingAddressesInputs();
    });
    this.billingStreetInput.addEventListener('input', () => {
      this.validateBillingAddressesInputs();
    });
    this.billingPostalCodeInput.addEventListener('input', () => {
      this.validateBillingAddressesInputs();
    });

    this.passwordInput.addEventListener('input', () => {
      this.validateInput(this.passwordInput, validator.validatePassword);
    });
    this.passwordRepeatInput.addEventListener('input', () => {
      this.validateInput(this.passwordRepeatInput, validator.validatePassword, this.passwordInput);
    });

    this.getElement()
      .querySelectorAll('input')
      .forEach((input) => input.addEventListener('input', () => this.validateSubmitButton()));

    this.validateInput(this.emailInput, validator.validateEmail);
    this.validateInput(this.nameInput, validator.validateOnlyLetters);
    this.validateInput(this.surnameInput, validator.validateOnlyLetters);
    this.validateInput(this.birthDayInput, validator.validateDateOfBirth);
    this.validateDeliveryAddressesInputs();
    this.validateBillingAddressesInputs();
    this.validateInput(this.passwordRepeatInput, validator.validatePassword);
  }

  handleCheckbox(): void {
    this.setSameAddressCheckbox.addEventListener('click', () => {
      const readOnly = this.setSameAddressCheckbox.checked;

      if (readOnly) {
        this.getElement()
          .querySelectorAll('.billing-address div.error')
          .forEach((div) => div.classList.add('hidden'));
      }

      const fields = [
        { input: this.billingCountryInput, source: this.deliveryCountryInput },
        { input: this.billingCityInput, source: this.deliveryCityInput },
        { input: this.billingStreetInput, source: this.deliveryStreetInput },
        { input: this.billingPostalCodeInput, source: this.deliveryPostalCodeInput },
      ];

      fields.forEach((field) => {
        const fieldInput = field.input;
        const sourceValue = field.source.value;

        fieldInput.value = readOnly ? sourceValue : '';
        fieldInput.readOnly = readOnly;
      });

      this.saveBillingCheckbox.disabled = !readOnly;
      this.validateBillingAddressesInputs();
    });
  }

  changePasswordVisibility(button: HTMLButtonElement, input: HTMLInputElement): void {
    const buttonElement = button;
    const inputElement = input;
    const isHidden = input.type === 'password';

    inputElement.type = isHidden ? 'text' : 'password';
    buttonElement.innerHTML = isHidden ? passwordShow : passwordHide;
    input.focus();
  }

  async signUp(): Promise<void> {
    try {
      const deliveryAddress: BaseAddress = {
        country: countryCodes[this.deliveryCountryInput.value],
        city: this.deliveryCityInput.value,
        streetName: this.deliveryStreetInput.value,
        postalCode: this.deliveryPostalCodeInput.value,
      };

      const billingAddress: BaseAddress = {
        country: countryCodes[this.billingCountryInput.value],
        city: this.billingCityInput.value,
        streetName: this.billingStreetInput.value,
        postalCode: this.billingPostalCodeInput.value,
      };

      const addresses: BaseAddress[] = [];
      if (billingAddress.country) {
        addresses.push(deliveryAddress);
      }
      if (billingAddress.country) {
        addresses.push(billingAddress);
      }

      const defaultShippingAddress = this.saveDeliveryCheckbox.checked ? 0 : undefined;
      const defaultBillingAddress = this.saveBillingCheckbox.checked ? 1 : undefined;

      const consumerDraft: MyCustomerDraft = {
        email: this.emailInput.value,
        password: this.passwordInput.value,
        firstName: this.nameInput.value,
        lastName: this.surnameInput.value,
        dateOfBirth: this.birthDayInput.value,
        addresses,
        defaultShippingAddress,
        defaultBillingAddress,
      };

      await createConsumer(getCtpClient(), consumerDraft);
      await this.consumer.logIn(this.emailInput.value, this.passwordInput.value);
      window.history.pushState({}, '', '/');
      this.router.handleLocation();
    } catch (err) {
      if (err instanceof Error) {
        // TODO: show graceful error message ECOMM-2_12
      }
    }
  }

  getElement(): HTMLElement {
    return this.registrationView.getElement();
  }
}
