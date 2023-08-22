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
    const categories = new ElementCreator({
      tag: 'div',
      text: 'Categories',
      classes: 'h4 bg-white px-2 py-1 w-max',
    });

    this.сategoriesView.appendNode(categories);

    const linkSummerTime = new ElementAnchorCreator({
      href: '/categories#summer-time',
      classes: 'h5 hover:text-primary-color block',
      text: 'Summer time',
    });

    const linkPeakClimber = new ElementAnchorCreator({
      href: '/categories#peak-climber',
      classes: 'h5 hover:text-primary-color block',
      text: 'Peak climber',
    });

    const linkBallGames = new ElementAnchorCreator({
      href: '/categories#ball-games',
      classes: 'h5 hover:text-primary-color block',
      text: 'Ball games',
    });

    const linkIceAdventures = new ElementAnchorCreator({
      href: '/categories#ice-adventures',
      classes: 'h5 hover:text-primary-color block',
      text: 'Ice adventures',
    });
    categories.appendNode(linkSummerTime, linkPeakClimber, linkBallGames, linkIceAdventures);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.сategoriesView;
  }

  getElement(): HTMLElement {
    return this.сategoriesView.getElement();
  }
}
