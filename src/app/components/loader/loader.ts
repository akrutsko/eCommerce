import loading from '../../../assets/svg/wait-loading.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Loading {
  loader: ElementCreator<HTMLElement>;

  parent: ElementCreator<HTMLElement>;

  constructor(parent:ElementCreator<HTMLElement>) {
    this.loader = new ElementCreator({ tag: 'div', classes: 'fixed inset-0 w-full h-full flex justify-center items-center' });
    this.parent = parent;
  }

  showLoader(): void {
    const bg = new ElementCreator({ tag: 'div', classes: 'absolute bg-secondary-color opacity-20 inset-0 z-50' });
    const loader = new ElementCreator({
      tag: 'div',
      html: loading,
      classes: 'absolute w-24 h-24 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4',
    });
    bg.appendNode(loader);
    this.loader.appendNode(bg);

    this.parent.appendNode(this.loader);
    document.body.classList.add('overflow-hidden');
  }

  hideLoader(): void {
    this.loader.getElement().remove();
    document.body.classList.remove('overflow-hidden');
  }
}
