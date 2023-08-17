import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Categories {
  сategoriesView: ElementCreator<HTMLElement>;

  constructor() {
    this.сategoriesView = new ElementCreator({
      tag: 'div',
      classes: 'bg-[#F1EFEF] rounded-xl w-full flex-1 p-5 md:p-10 relative',
    });
    this.createView();
  }

  createView(): void {
    const linkSummerTime = new ElementAnchorCreator({
      href: '/categories#summer-time',
      classes: 'h5 hover:text-primary-color',
      text: 'Summer time',
    });

    this.сategoriesView.appendNode(linkSummerTime);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.сategoriesView;
  }

  getElement(): HTMLElement {
    return this.сategoriesView.getElement();
  }
}
