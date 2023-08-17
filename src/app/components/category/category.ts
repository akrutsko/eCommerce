import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Category {
  hash: string;

  categoryView: ElementCreator<HTMLElement>;

  constructor(hash: string) {
    this.hash = hash;
    this.categoryView = new ElementCreator({ tag: 'div' });
    this.createView(hash);
  }

  createView(hash: string): void {
    const mainMessage = new ElementCreator({
      tag: 'div',
      classes: 'text-[#DFDDDF] text-8xl sd:text-[265px] mg:text-[350px] font-bold drop-shadow-[5px_4px_0px_rgba(57,62,77,0.18)]',
      text: hash,
    });

    this.categoryView.appendNode(mainMessage);
  }

  validateCategory(): boolean {
    const validCategories = ['summer-time', 'peak-climber', 'ball-games', 'ice-adventures'];
    return validCategories.includes(this.hash);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.categoryView;
  }

  getElement(): HTMLElement {
    return this.categoryView.getElement();
  }
}
