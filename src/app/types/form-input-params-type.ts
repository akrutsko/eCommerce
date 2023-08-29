import { ValidationResult } from './validation-result-type';

export interface FormInputParams {
  placeholder: string;
  containerClasses: string;
  validationCallback: (value: string, checkValue?: string) => ValidationResult;
  type?: string;
  list?: string;
  checkInput?: HTMLInputElement;
}
