import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Cart {
  cartView: ElementCreator<HTMLElement>;

  constructor() {
    this.cartView = new ElementCreator({ tag: 'div' });
    this.createView();
  }

  createView(): void {
    const mainMessage = new ElementCreator({
      tag: 'div',
      classes: 'text-[#DFDDDF] text-8xl sd:text-[265px] mg:text-[350px] font-bold drop-shadow-[5px_4px_0px_rgba(57,62,77,0.18)]',
      text: 'Cart',
    });

    this.cartView.appendNode(mainMessage);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.cartView;
  }

  getElement(): HTMLElement {
    return this.cartView.getElement();
  }
}
