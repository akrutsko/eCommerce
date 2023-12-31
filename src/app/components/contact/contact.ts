import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Contact {
  contactView: ElementCreator<HTMLElement>;

  constructor() {
    this.contactView = new ElementCreator({ tag: 'div' });
    this.createView();
  }

  createView(): void {
    const mainMessage = new ElementCreator({
      tag: 'div',
      classes: 'text-[#DFDDDF] text-8xl sd:text-[265px] mg:text-[350px] font-bold drop-shadow-[5px_4px_0px_rgba(57,62,77,0.18)]',
      text: 'Contact',
    });

    this.contactView.appendNode(mainMessage);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.contactView;
  }

  getElement(): HTMLElement {
    return this.contactView.getElement();
  }
}
