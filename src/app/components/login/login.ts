import passwordHide from '../../../assets/svg/passwordHide.svg';
import passwordShow from '../../../assets/svg/passwordShow.svg';

import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';

export class Login {
  loginView: ElementCreator<HTMLElement>;

  emailInput: HTMLInputElement;

  passwordInput: HTMLInputElement;

  showButton: HTMLButtonElement;

  submitButton: HTMLButtonElement;

  constructor() {
    this.loginView = new ElementCreator({
      tag: 'div',
      classes: 'login-form max-w-xl w-full form flex flex-col gap-6 md:gap-7',
    });
    this.emailInput = new ElementInputCreator({
      type: 'email',
      placeholder: 'email',
      classes: 'form-input',
    }).getElement();
    this.passwordInput = new ElementInputCreator({
      type: 'password',
      placeholder: 'password',
      classes: 'form-input',
    }).getElement();
    this.submitButton = new ElementButtonCreator({
      classes: 'primary-button',
      text: 'log in',
    }).getElement();
    this.showButton = new ElementButtonCreator({
      classes: 'absolute top-1/4 right-3',
      html: passwordHide,
      type: 'button',
    }).getElement();

    this.createView();
    this.handlePasswordVisibility();
  }

  createView(): void {
    const titleContainer = new ElementCreator({ tag: 'div', classes: 'text-center' });
    const title = new ElementCreator({ tag: 'h2', text: 'Welcome back!' });
    const subtitle = new ElementCreator({
      tag: 'p',
      classes: 'opacity-60 pt-2',
      text: "Beat yourself and you'll always be first",
    });
    titleContainer.appendNode(title).appendNode(subtitle);

    const loginForm = new ElementCreator({
      tag: 'form',
      classes: 'flex flex-col gap-3 sm:gap-4 md:gap-5',
    });

    const emailInputContainer = new ElementCreator({ tag: 'div', classes: 'email relative' });
    const emailError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    emailInputContainer.appendNode(this.emailInput).appendNode(emailError);

    const passwordInputContainer = new ElementCreator({ tag: 'div', classes: 'password relative' });
    const passwordError = new ElementCreator({ tag: 'div', classes: 'error hide' });
    passwordInputContainer
      .appendNode(this.passwordInput)
      .appendNode(this.showButton)
      .appendNode(passwordError);

    loginForm
      .appendNode(emailInputContainer)
      .appendNode(passwordInputContainer)
      .appendNode(this.submitButton);

    const question = new ElementCreator({ tag: 'div', text: 'Not a member yet? ' });
    const signInAnchor = new ElementAnchorCreator({ href: '#', classes: 'link', text: 'Sign up' });
    question.appendNode(signInAnchor);

    this.loginView.appendNode(titleContainer).appendNode(loginForm).appendNode(question);
  }

  handlePasswordVisibility(): void {
    this.showButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.changePasswordVisibility();
    });
  }

  changePasswordVisibility(): void {
    const isHidden = this.passwordInput.type === 'password';

    this.passwordInput.type = isHidden ? 'text' : 'password';
    this.showButton.innerHTML = isHidden ? passwordShow : passwordHide;
    this.passwordInput.focus();
  }

  getView(): ElementCreator<HTMLElement> {
    return this.loginView;
  }

  getElement(): HTMLElement {
    return this.loginView.getElement();
  }
}
