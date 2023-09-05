import { ValidationResult } from './validation-result-type';

export interface FormInputParams {
  placeholder: string;
  validation: (value: string, checkValue?: string) => ValidationResult;
  containerClasses?: string;
  type?: string;
  list?: string;
  checkInput?: HTMLInputElement;
  name?: string;
}
