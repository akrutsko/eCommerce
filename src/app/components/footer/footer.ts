import logotype from '../../../assets/svg/logo.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { Router } from '../../router/router';

export class Footer {
  router: Router;

  footerView: ElementCreator<HTMLElement>;

  constructor(router: Router) {
    this.router = router;
    this.footerView = new ElementCreator({
      tag: 'footer',
      classes:
        'flex flex-col-reverse items-center justify-center bg-secondary-color py-10 gap-4 sm:gap-10 sm:flex-row sm:justify-between',
    });
    this.createView();
  }

  createView(): void {
    const container = new ElementCreator({ tag: 'div', classes: 'container' });
    const logo = new ElementCreator({
      tag: 'div',
      classes: 'hidden sm:block text-opacity-70 max-w-[157px] text-white w-full text-[8px] -font--secondary-font-family',
      html: logotype,
    });
    const slogan = new ElementCreator({
      tag: 'div',
      classes: 'mb-1',
      text: 'Unleash Your Inner Athlete. Elevate\u00A0Your\u00A0Game with Every Click!',
    });
    const copyright = new ElementCreator({ tag: 'div', text: 'ⓒ2023 Peak Pulse. All rights are reserved.' });
    logo.appendNode(slogan, copyright);

    const nav = new ElementCreator({ tag: 'div', classes: 'text-white w-full flex justify-between max-w-xs' });
    const companyWrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col' });
    const companyHeading = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Company' });
    const aboutLink = new ElementAnchorCreator({ href: '/aboutus', classes: 'text-[10px]', text: 'About us' });
    const contactLink = new ElementAnchorCreator({ href: '/contact', classes: 'text-[10px]', text: 'Contact' });
    companyWrapper.appendNode(companyHeading, aboutLink, contactLink);

    const socialWrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col' });
    const socialHeading = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Social' });
    const instagramLink = new ElementAnchorCreator({
      href: 'https://www.instagram.com/rsschool_news/',
      classes: 'text-[10px]',
      text: 'Instagram',
    });
    const facebookLink = new ElementAnchorCreator({
      href: 'https://www.facebook.com/rsschoolEN/',
      classes: 'text-[10px]',
      text: 'Facebook',
    });
    socialWrapper.appendNode(socialHeading, instagramLink, facebookLink);

    const productsWrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col' });
    const productsHeading = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Products' });

    const categoriesLink = new ElementAnchorCreator({ href: '/categories', classes: 'text-[10px]', text: 'All products' });

    const sellersLink = new ElementAnchorCreator({ href: '/goods', classes: 'text-[10px]', text: 'Goods' });
    productsWrapper.appendNode(productsHeading, categoriesLink, sellersLink);

    nav.appendNode(companyWrapper, socialWrapper, productsWrapper);
    container.appendNode(logo, nav);
    this.footerView.appendNode(container);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.footerView;
  }

  getElement(): HTMLElement {
    return this.footerView.getElement();
  }
}
