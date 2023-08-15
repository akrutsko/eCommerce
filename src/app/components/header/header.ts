import './header.css';
import logotype from '../../../assets/svg/logo-header.svg';
import cartSvg from '../../../assets/svg/cart.svg';
import customerSvg from '../../../assets/svg/customer.svg';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { Consumer } from '../consumer/consumer';

export class Header implements Observer {
  headerView: ElementCreator<HTMLElement>;

  loginBtns: HTMLElement;

  logoutBtns: HTMLElement;

  loginButton: HTMLElement;

  signupButton: HTMLElement;

  signoutButton: HTMLButtonElement;

  constructor(private consumer: Consumer) {
    this.headerView = new ElementCreator({ tag: 'header', classes: 'container' });
    this.loginBtns = new ElementCreator({ tag: 'div', classes: 'flex gap-6 hidden' }).getElement();
    this.logoutBtns = new ElementCreator({ tag: 'div', classes: 'items-center justify-between flex gap-6 hidden' }).getElement();
    this.loginButton = new ElementAnchorCreator({ href: '/login', text: 'log in', classes: 'primary-button' }).getElement();
    this.signupButton = new ElementAnchorCreator({ href: '/signup', text: 'sign up', classes: 'secondary-button' }).getElement();
    this.signoutButton = new ElementButtonCreator({ tag: 'button', text: 'sign out', classes: 'secondary-button' }).getElement();

    this.createView();
  }

  createView(): void {
    const nav = new ElementCreator({ tag: 'nav', classes: 'w-full flex items-center justify-between py-5 gap-8' });
    const logo = new ElementAnchorCreator({ href: '/', html: logotype });
    const mobileMenu = new ElementCreator({
      tag: 'div',
      classes: 'mobile-menu md:w-full md:max-w-full max-w-[390px] hidden justify-between md:flex gap-8',
    });
    const burger = new ElementCreator({ tag: 'div', classes: 'burger space-y-2 z-10 block md:hidden' });
    const spanBurger1 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    const spanBurger2 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    const spanBurger3 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    burger.appendNode(spanBurger1).appendNode(spanBurger2).appendNode(spanBurger3);
    const bg = new ElementCreator({ tag: 'div', classes: 'bg hidden' });
    nav.appendNode(logo).appendNode(mobileMenu).appendNode(burger).appendNode(bg);

    const submenu = new ElementCreator({ tag: 'ul', classes: 'submenu absolute hidden bg-white px-2 py-1 w-max' });

    const liHome = new ElementCreator({ tag: 'li' });
    const aHome = new ElementAnchorCreator({ href: '#', text: 'Home', classes: 'h4 hover:text-primary-color' });
    liHome.appendNode(aHome);

    const liAboutUs = new ElementCreator({ tag: 'li' });
    const aAboutUs = new ElementAnchorCreator({ href: '#', text: 'About us', classes: 'h4 hover:text-primary-color' });
    liAboutUs.appendNode(aAboutUs);

    const liSummerTime = new ElementCreator({ tag: 'li' });
    const aSummerTime = new ElementAnchorCreator({ href: '#', classes: 'h5 hover:text-primary-color', text: 'Summer time' });
    liSummerTime.appendNode(aSummerTime);

    const liPeakClimber = new ElementCreator({ tag: 'li' });
    const aPeakClimber = new ElementAnchorCreator({ href: '#', classes: 'h5 hover:text-primary-color', text: 'Peak climber' });
    liPeakClimber.appendNode(aPeakClimber);

    const liBallGames = new ElementCreator({ tag: 'li' });
    const aBallGames = new ElementAnchorCreator({ href: '#', classes: 'h5 hover:text-primary-color', text: 'Ball games' });
    liBallGames.appendNode(aBallGames);

    const liIceAdventures = new ElementCreator({ tag: 'li' });
    const aIceAdventures = new ElementAnchorCreator({
      href: '#',
      classes: 'h5 hover:text-primary-color',
      text: 'Ice adventures',
    });
    liIceAdventures.appendNode(aIceAdventures);

    submenu.appendNode(liSummerTime).appendNode(liPeakClimber).appendNode(liBallGames).appendNode(liIceAdventures);

    const tab = new ElementCreator({ tag: 'li', classes: 'relative group tab' });
    const aCategories = new ElementAnchorCreator({ href: '#', text: 'Categories', classes: 'h4 hover:text-primary-color' });
    tab.appendNode(aCategories).appendNode(submenu);

    const linksList = new ElementCreator({ tag: 'ul', classes: 'items-center justify-between flex gap-5' });
    linksList.appendNode(liHome).appendNode(liAboutUs).appendNode(tab);

    const divCart = new ElementCreator({ tag: 'div', html: cartSvg });
    const aCart = new ElementAnchorCreator({ href: '#' });
    divCart.appendNode(aCart);

    const divCustomer = new ElementCreator({ tag: 'div', html: customerSvg });
    const aCustomer = new ElementAnchorCreator({ href: '#' });
    divCustomer.appendNode(aCustomer);

    this.loginBtns.append(this.signupButton, this.loginButton);
    this.logoutBtns.append(divCart.getElement(), divCustomer.getElement(), this.signoutButton);
    mobileMenu.appendNode(linksList).appendNode(this.loginBtns).appendNode(this.logoutBtns);
    this.headerView.appendNode(nav);

    burger.getElement().addEventListener('click', () => {
      mobileMenu.toggleClass('active');
      burger.toggleClass('active');
      bg.toggleClass('active');
      document.body.classList.toggle('active');
    });
    tab.getElement().addEventListener('click', () => {
      submenu.addClass('active');
    });
    submenu.getElement().addEventListener('mouseleave', () => {
      submenu.removeClass('active');
    });
  }

  getView(): ElementCreator<HTMLElement> {
    return this.headerView;
  }

  getElement(): HTMLElement {
    return this.headerView.getElement();
  }

  update(): void {
    if (this.consumer.isConsumer) {
      this.loginBtns.classList.add('hidden');
      this.logoutBtns.classList.remove('hidden');
    } else {
      this.loginBtns.classList.remove('hidden');
      this.logoutBtns.classList.add('hidden');
    }
  }

  handleButtons(): void {
    this.loginButton.addEventListener('click', () => this.consumer.logIn('ak@test.com', 'ak'));
    this.signoutButton.addEventListener('click', () => this.consumer.logOut());
  }
}
