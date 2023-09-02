import { FormInputParams } from '../../types/form-input-params-type';
import { ValidationResult } from '../../types/validation-result-type';
import { ElementCreator } from './element-creator';
import { ElementInputCreator } from './element-input-creator';

export class FormInputCreator {
  errorClass: string;

  input: HTMLInputElement;

  error: HTMLElement;

  inputContainer: ElementCreator<HTMLElement>;

  checkInput: HTMLInputElement | undefined;

  constructor(params: FormInputParams) {
    this.errorClass = 'error hidden left-3 text-xs text-primary-color absolute';
    this.input = new ElementInputCreator({
      type: params.type,
      placeholder: params.placeholder,
      classes: 'form-input',
      list: params.list,
    }).getElement();
    this.checkInput = params.checkInput;
    this.error = new ElementCreator({ tag: 'div', classes: this.errorClass }).getElement();
    this.inputContainer = new ElementCreator({ tag: 'div', classes: `relative w-full ${params.checkInput || ''}` });
    this.inputContainer.appendNode(this.input, this.error);

    this.input.addEventListener('input', () => this.validateInput(params.validation));
  }

  validateInput(callback: (value: string, checkValue?: string) => ValidationResult): void {
    const { isValid, message } = this.checkInput ? callback(this.input.value, this.checkInput.value) : callback(this.input.value);

    this.error.classList.toggle('hidden', isValid);
    this.error.innerHTML = message || '';
  }

  addLabel(labelValue: string): void {
    let label = this.inputContainer.getElement().querySelector('.label');
    if (label) {
      label.innerHTML = labelValue;
    } else {
      label = new ElementCreator({
        tag: 'label',
        classes: 'h5 label opacity-60 font-medium',
        text: labelValue,
      }).getElement();
      this.inputContainer.getElement().prepend(label);
    }
  }

  setInputValue(value: string): void {
    this.input.value = value;
    this.error.classList.add('hidden');
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
