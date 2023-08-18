import { ElementCreator } from '../../utils/element-creator/element-creator';

export class AboutUs {
  aboutUsView: ElementCreator<HTMLElement>;

  constructor() {
    this.aboutUsView = new ElementCreator({ tag: 'div' });
    this.createView();
  }

  createView(): void {
    const mainMessage = new ElementCreator({
      tag: 'div',
      classes: 'text-[#DFDDDF] text-8xl sd:text-[265px] mg:text-[350px] font-bold drop-shadow-[5px_4px_0px_rgba(57,62,77,0.18)]',
      text: 'About us',
    });

    this.aboutUsView.appendNode(mainMessage);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.aboutUsView;
  }

  getElement(): HTMLElement {
    return this.aboutUsView.getElement();
  }
}
