import { ElementInputParams } from '../../types/element-input-params-type';
import { ElementCreator } from './element-creator';

export class ElementInputCreator<T extends HTMLInputElement> extends ElementCreator<T> {
  constructor(params: ElementInputParams) {
    super(params);
    this.setInputElementProperties(params);
  }

  private setInputElementProperties(params: ElementInputParams): void {
    const inputElement = this.getElement();

    if (params.type) {
      inputElement.type = params.type;
    }

    if (params.value) {
      inputElement.value = params.value;
    }
  }
}
