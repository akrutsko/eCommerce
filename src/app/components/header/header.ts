import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import './header.css';
import logotype from '../../../assets/svg/logo-header.svg';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';

class Header {
  headerView: ElementCreator<HTMLElement>;

  constructor() {
    this.headerView = new ElementCreator({
      tag: 'header',
      classes: 'container',
    });
    this.createView();
  }

  createView(): void {
    const nav = new ElementCreator({
      tag: 'nav',
      classes: 'w-full flex items-center justify-between py-5 gap-8',
    });
    this.headerView.appendNode(nav);

    const logo = new ElementAnchorCreator({
      href: '#',
      html: logotype,
    });
    nav.appendNode(logo);

    const mobileMenu = new ElementCreator({
      tag: 'div',
      classes:
        'mobile-menu md:w-full md:max-w-full max-w-[390px] hidden justify-between md:flex gap-8',
    });
    nav.appendNode(mobileMenu);

    const ul = new ElementCreator({
      tag: 'ul',
      classes: 'items-center justify-between flex gap-5',
    });
    mobileMenu.appendNode(ul);

    const liHome = new ElementCreator({ tag: 'li' });
    ul.appendNode(liHome);

    const aHome = new ElementAnchorCreator({
      href: '#',
      text: 'Home',
      classes: 'h4 hover:text-primary-color',
    });
    liHome.appendNode(aHome);

    const liAboutUs = new ElementCreator({ tag: 'li' });
    ul.appendNode(liAboutUs);

    const aAboutUs = new ElementAnchorCreator({
      href: '#',
      text: 'About us',
      classes: 'h4 hover:text-primary-color',
    });
    liAboutUs.appendNode(aAboutUs);

    const tab = new ElementCreator({ tag: 'li', classes: 'relative group tab' });
    ul.appendNode(tab);

    const aCategories = new ElementAnchorCreator({
      href: '#',
      text: 'Categories',
      classes: 'h4 hover:text-primary-color',
    });
    tab.appendNode(aCategories);

    const submenu = new ElementCreator({
      tag: 'ul',
      classes: 'submenu absolute hidden bg-white px-2 py-1 w-max',
    });
    tab.appendNode(submenu);

    const liSummerTime = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liSummerTime);

    const aSummerTime = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Summer time',
    });
    liSummerTime.appendNode(aSummerTime);

    const liPeakClimber = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liPeakClimber);

    const aPeakClimber = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Peak climber',
    });
    liPeakClimber.appendNode(aPeakClimber);

    const liBallGames = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liBallGames);

    const aBallGames = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Ball games',
    });
    liBallGames.appendNode(aBallGames);

    const liIceAdventures = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liIceAdventures);

    const aIceAdventures = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Ice adventures',
    });
    liIceAdventures.appendNode(aIceAdventures);

    const divBtns = new ElementCreator({ tag: 'div', classes: 'flex gap-6' });
    mobileMenu.appendNode(divBtns);

    const btnSignUp = new ElementButtonCreator({
      tag: 'button',
      text: 'sign up',
      classes: 'secondary-button',
    });
    divBtns.appendNode(btnSignUp);

    const btnLogIn = new ElementButtonCreator({
      tag: 'button',
      text: 'log in',
      classes: 'primary-button',
    });
    divBtns.appendNode(btnLogIn);

    const burger = new ElementCreator({
      tag: 'div',
      classes: 'burger space-y-2 z-10 block md:hidden',
    });
    nav.appendNode(burger);

    const spanBurger1 = new ElementCreator({
      tag: 'span',
      classes: 'block w-8 h-0.5 bg-secondary-color',
    });
    burger.appendNode(spanBurger1);
    const spanBurger2 = new ElementCreator({
      tag: 'span',
      classes: 'block w-8 h-0.5 bg-secondary-color',
    });
    burger.appendNode(spanBurger2);
    const spanBurger3 = new ElementCreator({
      tag: 'span',
      classes: 'block w-8 h-0.5 bg-secondary-color',
    });
    burger.appendNode(spanBurger3);

    const bg = new ElementCreator({ tag: 'div', classes: 'bg hidden' });
    nav.appendNode(bg);

    burger.getElement().addEventListener('click', () => {
      mobileMenu.getElement().classList.toggle('active');
      burger.getElement().classList.toggle('active');
      bg.getElement().classList.toggle('active');
      document.body.classList.toggle('active');
    });
    tab.getElement().addEventListener('click', () => {
      submenu.getElement().classList.add('active');
    });
    submenu.getElement().addEventListener('mouseleave', () => {
      submenu.getElement().classList.remove('active');
    });
  }

  getView(): ElementCreator<HTMLElement> {
    return this.headerView;
  }

  getElement(): HTMLElement {
    return this.headerView.getElement();
  }
}

export { Header };
