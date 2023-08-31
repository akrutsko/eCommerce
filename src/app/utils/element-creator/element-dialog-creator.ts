import { ElementParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementDialogCreator extends ElementCreator<HTMLDialogElement> {
  constructor(params: ElementParams) {
    super({ ...params, tag: 'dialog' });
  }
}
