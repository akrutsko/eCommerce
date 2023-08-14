import { ElementButtonParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementButtonCreator extends ElementCreator<HTMLButtonElement> {
  constructor(params: ElementButtonParams) {
    super({ ...params, tag: 'button' });
    this.element.type = 'button';

    if (params.disabled) {
      this.element.disabled = params.disabled;
    }
  }
}
