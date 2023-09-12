import loading from '../../../assets/svg/wait-loading.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Loading {
  loader: ElementCreator<HTMLElement>;

  constructor() {
    this.loader = new ElementCreator({ tag: 'div' });
  }

  showLoader(): void {
    const bg = new ElementCreator({ tag: 'div', classes: 'absolute bg-secondary-color opacity-20 inset-0 z-50' });
    const loader = new ElementCreator({
      tag: 'div',
      html: loading,
      classes: 'absolute w-24 h-24 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4',
    });
    this.loader.appendNode(bg, loader);

    document.body.append(this.loader.getElement());
  }

  hideLoader(): void {
    this.loader.getElement().remove();
  }
}
