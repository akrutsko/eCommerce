import passwordHide from '../../../assets/svg/passwordHide.svg';
import passwordShow from '../../../assets/svg/passwordShow.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import {
  isValueExist,
  validateCountry,
  validateDateOfBirth,
  validateEmail,
  validateOnlyLetters,
  validatePassword,
  validatePostalCode,
} from '../../utils/validation/input-validation';
import { ValidationResult } from '../../types/validation-result-type';
import { countries } from '../../utils/validation/countries';

export class Registration {
  registrationView: ElementCreator<HTMLElement>;

  emailInput: HTMLInputElement;

  passwordInput: HTMLInputElement;

  showButton: HTMLButtonElement;

  submitButton: HTMLButtonElement;

  nameInput: HTMLInputElement;

  surnameInput: HTMLInputElement;

  birthDayInput: HTMLInputElement;

  passwordRepeatInput: HTMLInputElement;

  countryInput: HTMLInputElement;

  cityInput: HTMLInputElement;

  streetInput: HTMLInputElement;

  postalCodeInput: HTMLInputElement;

  showRepeatButton: HTMLButtonElement;

  constructor() {
    this.registrationView = new ElementCreator({
      tag: 'div',
      classes: 'registration-form max-w-xl w-full form flex flex-col gap-4 md:gap-6',
    });
    this.emailInput = new ElementInputCreator({ type: 'email', placeholder: 'email', classes: 'form-input' }).getElement();
    this.nameInput = new ElementInputCreator({ type: 'text', placeholder: 'name', classes: 'form-input' }).getElement();
    this.surnameInput = new ElementInputCreator({ type: 'text', placeholder: 'surname', classes: 'form-input' }).getElement();
    this.birthDayInput = new ElementInputCreator({
      type: 'text',
      placeholder: 'date of birth',
      classes: 'form-input',
    }).getElement();
    this.countryInput = new ElementInputCreator({ type: 'text', placeholder: 'country', classes: 'form-input' }).getElement();
    this.cityInput = new ElementInputCreator({ type: 'text', placeholder: 'city', classes: 'form-input' }).getElement();
    this.streetInput = new ElementInputCreator({ type: 'text', placeholder: 'street', classes: 'form-input' }).getElement();
    this.postalCodeInput = new ElementInputCreator({
      type: 'text',
      placeholder: 'postal code',
      classes: 'form-input',
    }).getElement();
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
    this.submitButton = new ElementButtonCreator({ classes: 'primary-button', text: 'sign up' }).getElement();
    this.showButton = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();
    this.showRepeatButton = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();

    this.createView();
    this.handlePasswordVisibility();
    this.handleInputType();
    this.handleChooseCountry();
    this.handleOnInput();
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

    const registrationForm = new ElementCreator({ tag: 'form', classes: 'flex flex-col gap-6 md:gap-9' });

    const personalInfoContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });
    const personalInfoTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Personal info' });
    const personalInfoFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });

    const emailInputContainer = new ElementCreator({ tag: 'div', classes: 'relative' });
    const emailError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    emailInputContainer.appendNode(this.emailInput, emailError);

    const nameInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const nameError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    nameInputContainer.appendNode(this.nameInput, nameError);

    const surnameInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const surnameError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    surnameInputContainer.appendNode(this.surnameInput, surnameError);

    const birthDayInputContainer = new ElementCreator({ tag: 'div', classes: 'relative' });
    const birthDayError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    birthDayInputContainer.appendNode(this.birthDayInput, birthDayError);

    personalInfoFlexContainer.appendNode(nameInputContainer, surnameInputContainer);
    personalInfoContainer.appendNode(personalInfoTitle, emailInputContainer, personalInfoFlexContainer, birthDayInputContainer);

    const addressContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });
    const addressTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Address' });
    const addressFirstFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });
    const addressSecondFlexContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-wrap justify-between gap-y-3 sm:gap-y-4 md:gap-y-5',
    });

    const countryInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const countryError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    const countryList = new ElementCreator({
      tag: 'ul',
      classes: 'absolute overflow-y-auto bg-gray-100 w-full z-10 max-h-[232px]',
    });
    countryInputContainer.appendNode(this.countryInput, countryError, countryList);

    const cityInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const cityError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    cityInputContainer.appendNode(this.cityInput, cityError);

    const streetInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const streetError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    streetInputContainer.appendNode(this.streetInput, streetError);

    const postalCodeInputContainer = new ElementCreator({ tag: 'div', classes: 'relative w-full md:max-w-[275px]' });
    const postalCodeError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    postalCodeInputContainer.appendNode(this.postalCodeInput, postalCodeError);

    addressFirstFlexContainer.appendNode(countryInputContainer, cityInputContainer);
    addressSecondFlexContainer.appendNode(streetInputContainer, postalCodeInputContainer);

    addressContainer.appendNode(addressTitle, addressFirstFlexContainer, addressSecondFlexContainer);

    const passwordInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    const passwordError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    passwordInputContainer.appendNode(this.passwordInput, passwordError, this.showButton);

    const passwordRepeatInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    const passwordRepeatError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color' });
    passwordRepeatInputContainer.appendNode(this.passwordRepeatInput, passwordRepeatError, this.showRepeatButton);

    const passwordContainer = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 md:gap-5' });
    const passwordTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Choose password' });
    passwordContainer.appendNode(passwordTitle, passwordInputContainer, passwordRepeatInputContainer);

    registrationForm.appendNode(personalInfoContainer, addressContainer, passwordContainer, this.submitButton);

    const question = new ElementCreator({ tag: 'div', text: 'Already have an account? ' });
    const signInAnchor = new ElementAnchorCreator({ href: '/login', classes: 'link', text: 'Log in' });
    question.appendNode(signInAnchor);

    this.registrationView.appendNode(titleContainer, registrationForm, question);
  }

  handlePasswordVisibility(): void {
    this.showButton.addEventListener('click', () => {
      this.changePasswordVisibility(this.showButton, this.passwordInput);
    });
    this.showRepeatButton.addEventListener('click', () => {
      this.changePasswordVisibility(this.showRepeatButton, this.passwordRepeatInput);
    });
  }

  handleInputType(): void {
    this.birthDayInput.addEventListener('focus', () => {
      this.birthDayInput.type = 'date';
    });
  }

  handleOnInput(): void {
    this.emailInput.addEventListener('input', () => this.showError(this.emailInput, validateEmail));
    this.nameInput.addEventListener('input', () => this.showError(this.nameInput, isValueExist));
    this.surnameInput.addEventListener('input', () => this.showError(this.surnameInput, isValueExist));
    this.birthDayInput.addEventListener('input', () => this.showError(this.birthDayInput, validateDateOfBirth));
    this.countryInput.addEventListener('input', () => this.showError(this.countryInput, validateCountry));
    this.cityInput.addEventListener('input', () => this.showError(this.cityInput, validateOnlyLetters));
    this.streetInput.addEventListener('input', () => this.showError(this.streetInput, validateOnlyLetters));
    this.passwordInput.addEventListener('input', () => this.showError(this.passwordInput, validatePassword));
    this.passwordRepeatInput.addEventListener('input', () => this.showError(this.passwordRepeatInput, validatePassword));
    this.postalCodeInput.addEventListener('input', () => this.showError(this.postalCodeInput, validatePostalCode, true));
  }

  handleChooseCountry(): void {
    this.countryInput.addEventListener('input', () => {
      const searchText = this.countryInput.value.toLowerCase();
      const filteredCountries = searchText ? countries.filter((country) => country.toLowerCase().includes(searchText)) : [];
      this.renderCountryList(filteredCountries);
    });
  }

  renderCountryList(filteredCountries: string[]): void {
    const list = this.countryInput.nextElementSibling?.nextElementSibling;

    if (list) {
      list.innerHTML = '';

      filteredCountries.forEach((country) => {
        const listItem = document.createElement('li');
        listItem.className = 'p-2 hover:bg-gray-200 cursor-pointer';
        listItem.textContent = country;

        listItem.addEventListener('click', () => {
          this.countryInput.value = country;
          list.innerHTML = '';
          this.showError(this.countryInput, validateCountry);
        });

        list.appendChild(listItem);
      });
    }
  }

  showError(
    input: HTMLInputElement,
    callback: (value: string, code?: string) => ValidationResult,
    isPostalCodeError = false,
  ): void {
    const { isValid, message } = isPostalCodeError ? callback(this.countryInput.value, input.value) : callback(input.value);

    const errorField = input.nextElementSibling;

    if (errorField) {
      errorField.classList.toggle('hidden', isValid);
      errorField.classList.toggle('absolute', !isValid);
      errorField.innerHTML = message || '';
    }
  }

  changePasswordVisibility(button: HTMLButtonElement, input: HTMLInputElement): void {
    const buttonElement = button;
    const inputElement = input;
    const isHidden = input.type === 'password';

    inputElement.type = isHidden ? 'text' : 'password';
    buttonElement.innerHTML = isHidden ? passwordShow : passwordHide;
    button.focus();
  }

  getView(): ElementCreator<HTMLElement> {
    return this.registrationView;
  }

  getElement(): HTMLElement {
    return this.registrationView.getElement();
  }
}
