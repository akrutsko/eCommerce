import { ElementOptionParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementOptionCreator extends ElementCreator<HTMLButtonElement> {
  constructor(params: ElementOptionParams) {
    super({ ...params, tag: 'option' });

    this.element.value = params.value;
  }
}
