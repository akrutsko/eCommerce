import { ElementLabelParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementLabelCreator extends ElementCreator<HTMLLabelElement> {
  constructor(params: ElementLabelParams) {
    super({ ...params, tag: 'label' });

    this.element.htmlFor = params.for;
  }
}
