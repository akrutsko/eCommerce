import './header.css';
import logotype from '../../../assets/svg/logo-header.svg';
import cartSvg from '../../../assets/svg/cart.svg';
import customerSvg from '../../../assets/svg/customer.svg';

import { Consumer } from '../consumer/consumer';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { Router } from '../../router/router';

export class Header implements Observer {
  router: Router;

  consumer: Consumer;

  listOfLinks: HTMLAnchorElement[];

  headerView: ElementCreator<HTMLElement>;

  loginBtns: HTMLElement;

  logoutBtns: HTMLElement;

  loginButton: HTMLAnchorElement;

  signupButton: HTMLAnchorElement;

  signoutButton: HTMLButtonElement;

  constructor(router: Router, consumer: Consumer) {
    this.router = router;
    this.consumer = consumer;
    this.listOfLinks = [];
    this.headerView = new ElementCreator({ tag: 'header', classes: 'container' });
    this.loginBtns = new ElementCreator({ tag: 'div', classes: 'flex gap-6 hidden' }).getElement();
    this.logoutBtns = new ElementCreator({ tag: 'div', classes: 'items-center justify-between flex gap-6 hidden' }).getElement();
    this.loginButton = new ElementAnchorCreator({ href: '/login', text: 'log in', classes: 'primary-button' }).getElement();
    this.signupButton = new ElementAnchorCreator({ href: '/signup', text: 'sign up', classes: 'secondary-button' }).getElement();
    this.signoutButton = new ElementButtonCreator({ text: 'sign out', classes: 'secondary-button' })
      .setHandler('click', () => this.consumer.logOut())
      .getElement();

    this.createView();
    this.handleLinks();
  }

  createView(): void {
    const burger = new ElementCreator({ tag: 'div', classes: 'burger space-y-2 z-10 block md:hidden cursor-pointer' });
    const spanBurger1 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    const spanBurger2 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    const spanBurger3 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    burger.appendNode(spanBurger1, spanBurger2, spanBurger3);

    const nav = new ElementCreator({ tag: 'nav', classes: 'w-full flex items-center justify-between py-5 gap-8' });
    const logo = new ElementAnchorCreator({ href: '/', html: logotype });
    this.listOfLinks.push(logo.getElement());
    const mobileMenu = new ElementCreator({
      tag: 'div',
      classes: 'mobile-menu md:w-full md:max-w-full max-w-[390px] hidden justify-between md:flex gap-8',
    });
    const bg = new ElementCreator({ tag: 'div', classes: 'bg hidden' });
    nav.appendNode(logo, mobileMenu, burger, bg);

    const liHome = new ElementCreator({ tag: 'li' });
    const aHome = new ElementAnchorCreator({ href: '/', text: 'Home', classes: 'h4 hover:text-primary-color' });
    this.listOfLinks.push(aHome.getElement());
    liHome.appendNode(aHome);

    const liAboutUs = new ElementCreator({ tag: 'li' });
    const aAboutUs = new ElementAnchorCreator({ href: '/aboutus', text: 'About us', classes: 'h4 hover:text-primary-color' });
    this.listOfLinks.push(aAboutUs.getElement());
    liAboutUs.appendNode(aAboutUs);

    const liSummerTime = new ElementCreator({ tag: 'li' });
    const aSummerTime = new ElementAnchorCreator({
      href: '/categories#summer-time',
      classes: 'h5 hover:text-primary-color',
      text: 'Summer time',
    });
    this.listOfLinks.push(aSummerTime.getElement());
    liSummerTime.appendNode(aSummerTime);

    const liPeakClimber = new ElementCreator({ tag: 'li' });
    const aPeakClimber = new ElementAnchorCreator({
      href: '/categories#peak-climber',
      classes: 'h5 hover:text-primary-color',
      text: 'Peak climber',
    });
    this.listOfLinks.push(aPeakClimber.getElement());
    liPeakClimber.appendNode(aPeakClimber);

    const liBallGames = new ElementCreator({ tag: 'li' });
    const aBallGames = new ElementAnchorCreator({
      href: '/categories#ball-games',
      classes: 'h5 hover:text-primary-color',
      text: 'Ball games',
    });
    this.listOfLinks.push(aBallGames.getElement());
    liBallGames.appendNode(aBallGames);

    const liIceAdventures = new ElementCreator({ tag: 'li' });
    const aIceAdventures = new ElementAnchorCreator({
      href: '/categories#ice-adventures',
      classes: 'h5 hover:text-primary-color',
      text: 'Ice adventures',
    });
    this.listOfLinks.push(aIceAdventures.getElement());
    liIceAdventures.appendNode(aIceAdventures);

    const submenu = new ElementCreator({ tag: 'ul', classes: 'submenu absolute hidden bg-white px-2 py-1 w-max' });
    submenu.appendNode(liSummerTime, liPeakClimber, liBallGames, liIceAdventures);

    const tab = new ElementCreator({ tag: 'li', classes: 'relative z-10 group tab' });
    const categories = new ElementCreator({
      tag: 'div',
      text: 'Categories',
      classes: 'h4 hover:text-primary-color cursor-pointer',
    });
    tab.appendNode(categories, submenu);

    const linksList = new ElementCreator({ tag: 'ul', classes: 'items-center justify-between flex gap-5' });
    linksList.appendNode(liHome, liAboutUs, tab);

    const divCart = new ElementCreator({ tag: 'div', html: cartSvg });
    const aCart = new ElementAnchorCreator({ href: '/cart' });
    this.listOfLinks.push(aCart.getElement());
    divCart.appendNode(aCart);

    const divCustomer = new ElementCreator({ tag: 'div', html: customerSvg });
    const aCustomer = new ElementAnchorCreator({ href: '/profile' });
    this.listOfLinks.push(aCustomer.getElement());
    divCustomer.appendNode(aCustomer);

    this.loginBtns.append(this.signupButton, this.loginButton);
    this.logoutBtns.append(divCart.getElement(), divCustomer.getElement(), this.signoutButton);
    mobileMenu.appendNode(linksList, this.loginBtns, this.logoutBtns);
    this.headerView.appendNode(nav);

    burger.getElement().addEventListener('click', () => {
      mobileMenu.toggleClass('active');
      burger.toggleClass('active');
      bg.toggleClass('active');
      document.body.classList.toggle('active');
    });
    tab.getElement().addEventListener('mouseenter', () => {
      submenu.addClass('active');
    });
    tab.getElement().addEventListener('mouseleave', () => {
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

  handleLinks(): void {
    this.listOfLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (e.currentTarget instanceof HTMLAnchorElement) {
          e.preventDefault();
          window.history.pushState({}, '', e.currentTarget.href);
          this.router.handleLocation();
        }
      });
    });
  }
}
