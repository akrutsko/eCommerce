import { ElementAnchorParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementAnchorCreator extends ElementCreator<HTMLAnchorElement> {
  constructor(params: ElementAnchorParams) {
    super({ ...params, tag: 'a' });

    this.element.href = params.href;
  }
}
