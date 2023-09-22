import { ElementImageParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementImageCreator extends ElementCreator<HTMLImageElement> {
  constructor(params: ElementImageParams) {
    super({ ...params, tag: 'img' });

    this.element.src = params.src;
    this.element.alt = params.alt;
  }
}
