import { ElementButtonParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementButtonCreator<T extends HTMLButtonElement> extends ElementCreator<T> {
  constructor(params: ElementButtonParams) {
    super({ ...params, tag: 'button' });

    if (params.disabled) {
      this.element.disabled = params.disabled;
    }
  }
}
