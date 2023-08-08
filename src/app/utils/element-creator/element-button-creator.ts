import { ElementButtonParams } from '../../types/element-button-params-type';
import { ElementCreator } from './element-creator';

export class ElementButtonCreator<T extends HTMLButtonElement> extends ElementCreator<T> {
  constructor(params: ElementButtonParams) {
    super(params);
    this.setButtonElementProperties(params);
  }

  private setButtonElementProperties(params: ElementButtonParams): void {
    const buttonElement = this.getElement();

    if (params.disabled) {
      buttonElement.disabled = params.disabled;
    }
  }
}
