import { ElementCreator } from '../../utils/element-creator/element-creator';
import { Router } from '../../router/router';
import { Consumer } from '../consumer/consumer';

export class Main implements Observer {
  router: Router;

  consumer: Consumer;

  mainView: HTMLElement;

  constructor(router: Router, consumer: Consumer) {
    this.router = router;
    this.consumer = consumer;

    this.mainView = new ElementCreator({
      tag: 'main',
      classes: 'container flex flex-col grow justify-center items-center h-full my-5 md:my-10',
      text: 'main',
    }).getElement();
  }

  getView(): HTMLElement {
    return this.mainView;
  }

  update(data?: string, secondaryData?: string): void {
    this.mainView.textContent = '';

    switch (data) {
      case 'main':
        this.showMain();
        break;
      case 'login':
        if (this.consumer.isConsumer) {
          this.showMain();
        } else {
          this.showLogin();
        }
        break;
      case 'signup':
        this.showSignup();
        break;
      case 'categories':
        this.showCategories(secondaryData);
        break;
      default:
        this.show404();
    }
  }

  showMain(): void {
    this.mainView.textContent = 'main';
  }

  async showLogin(): Promise<void> {
    const { Login } = await import('../login/login');
    this.mainView.append(new Login(this.router, this.consumer).getElement());
  }

  showCategories(secondaryData?: string): void {
    if (secondaryData) {
      this.mainView.textContent = secondaryData;
    }
  }

  async showSignup(): Promise<void> {
    const { Registration } = await import('../registration/registration');
    this.mainView.append(new Registration().getElement());
  }

  async show404(): Promise<void> {
    const { Absent } = await import('../absent/absent');
    this.mainView.append(new Absent().getElement());
  }
}
