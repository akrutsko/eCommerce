import logotype from '../../../assets/svg/logo.svg';
import searchIcon from '../../../assets/svg/search.svg';

import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';

export class Footer {
  footerView: ElementCreator<HTMLElement>;

  constructor() {
    this.footerView = new ElementCreator({
      tag: 'footer',
      classes:
        'container flex flex-col-reverse items-center justify-center bg-secondary-color py-10 gap-4 sm:gap-10 sm:flex-row sm:justify-between',
    });
    this.createView();
  }

  createView(): void {
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
    const copyright = new ElementCreator({
      tag: 'div',
      text: 'ⓒ2023 Peak Pulse. All rights are reserved.',
    });
    logo.appendNode(slogan).appendNode(copyright);

    const nav = new ElementCreator({
      tag: 'div',
      classes: 'text-white w-full flex justify-between max-w-xs',
    });
    const companyWrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col' });
    const companyHeading = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Company' });
    const aboutLink = new ElementAnchorCreator({
      href: '#',
      classes: 'text-[10px]',
      text: 'About us',
    });
    const contactLink = new ElementAnchorCreator({
      href: '#',
      classes: 'text-[10px]',
      text: 'Contact',
    });
    companyWrapper.appendNode(companyHeading).appendNode(aboutLink).appendNode(contactLink);

    const socialWrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col' });
    const socialHeading = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Social' });
    const instagramLink = new ElementAnchorCreator({
      href: '#',
      classes: 'text-[10px]',
      text: 'Instagram',
    });
    const facebookLink = new ElementAnchorCreator({
      href: '#',
      classes: 'text-[10px]',
      text: 'Facebook',
    });
    socialWrapper.appendNode(socialHeading).appendNode(instagramLink).appendNode(facebookLink);

    const productsWrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col' });
    const productsHeading = new ElementCreator({ tag: 'h5', classes: 'h5', text: 'Prodcuts' });
    const categoriesLink = new ElementAnchorCreator({
      href: '#',
      classes: 'text-[10px]',
      text: 'Categories',
    });
    const sellersLink = new ElementAnchorCreator({
      href: '#',
      classes: 'text-[10px]',
      text: 'Top sellers',
    });
    productsWrapper.appendNode(productsHeading).appendNode(categoriesLink).appendNode(sellersLink);

    const form = new ElementCreator({ tag: 'form', classes: 'search-form' });
    const input = new ElementInputCreator({
      type: 'search',
      name: 'search',
      placeholder: 'search',
    });
    const submitButton = new ElementButtonCreator({
      classes: 'absolute right-0 top-0 focus:outline-none',
      html: searchIcon,
    });
    form.appendNode(input).appendNode(submitButton);

    nav.appendNode(companyWrapper).appendNode(socialWrapper).appendNode(productsWrapper);
    this.footerView.appendNode(logo).appendNode(nav).appendNode(form);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.footerView;
  }

  getElement(): HTMLElement {
    return this.footerView.getElement();
  }
}
