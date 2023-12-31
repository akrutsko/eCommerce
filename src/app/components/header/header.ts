import './header.css';
import logotype from '../../../assets/svg/logo-header.svg';
import cartSvg from '../../../assets/svg/cart.svg';
import customerSvg from '../../../assets/svg/customer.svg';

import { Consumer } from '../consumer/consumer';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { Router } from '../../router/router';
import { CategoryTree } from '../../interfaces/category';

export class Header implements Observer {
  router: Router;

  consumer: Consumer;

  headerView: ElementCreator<HTMLElement>;

  loginBtns: HTMLElement;

  logoutBtns: HTMLElement;

  loginButton: HTMLButtonElement;

  signupButton: HTMLButtonElement;

  signoutButton: HTMLButtonElement;

  listOfLinks: HTMLAnchorElement[] = [];

  categories: CategoryTree[] = [];

  constructor(router: Router, consumer: Consumer) {
    this.router = router;
    this.consumer = consumer;
    this.headerView = new ElementCreator({ tag: 'header', classes: 'container' });
    this.loginBtns = new ElementCreator({ tag: 'div', classes: 'items-center flex gap-3 hidden md:gap-6' }).getElement();
    this.logoutBtns = new ElementCreator({
      tag: 'div',
      classes: 'items-center justify-between flex gap-3 hidden md:gap-6',
    }).getElement();
    this.loginButton = new ElementButtonCreator({ text: 'log in', classes: 'primary-button' }).getElement();
    this.signupButton = new ElementButtonCreator({ text: 'sign up', classes: 'secondary-button' }).getElement();
    this.signoutButton = new ElementButtonCreator({ text: 'sign out', classes: 'secondary-button' })
      .setHandler('click', () => {
        this.consumer.logOut();
        window.history.pushState({}, '', '/signup');
        this.router.handleLocation();
      })
      .getElement();

    this.createView();
  }

  async createView(): Promise<void> {
    const burger = new ElementCreator({
      tag: 'div',
      classes: 'burger space-y-2 z-40 block md:hidden cursor-pointer transition-transform',
    });
    const spanBurger1 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    const spanBurger2 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    const spanBurger3 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    burger.appendNode(spanBurger1, spanBurger2, spanBurger3);

    const nav = new ElementCreator({ tag: 'nav', classes: 'w-full flex items-center justify-between mt-5 gap-4 lg:gap-8' });
    const logo = new ElementAnchorCreator({ href: '/', html: logotype });
    logo.setHandler('click', (e) => {
      e.preventDefault();
      window.history.pushState({}, '', logo.getElement().href);
      this.router.handleLocation();
    });
    this.listOfLinks.push(logo.getElement());
    const mobileMenu = new ElementCreator({
      tag: 'div',
      classes: 'mobile-menu md:w-full md:max-w-full max-w-[390px] hidden justify-between md:flex gap-4 lg:gap-8',
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

    const tab = new ElementCreator({ tag: 'li', classes: 'relative z-10 group tab' });
    const catalog = new ElementAnchorCreator({
      href: '/catalog',
      text: 'Catalog',
      classes: 'h4 hover:text-primary-color cursor-pointer',
    });
    this.listOfLinks.push(catalog.getElement());
    tab.appendNode(catalog);

    const linksList = new ElementCreator({ tag: 'ul', classes: 'items-center justify-between flex gap-3 lg:gap-5' });
    linksList.appendNode(liHome, tab, liAboutUs);

    const divCart = new ElementCreator({ tag: 'div', classes: 'relative cart-button', html: cartSvg });
    const aCart = new ElementAnchorCreator({ href: '/cart', classes: 'absolute inset-0' });
    this.listOfLinks.push(aCart.getElement());
    divCart.appendNode(aCart);

    const divCustomer = new ElementCreator({ tag: 'div', classes: 'relative profile-button', html: customerSvg });
    const aCustomer = new ElementAnchorCreator({ href: '/profile', classes: 'absolute inset-0' });
    this.listOfLinks.push(aCustomer.getElement());
    divCustomer.appendNode(aCustomer);

    const allBtns = new ElementCreator({ tag: 'div', classes: 'items-center flex gap-3 md:gap-6' });
    this.loginBtns.append(divCart.getElement(), this.signupButton, this.loginButton);
    this.logoutBtns.append(divCart.getElement(), divCustomer.getElement(), this.signoutButton);
    allBtns.appendNode(divCart, this.loginBtns, this.logoutBtns);
    mobileMenu.appendNode(linksList, allBtns);
    this.headerView.appendNode(nav);

    const closeBurger = (): void => {
      mobileMenu.removeClass('active');
      burger.removeClass('active');
      bg.removeClass('active');
      document.body.classList.remove('active');
    };

    this.listOfLinks.forEach((link) => {
      link.addEventListener('click', () => closeBurger());
    });

    burger.getElement().addEventListener('click', () => {
      mobileMenu.toggleClass('active');
      burger.toggleClass('active');
      bg.toggleClass('active');
      document.body.classList.toggle('active');
    });

    this.loginButton.addEventListener('click', () => {
      window.history.pushState({}, '', '/login');
      this.router.handleLocation();
      closeBurger();
    });

    this.signupButton.addEventListener('click', () => {
      window.history.pushState({}, '', '/signup');
      this.router.handleLocation();
      closeBurger();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && burger.getElement().classList.contains('active')) {
        closeBurger();
      }
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

  getCategories(): CategoryTree[] {
    return this.categories;
  }
}
