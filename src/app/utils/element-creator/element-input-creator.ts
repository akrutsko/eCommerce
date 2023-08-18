import { ElementInputParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementInputCreator extends ElementCreator<HTMLInputElement> {
  constructor(params: ElementInputParams) {
    super({ ...params, tag: 'input' });

    if (params.type) {
      this.element.type = params.type;
    }
    if (params.value) {
      this.element.value = params.value;
    }
    if (params.placeholder) {
      this.element.placeholder = params.placeholder;
    }
    if (params.disabled) {
      this.element.disabled = params.disabled;
    }
  }
}
