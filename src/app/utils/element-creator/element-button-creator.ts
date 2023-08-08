import { ElementButtonParams } from '../../types/element-type';
import { ElementCreator } from './element-creator';

export class ElementButtonCreator<T extends HTMLButtonElement> extends ElementCreator<T> {
  constructor(params: ElementButtonParams) {
    const modifiedParams: ElementButtonParams = {
      ...params,
      tag: 'button',
    };
    super(modifiedParams);
    this.setButtonElementProperties(modifiedParams);
  }

  private setButtonElementProperties(params: ElementButtonParams): void {
    const buttonElement = this.getElement();

    if (params.disabled) {
      buttonElement.disabled = params.disabled;
    }
  }
}
