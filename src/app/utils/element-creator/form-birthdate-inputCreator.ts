import { validateDateOfBirth } from '../validation/input-validation';
import { FormInputCreator } from './form-input-creator';

export class FormInputBirthdateCreator extends FormInputCreator {
  constructor(containerClasses: string) {
    super({ placeholder: 'date of birth', containerClasses, validationCallback: validateDateOfBirth });

    this.input.addEventListener('focus', () => {
      this.input.type = 'date';
    });
    this.input.addEventListener('blur', () => {
      if (!this.input.value) this.input.type = 'text';
    });
  }

  setInputValue(value: string): void {
    super.setInputValue(value);
    this.input.type = 'date';
  }
}
