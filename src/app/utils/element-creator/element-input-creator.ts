import { ElementInputParams } from '../../types/utils-interfaces';
import { ElementCreator } from './element-creator';

export class ElementInputCreator<T extends HTMLInputElement> extends ElementCreator<T> {
  constructor(params: ElementInputParams) {
    const modifiedParams: ElementInputParams = {
      ...params,
      tag: 'input',
    };
    super(modifiedParams);
    this.setInputElementProperties(modifiedParams);
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
