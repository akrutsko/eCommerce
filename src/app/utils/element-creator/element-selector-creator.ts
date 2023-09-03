import { ElementSelectParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementSelectCreator extends ElementCreator<HTMLSelectElement> {
  constructor(params: ElementSelectParams) {
    super({ ...params, tag: 'select' });
  }
}
