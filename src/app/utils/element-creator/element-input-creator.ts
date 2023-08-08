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
  }
}
