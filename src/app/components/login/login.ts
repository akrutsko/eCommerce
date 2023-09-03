import passwordHide from '../../../assets/svg/passwordHide.svg';
import passwordShow from '../../../assets/svg/passwordShow.svg';

import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { ValidationResult } from '../../types/validation-result-type';
import { validateEmail, validatePassword } from '../../utils/validation/input-validation';
import { Consumer } from '../consumer/consumer';
import { Router } from '../../router/router';
import { HandlerLinks } from '../../router/handler-links';
import { Message } from '../../utils/message/toastify-message';

export class Login extends HandlerLinks {
  consumer: Consumer;

  loginView: ElementCreator<HTMLElement>;

  emailInput: HTMLInputElement;

  passwordInput: HTMLInputElement;

  passwordError: HTMLElement;

  showButton: HTMLButtonElement;

  submitButton: HTMLButtonElement;

  constructor(router: Router, consumer: Consumer) {
    super(router);
    this.consumer = consumer;

    this.loginView = new ElementCreator({ tag: 'div', classes: 'login-form max-w-xl w-full form flex flex-col gap-4 md:gap-6' });
    this.emailInput = new ElementInputCreator({ placeholder: 'email', classes: 'form-input' }).getElement();
    this.passwordInput = new ElementInputCreator({
      type: 'password',
      placeholder: 'password',
      classes: 'form-input pr-10',
    }).getElement();
    this.passwordError = new ElementCreator({
      tag: 'div',
      classes: 'error hidden left-3 text-xs text-primary-color absolute',
    }).getElement();
    this.submitButton = new ElementButtonCreator({ classes: 'primary-button', text: 'log in', disabled: true }).getElement();
    this.showButton = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();

    this.createView();
    this.handleButtons();
    this.handleInputs();
    this.handleLinks();
  }

  createView(): void {
    const titleContainer = new ElementCreator({ tag: 'div', classes: 'text-center' });
    const title = new ElementCreator({ tag: 'h2', text: 'Welcome back!' });
    const subtitle = new ElementCreator({
      tag: 'p',
      classes: 'opacity-60 pt-2',
      text: "Beat yourself and you'll always be first",
    });
    titleContainer.appendNode(title, subtitle);

    const emailInputContainer = new ElementCreator({ tag: 'div', classes: 'email relative' });
    const emailError = new ElementCreator({ tag: 'div', classes: 'error hidden left-3 text-xs text-primary-color absolute' });
    emailInputContainer.appendNode(this.emailInput, emailError);

    const passwordInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    passwordInputContainer.appendNode(this.passwordInput, this.showButton, this.passwordError);

    const loginForm = new ElementCreator({ tag: 'form', classes: 'flex flex-col gap-4 md:gap-5' });
    loginForm.appendNode(emailInputContainer, passwordInputContainer, this.submitButton);

    const question = new ElementCreator({ tag: 'div', text: 'Not a member yet? ' });
    const signInAnchor = new ElementAnchorCreator({ href: '/signup', classes: 'link', text: 'Sign up' });
    this.listOfLinks.push(signInAnchor.getElement());
    question.appendNode(signInAnchor);

    this.loginView.appendNode(titleContainer, loginForm, question);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.loginView;
  }

  getElement(): HTMLElement {
    return this.loginView.getElement();
  }

  handleButtons(): void {
    this.showButton.addEventListener('click', () => this.changePasswordVisibility());
    this.submitButton.addEventListener('click', () => this.logIn());
  }

  handleInputs(): void {
    this.emailInput.addEventListener('input', () => {
      this.validateInput(this.emailInput, validateEmail);
      this.validateSubmitButton();
    });
    this.passwordInput.addEventListener('input', () => {
      this.validateInput(this.passwordInput, validatePassword);
      this.validateSubmitButton();
    });

    this.validateInput(this.emailInput, validateEmail);
    this.validateInput(this.passwordInput, validatePassword);
  }

  changePasswordVisibility(): void {
    const isHidden = this.passwordInput.type === 'password';

    this.passwordInput.type = isHidden ? 'text' : 'password';
    this.showButton.innerHTML = isHidden ? passwordShow : passwordHide;
    this.passwordInput.focus();
  }

  validateInput(input: HTMLInputElement, callback: (value: string) => ValidationResult): void {
    const { isValid, message } = callback(input.value);

    const errorField = input.parentElement?.querySelector('div');

    if (errorField) {
      errorField.classList.toggle('hidden', isValid);
      errorField.innerHTML = message || '';
    }
  }

  validateSubmitButton(): void {
    const allErrors = this.getElement().querySelectorAll('div.error');
    const showingErrors = [...allErrors].filter((error) => !error.classList.contains('hidden'));
    this.submitButton.disabled = Boolean(showingErrors.length);
  }

  async logIn(): Promise<void> {
    try {
      await this.consumer.logIn(this.emailInput.value, this.passwordInput.value);
      window.history.pushState({}, '', '/');
      this.router.handleLocation();
      new Message('Welcome! Start shopping and reach new sports peak.', 'info').showMessage();
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
}
