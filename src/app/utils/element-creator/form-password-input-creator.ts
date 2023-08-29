import { ElementButtonCreator } from './element-button-creator';
import { ValidationResult } from '../../types/validation-result-type';
import { FormInputCreator } from './form-input-creator';

import passwordShow from '../../../assets/svg/passwordShow.svg';
import passwordHide from '../../../assets/svg/passwordHide.svg';

export class FormInputPasswordCreator extends FormInputCreator {
  button: HTMLButtonElement;

  constructor(
    placeholder: string,
    containerClasses: string,
    validationCallback: (checkValue: string, value?: string) => ValidationResult,
  ) {
    super({ placeholder, containerClasses, validationCallback, type: 'password' });
    this.button = new ElementButtonCreator({ classes: 'absolute top-1/4 right-3', html: passwordHide }).getElement();
    this.button.addEventListener('click', this.changePasswordVisibility);
    this.inputContainer.appendNode(this.button);
  }

  changePasswordVisibility(): void {
    const isHidden = this.input.type === 'password';

    this.input.type = isHidden ? 'text' : 'password';
    this.button.innerHTML = isHidden ? passwordShow : passwordHide;
    this.input.focus();
  }
}
