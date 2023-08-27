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
    }).getElement();
  }

  getView(): HTMLElement {
    return this.mainView;
  }

  update(data?: string, hashData?: string): void {
    this.mainView.innerHTML = '';

    switch (data) {
      case 'main':
        this.showMain();
        break;
      case 'aboutus':
        this.showAboutUs();
        break;
      case 'contact':
        this.showContact();
        break;
      case 'goods':
        this.showGoods();
        break;
      case 'cart':
        this.showCart();
        break;
      case 'profile':
        if (!this.consumer.isConsumer) {
          window.history.pushState({}, '', '/signup');
          this.router.handleLocation();
        } else {
          this.showProfile();
        }
        break;
      case 'login':
        if (this.consumer.isConsumer) {
          window.history.pushState({}, '', '/');
          this.router.handleLocation();
        } else {
          this.showLogin();
        }
        break;
      case 'signup':
        if (this.consumer.isConsumer) {
          window.history.pushState({}, '', '/');
          this.router.handleLocation();
        } else {
          this.showSignup();
        }
        break;
      case 'categories':
        this.showCategories(hashData);
        break;
      case 'product':
        this.showProduct();
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

  async showContact(): Promise<void> {
    const { Contact } = await import('../contact/contact');
    this.mainView.append(new Contact().getElement());
  }

  async showCart(): Promise<void> {
    const { Cart } = await import('../cart/cart');
    this.mainView.append(new Cart().getElement());
  }

  async showProfile(): Promise<void> {
    const { Profile } = await import('../profile/profile');
    this.mainView.append(new Profile().getElement());
  }

  async showGoods(): Promise<void> {
    const { Goods } = await import('../goods/goods');
    this.mainView.append(new Goods().getElement());
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
    if (hashData) {
      const { Category } = await import('../category/category');
      const categories = new Category(hashData);
      if (categories.validateCategory()) {
        this.mainView.append(categories.getElement());
      } else {
        this.show404();
      }
    } else {
      const { Categories } = await import('../category/categories');
      this.mainView.append(new Categories().getElement());
    }
  }

  async showProduct(): Promise<void> {
    const { Product } = await import('../product/product');
    this.mainView.append(new Product(this.router, this.consumer, 'c43011cc-de74-406f-b68e-02c0441bcdb1').getElement()); // many images
    // this.mainView.append(new Product(this.router, this.consumer, 'c57f7614-3912-4eaf-83c2-184d26b2df0b').getElement()); // 1
    // this.mainView.append(new Product(this.router, this.consumer, 'ce2dbe51-075e-4b8f-b75a-843342cbe426').getElement()); // 2
  }

  async showSignup(): Promise<void> {
    const { Registration } = await import('../registration/registration');
    this.mainView.append(new Registration(this.router, this.consumer).getElement());
  }

  async show404(): Promise<void> {
    const { Absent } = await import('../absent/absent');
    this.mainView.append(new Absent(this.router).getElement());
  }
}
