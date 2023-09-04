import { ElementDialogParams } from '../../types/element-params-type';
import { ElementCreator } from './element-creator';

export class ElementDialogCreator extends ElementCreator<HTMLDialogElement> {
  constructor(params: ElementDialogParams) {
    super({ ...params, tag: 'dialog' });
  }
}
