import passwordHide from '../../../assets/svg/passwordHide.svg';
import passwordShow from '../../../assets/svg/passwordShow.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';

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

    const emailInputContainer = new ElementCreator({ tag: 'div', classes: '' });
    const emailError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    emailInputContainer.appendNode(this.emailInput, emailError);

    const nameInputContainer = new ElementCreator({ tag: 'div', classes: 'w-full md:max-w-[275px]' });
    const nameError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    nameInputContainer.appendNode(this.nameInput, nameError);

    const surnameInputContainer = new ElementCreator({ tag: 'div', classes: 'w-full md:max-w-[275px]' });
    const surnameError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    surnameInputContainer.appendNode(this.surnameInput, surnameError);

    const birthDayInputContainer = new ElementCreator({ tag: 'div', classes: '' });
    const birthDayError = new ElementCreator({ tag: 'div', classes: 'error hide' });
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

    const countryInputContainer = new ElementCreator({ tag: 'div', classes: 'w-full md:max-w-[275px]' });
    const countryError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    countryInputContainer.appendNode(this.countryInput, countryError);

    const cityInputContainer = new ElementCreator({ tag: 'div', classes: 'w-full md:max-w-[275px]' });
    const cityError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    cityInputContainer.appendNode(this.cityInput, cityError);

    const streetInputContainer = new ElementCreator({ tag: 'div', classes: 'w-full md:max-w-[275px]' });
    const streetError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    streetInputContainer.appendNode(this.streetInput, streetError);

    const postalCodeInputContainer = new ElementCreator({ tag: 'div', classes: 'w-full md:max-w-[275px]' });
    const postalCodeError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    postalCodeInputContainer.appendNode(this.postalCodeInput, postalCodeError);

    addressFirstFlexContainer.appendNode(countryInputContainer, cityInputContainer);
    addressSecondFlexContainer.appendNode(streetInputContainer, postalCodeInputContainer);

    addressContainer.appendNode(addressTitle, addressFirstFlexContainer, addressSecondFlexContainer);

    const passwordInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    const passwordError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    passwordInputContainer.appendNode(this.passwordInput, this.showButton, passwordError);

    const passwordRepeatInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    const passwordRepeatError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    passwordRepeatInputContainer.appendNode(this.passwordRepeatInput, this.showRepeatButton, passwordRepeatError);

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
