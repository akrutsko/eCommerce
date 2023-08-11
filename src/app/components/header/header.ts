import './header.css';
import logotype from '../../../assets/svg/logo-header.svg';
import cartSvg from '../../../assets/svg/cart.svg';
import customerSvg from '../../../assets/svg/customer.svg';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
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

    const mobileMenu = new ElementCreator({
      tag: 'div',
      classes:
        'mobile-menu md:w-full md:max-w-full max-w-[390px] hidden justify-between md:flex gap-8',
    });

    const linksList = new ElementCreator({
      tag: 'ul',
      classes: 'items-center justify-between flex gap-5',
    });

    const liHome = new ElementCreator({ tag: 'li' });

    const aHome = new ElementAnchorCreator({
      href: '#',
      text: 'Home',
      classes: 'h4 hover:text-primary-color',
    });
    liHome.appendNode(aHome);

    const liAboutUs = new ElementCreator({ tag: 'li' });

    const aAboutUs = new ElementAnchorCreator({
      href: '#',
      text: 'About us',
      classes: 'h4 hover:text-primary-color',
    });
    liAboutUs.appendNode(aAboutUs);

    const tab = new ElementCreator({ tag: 'li', classes: 'relative group tab' });
    linksList.appendNode(liHome).appendNode(liAboutUs).appendNode(tab);

    const aCategories = new ElementAnchorCreator({
      href: '#',
      text: 'Categories',
      classes: 'h4 hover:text-primary-color',
    });

    const submenu = new ElementCreator({
      tag: 'ul',
      classes: 'submenu absolute hidden bg-white px-2 py-1 w-max',
    });
    tab.appendNode(aCategories).appendNode(submenu);

    const liSummerTime = new ElementCreator({ tag: 'li' });

    const aSummerTime = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Summer time',
    });
    liSummerTime.appendNode(aSummerTime);

    const liPeakClimber = new ElementCreator({ tag: 'li' });

    const aPeakClimber = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Peak climber',
    });
    liPeakClimber.appendNode(aPeakClimber);

    const liBallGames = new ElementCreator({ tag: 'li' });

    const aBallGames = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Ball games',
    });
    liBallGames.appendNode(aBallGames);

    const liIceAdventures = new ElementCreator({ tag: 'li' });
    submenu
      .appendNode(liSummerTime)
      .appendNode(liPeakClimber)
      .appendNode(liBallGames)
      .appendNode(liIceAdventures);

    const aIceAdventures = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Ice adventures',
    });
    liIceAdventures.appendNode(aIceAdventures);

    const divBtnsLogin = new ElementCreator({ tag: 'div', classes: 'flex gap-6' });

    const btnSignUp = new ElementButtonCreator({
      tag: 'button',
      text: 'sign up',
      classes: 'secondary-button',
    });

    const btnLogIn = new ElementButtonCreator({
      tag: 'button',
      text: 'log in',
      classes: 'primary-button',
    });

    divBtnsLogin.appendNode(btnSignUp).appendNode(btnLogIn);

    const divBtnsSignOut = new ElementCreator({ tag: 'div', classes: 'items-center justify-between flex gap-6 hidden' });
    mobileMenu.appendNode(linksList).appendNode(divBtnsLogin).appendNode(divBtnsSignOut);

    const divCart = new ElementCreator({ tag: 'div', html: cartSvg });
    const aCart = new ElementAnchorCreator({ href: '#' });
    divCart.appendNode(aCart);

    const divCustomer = new ElementCreator({ tag: 'div', html: customerSvg });
    const aCustomer = new ElementAnchorCreator({ href: '#' });
    divCustomer.appendNode(aCustomer);

    const btnSignOut = new ElementButtonCreator({
      tag: 'button',
      text: 'sign out',
      classes: 'secondary-button',
    });

    divBtnsSignOut.appendNode(divCart).appendNode(divCustomer).appendNode(btnSignOut);

    const burger = new ElementCreator({
      tag: 'div',
      classes: 'burger space-y-2 z-10 block md:hidden',
    });

    const spanBurger1 = new ElementCreator({
      tag: 'span',
      classes: 'block w-8 h-0.5 bg-secondary-color',
    });
    const spanBurger2 = new ElementCreator({
      tag: 'span',
      classes: 'block w-8 h-0.5 bg-secondary-color',
    });
    const spanBurger3 = new ElementCreator({
      tag: 'span',
      classes: 'block w-8 h-0.5 bg-secondary-color',
    });
    burger.appendNode(spanBurger1).appendNode(spanBurger2).appendNode(spanBurger3);

    const bg = new ElementCreator({ tag: 'div', classes: 'bg hidden' });
    nav.appendNode(logo).appendNode(mobileMenu).appendNode(burger).appendNode(bg);

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

    // temp
    btnLogIn.getElement().addEventListener('click', (): void => {
      divBtnsLogin.getElement().classList.add('hidden');
      divBtnsSignOut.getElement().classList.remove('hidden');
    });

    // temp
    btnSignOut.getElement().addEventListener('click', (): void => {
      divBtnsLogin.getElement().classList.remove('hidden');
      divBtnsSignOut.getElement().classList.add('hidden');
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
