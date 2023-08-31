import info from '../../../assets/svg/info.svg';
import delivery from '../../../assets/svg/delivery.svg';
import login from '../../../assets/svg/login.svg';
import billing from '../../../assets/svg/billing.svg';
import key from '../../../assets/svg/key.svg';

import { Consumer } from '../consumer/consumer';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { Router } from '../../router/router';
import { PersonalTab } from './tabs/personal-tab';
import { LoginTab } from './tabs/login-tab';
import { AddressTab } from './tabs/address-tab';
import { Addresses } from '../../enums/addresses';
import { PasswordTab } from './tabs/password-tab';

export class Profile {
  profileView: ElementCreator<HTMLElement>;

  router: Router;

  consumer: Consumer;

  constructor(router: Router, consumer: Consumer) {
    this.router = router;
    this.consumer = consumer;
    this.profileView = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] rounded-xl w-full flex-1 p-5 md:p-10 relative' });
    this.createView();
    this.handleAccordion();
  }

  createView(): void {
    if (!this.consumer) return;
    const title = new ElementCreator({ tag: 'h2', text: 'My account', classes: 'text-center' });

    const accordion = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-6 mt-5' });

    if (this.consumer) {
      const personalTab = new PersonalTab(this.consumer, info, 'Personal info').getElement();
      const deliveryTab = new AddressTab(this.consumer, delivery, 'Delivery addresses', Addresses.Shipping).getElement();
      const billingTab = new AddressTab(this.consumer, billing, 'Billing addresses', Addresses.Billing).getElement();
      const loginTab = new LoginTab(this.consumer, login, 'Login info').getElement();
      const passwordTab = new PasswordTab(this.consumer, key, 'Change password').getElement();

      accordion.appendNode(personalTab, deliveryTab, billingTab, loginTab, passwordTab);
    }

    this.profileView.appendNode(title, accordion);
  }

  handleAccordion(): void {
    const headers = this.getElement().querySelectorAll('.ac-header');
    headers.forEach((header) => {
      header.addEventListener('click', () => {
        header.nextElementSibling?.classList.toggle('hidden');
      });
    });
  }

  getView(): ElementCreator<HTMLElement> {
    return this.profileView;
  }

  getElement(): HTMLElement {
    return this.profileView.getElement();
  }
}
