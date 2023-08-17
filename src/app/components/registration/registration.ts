import './registration.css';

import passwordHide from '../../../assets/svg/passwordHide.svg';
import passwordShow from '../../../assets/svg/passwordShow.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { countries } from '../../utils/validation/countries';
import * as validator from '../../utils/validation/input-validation';
import { ValidationResult } from '../../types/validation-result-type';

export class Registration {
  registrationView: ElementCreator<HTMLElement>;

  emailInput: HTMLInputElement;

  nameInput: HTMLInputElement;

  surnameInput: HTMLInputElement;

  birthDayInput: HTMLInputElement;

  passwordInput: HTMLInputElement;

  passwordRepeatInput: HTMLInputElement;

  countryInput: HTMLInputElement;

  cityInput: HTMLInputElement;

  streetInput: HTMLInputElement;

  postalCodeInput: HTMLInputElement;

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

  constructor() {
    this.registrationView = new ElementCreator({
      tag: 'div',
      classes: 'registration-form max-w-xl w-full form flex flex-col gap-4 md:gap-6',
    });
    this.emailInput = new ElementInputCreator({ type: 'email', placeholder: 'email', classes: 'form-input' }).getElement();
    this.nameInput = new ElementInputCreator({ placeholder: 'name', classes: 'form-input' }).getElement();
    this.surnameInput = new ElementInputCreator({ placeholder: 'surname', classes: 'form-input' }).getElement();
    this.birthDayInput = new ElementInputCreator({ placeholder: 'birth date', classes: 'form-input' }).getElement();
    this.countryInput = new ElementInputCreator({ placeholder: 'country', classes: 'form-input' }).getElement();
    this.cityInput = new ElementInputCreator({ placeholder: 'city', classes: 'form-input' }).getElement();
    this.streetInput = new ElementInputCreator({ placeholder: 'street', classes: 'form-input' }).getElement();
    this.postalCodeInput = new ElementInputCreator({ placeholder: 'postal code', classes: 'form-input' }).getElement();
    this.billingCountryInput = new ElementInputCreator({ placeholder: 'country', classes: 'form-input' }).getElement();
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
    this.saveDeliveryCheckbox = new ElementInputCreator({ type: 'checkbox', disabled: true }).getElement();
    this.saveBillingCheckbox = new ElementInputCreator({ type: 'checkbox', disabled: true }).getElement();
    this.setSameAddressCheckbox = new ElementInputCreator({ type: 'checkbox', disabled: true }).getElement();
    this.submitButton = new ElementButtonCreator({ classes: 'primary-button', text: 'sign up', disabled: true }).getElement();
    this.showButton = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();
    this.showRepeatButton = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();

    this.createView();
    this.handlePasswordVisibility();
    this.handleCountryInputs();
    this.handleInputType();
    this.handleInputs();
    this.handleCheckbox();
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

    const addressDeliveryContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });
    const addressBillingContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });

    const addressDeliverySubtitle = new ElementCreator({ tag: 'h5', classes: 'h5 text-primary-color', text: 'Delivery address' });
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
      tag: 'ul',
      classes: 'absolute overflow-y-auto bg-gray-100 w-full z-10 max-h-[232px]',
    });
    countryDeliveryInputContainer.appendNode(this.countryInput, countryDeliveryError, countryDeliveryList);

    const cityDeliveryInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const cityDeliveryError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    cityDeliveryInputContainer.appendNode(this.cityInput, cityDeliveryError);

    const streetDeliveryInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const streetDeliveryError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    streetDeliveryInputContainer.appendNode(this.streetInput, streetDeliveryError);

    const postalDeliveryCodeInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const postalDeliveryCodeError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    });
    postalDeliveryCodeInputContainer.appendNode(this.postalCodeInput, postalDeliveryCodeError);

    addressDeliveryFirstFlexContainer.appendNode(countryDeliveryInputContainer, cityDeliveryInputContainer);
    addressDeliverySecondFlexContainer.appendNode(streetDeliveryInputContainer, postalDeliveryCodeInputContainer);

    const deliveryFirstCheckboxContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm' });
    const deliverySecondCheckboxContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm' });
    const deliveryFirstLabel = new ElementCreator({ tag: 'label', text: 'set as default address' });
    const deliverySecondLabel = new ElementCreator({ tag: 'label', text: 'set delivery address as billing address' });

    deliveryFirstCheckboxContainer.appendNode(this.saveDeliveryCheckbox, deliveryFirstLabel);
    deliverySecondCheckboxContainer.appendNode(this.setSameAddressCheckbox, deliverySecondLabel);

    addressDeliveryContainer.appendNode(
      addressDeliverySubtitle,
      addressDeliveryFirstFlexContainer,
      addressDeliverySecondFlexContainer,
      deliveryFirstCheckboxContainer,
      deliverySecondCheckboxContainer,
    );

    const addressBillingSubtitle = new ElementCreator({
      tag: 'h5',
      classes: 'h5 text-primary-color',
      text: 'Billing address',
    });
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
      tag: 'ul',
      classes: 'absolute overflow-y-auto bg-gray-100 w-full z-10 max-h-[232px]',
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
    const billingLabel = new ElementCreator({ tag: 'label', text: 'set as default address' });

    billingCheckboxContainer.appendNode(this.saveBillingCheckbox, billingLabel);

    addressBillingContainer.appendNode(
      addressBillingSubtitle,
      addressBillingFirstFlexContainer,
      addressBillingSecondFlexContainer,
      billingCheckboxContainer,
    );

    const addressContainer = new ElementCreator({ tag: 'div', classes: 'address flex flex-col gap-4 md:gap-5' });
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
    question.appendNode(signInAnchor);

    this.registrationView.appendNode(titleContainer, registrationForm, question);
  }

  validateAddressesInputs(): void {
    if (
      this.countryInput.value.length
      && this.cityInput.value.length
      && this.streetInput.value.length
      && this.postalCodeInput.value.length
    ) {
      const addressErrors = this.getElement().querySelectorAll('.address div.error');
      const showingErrors = [...addressErrors].filter((error) => !error.classList.contains('hidden'));
      this.saveDeliveryCheckbox.disabled = Boolean(showingErrors.length);
      this.setSameAddressCheckbox.disabled = Boolean(showingErrors.length);
    }
  }

  validateSubmitButton(): void {
    if (!this.emailInput.value.length || !this.passwordInput.value.length || !this.nameInput.value.length) {
      this.submitButton.disabled = true;
      return;
    }

    const allErrors = this.getElement().querySelectorAll('div.error');
    const showingErrors = [...allErrors].filter((error) => !error.classList.contains('hidden'));
    this.submitButton.disabled = Boolean(showingErrors.length);
  }

  validateInput(
    input: HTMLInputElement,
    callback: (value: string, code?: string) => ValidationResult,
    isPostalCodeError = false,
  ): void {
    const { isValid, message } = isPostalCodeError ? callback(this.countryInput.value, input.value) : callback(input.value);

    const errorField = input.parentElement?.querySelector('div');

    if (errorField) {
      errorField.classList.toggle('hidden', isValid);
      errorField.innerHTML = message || '';
    }
  }

  handleInputs(): void {
    this.emailInput.addEventListener('input', () => {
      this.validateInput(this.emailInput, validator.validateEmail);
      this.validateSubmitButton();
    });
    this.nameInput.addEventListener('input', () => {
      this.validateInput(this.nameInput, validator.isValueExist);
      this.validateSubmitButton();
    });
    this.surnameInput.addEventListener('input', () => {
      this.validateInput(this.surnameInput, validator.isValueExist);
      this.validateSubmitButton();
    });
    this.birthDayInput.addEventListener('input', () => {
      this.validateInput(this.birthDayInput, validator.validateDateOfBirth);
      this.validateSubmitButton();
    });
    this.countryInput.addEventListener('input', () => {
      this.validateInput(this.countryInput, validator.validateCountry);
      this.validateSubmitButton();
      this.validateAddressesInputs();
    });
    this.cityInput.addEventListener('input', () => {
      this.validateInput(this.cityInput, validator.validateOnlyLetters);
      this.validateSubmitButton();
      this.validateAddressesInputs();
    });
    this.streetInput.addEventListener('input', () => {
      this.validateInput(this.streetInput, validator.validateOnlyLetters);
      this.validateSubmitButton();
      this.validateAddressesInputs();
    });
    this.postalCodeInput.addEventListener('input', () => {
      this.validateInput(this.postalCodeInput, validator.validatePostalCode, true);
      this.validateSubmitButton();
      this.validateAddressesInputs();
    });
    this.billingCountryInput.addEventListener('input', () => {
      this.validateInput(this.countryInput, validator.validateCountry);
      this.validateSubmitButton();
    });
    this.billingCityInput.addEventListener('input', () => {
      this.validateInput(this.cityInput, validator.validateOnlyLetters);
      this.validateSubmitButton();
    });
    this.billingStreetInput.addEventListener('input', () => {
      this.validateInput(this.streetInput, validator.validateOnlyLetters);
      this.validateSubmitButton();
    });
    this.billingPostalCodeInput.addEventListener('input', () => {
      this.validateInput(this.postalCodeInput, validator.validatePostalCode, true);
      this.validateSubmitButton();
    });
    this.passwordInput.addEventListener('input', () => {
      this.validateInput(this.passwordInput, validator.validatePassword);
      this.validateSubmitButton();
    });
    this.passwordRepeatInput.addEventListener('input', () => {
      this.validateInput(this.passwordRepeatInput, validator.validatePassword);
      this.validateSubmitButton();
    });
  }

  handleCheckbox(): void {
    this.setSameAddressCheckbox.addEventListener('click', () => {
      const readOnly = this.setSameAddressCheckbox.checked;

      const fields = [
        { input: this.billingCountryInput, source: this.countryInput },
        { input: this.billingCityInput, source: this.cityInput },
        { input: this.billingStreetInput, source: this.streetInput },
        { input: this.billingPostalCodeInput, source: this.postalCodeInput },
      ];

      fields.forEach((field) => {
        const fieldInput = field.input;
        const sourceValue = field.source.value;

        fieldInput.value = readOnly ? sourceValue : '';
        fieldInput.readOnly = readOnly;
      });

      this.saveBillingCheckbox.disabled = !readOnly;
      this.saveBillingCheckbox.checked = false;
    });
  }

  handlePasswordVisibility(): void {
    this.showButton.addEventListener('click', () => this.changePasswordVisibility(this.showButton, this.passwordInput));
    this.showRepeatButton.addEventListener('click', () => {
      this.changePasswordVisibility(this.showRepeatButton, this.passwordRepeatInput);
    });
  }

  handleCountryInputs(): void {
    this.countryInput.addEventListener('input', () => this.showAvailableCountries(this.countryInput));
    this.billingCountryInput.addEventListener('input', () => this.showAvailableCountries(this.billingCountryInput));
  }

  handleInputType(): void {
    this.birthDayInput.addEventListener('focus', () => {
      this.birthDayInput.type = 'date';
    });
  }

  showAvailableCountries(input: HTMLInputElement): void {
    const searchText = input.value.toLowerCase();
    const filteredCountries = searchText ? countries.filter((country) => country.toLowerCase().includes(searchText)) : [];
    this.renderCountryList(input, filteredCountries);
  }

  changePasswordVisibility(button: HTMLButtonElement, input: HTMLInputElement): void {
    const buttonElement = button;
    const inputElement = input;
    const isHidden = input.type === 'password';

    inputElement.type = isHidden ? 'text' : 'password';
    buttonElement.innerHTML = isHidden ? passwordShow : passwordHide;
    input.focus();
  }

  renderCountryList(input: HTMLInputElement, filteredCountries: string[]): void {
    const currentInput = input;
    const list = currentInput.nextElementSibling?.nextElementSibling;

    if (list) {
      list.innerHTML = '';

      filteredCountries.forEach((country) => {
        const listItem = new ElementCreator({
          tag: 'li',
          classes: 'p-2 hover:bg-gray-200 cursor-pointer',
          text: country,
        }).getElement();

        listItem.addEventListener('click', () => {
          currentInput.value = country;
          list.innerHTML = '';
          this.validateInput(currentInput, validator.validateCountry);
        });

        list.appendChild(listItem);
      });
    }
  }

  getElement(): HTMLElement {
    return this.registrationView.getElement();
  }
}
