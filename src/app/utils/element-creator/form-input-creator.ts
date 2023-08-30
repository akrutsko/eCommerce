import { FormInputParams } from '../../types/form-input-params-type';
import { ValidationResult } from '../../types/validation-result-type';
import { ElementCreator } from './element-creator';
import { ElementInputCreator } from './element-input-creator';

export class FormInputCreator {
  errorClass: string;

  input: HTMLInputElement;

  error: HTMLElement;

  inputContainer: ElementCreator<HTMLElement>;

  constructor(params: FormInputParams) {
    this.errorClass = 'error hidden left-3 text-xs text-primary-color absolute';
    this.input = new ElementInputCreator({
      type: params.type,
      placeholder: params.placeholder,
      classes: 'form-input',
      list: params.list,
    }).getElement();
    this.error = new ElementCreator({ tag: 'div', classes: this.errorClass }).getElement();
    this.inputContainer = new ElementCreator({ tag: 'div', classes: `relative w-full ${params.checkInput || ''}` });
    this.inputContainer.appendNode(this.input, this.error);

    this.input.addEventListener('input', () => this.validateInput(params.validation, params.checkInput));
  }

  validateInput(callback: (value: string, checkValue?: string) => ValidationResult, checkInput?: HTMLInputElement): void {
    const { isValid, message } = checkInput ? callback(this.input.value, checkInput.value) : callback(this.input.value);

    this.error.classList.toggle('hidden', isValid);
    this.error.innerHTML = message || '';
  }

  addLabel(labelValue: string): void {
    const label = new ElementCreator({
      tag: 'label',
      classes: 'h5 opacity-60 font-medium',
      text: labelValue,
    }).getElement();
    this.inputContainer.getElement().prepend(label);
  }

  setInputValue(value: string): void {
    this.input.value = value;
  }

  getInputValue(): string {
    return this.input.value;
  }

  getContainer(): HTMLElement {
    return this.inputContainer.getElement();
  }

  getInput(): HTMLInputElement {
    return this.input;
  }
}
