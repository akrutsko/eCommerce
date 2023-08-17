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

  update(data?: string, hashData?: string): void {
    this.mainView.textContent = '';

    switch (data) {
      case 'main':
        this.showMain();
        break;
      case 'aboutus':
        this.showAboutUs();
        break;
      case 'login':
        if (this.consumer.isConsumer) {
          this.showMain();
        } else {
          this.showLogin();
        }
        break;
      case 'signup':
        if (this.consumer.isConsumer) {
          this.showMain();
        } else {
          this.showSignup();
        }
        break;
      case 'categories':
        this.showCategories(hashData);
        break;
      default:
        this.show404();
    }
  }

  showMain(): void {
    const mainMessage = new ElementCreator({
      tag: 'div',
      classes: 'text-[#DFDDDF] text-8xl sd:text-[265px] mg:text-[350px] font-bold drop-shadow-[5px_4px_0px_rgba(57,62,77,0.18)]',
      text: 'Main page',
    });
    this.mainView.append(mainMessage.getElement());
  }

  async showAboutUs(): Promise<void> {
    const { AboutUs } = await import('../aboutus/aboutus');
    this.mainView.append(new AboutUs().getElement());
  }

  async showLogin(): Promise<void> {
    const { Login } = await import('../login/login');
    this.mainView.append(new Login(this.router, this.consumer).getElement());
  }

  async showCategories(hashData?: string): Promise<void> {
    // validateHashCaterories(hashData);
    if (hashData) {
      this.mainView.textContent = hashData;
    } else {
      const { Categories } = await import('../category/categories');
      this.mainView.append(new Categories().getElement());
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
