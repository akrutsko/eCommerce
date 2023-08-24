import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Catalog {
  catalogView: ElementCreator<HTMLElement>;

  constructor() {
    this.catalogView = new ElementCreator({ tag: 'div' });
    this.createView();
  }

  createView(): void {
    const mainMessage = new ElementCreator({
      tag: 'div',
      classes: 'text-[#DFDDDF] text-8xl sd:text-[265px] mg:text-[350px] font-bold drop-shadow-[5px_4px_0px_rgba(57,62,77,0.18)]',
      text: 'Catalog',
    });

    this.catalogView.appendNode(mainMessage);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.catalogView;
  }

  getElement(): HTMLElement {
    return this.catalogView.getElement();
  }
}
