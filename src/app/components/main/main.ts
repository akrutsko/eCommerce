import { ElementCreator } from '../../utils/element-creator/element-creator';
import { Router } from '../../router/router';
import { Consumer } from '../consumer/consumer';
import { getProductIdBySlug } from '../../utils/api/api-product';
import { Message } from '../../utils/message/toastify-message';

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

  update(rootRoute: string, pathRoutes: string[]): void {
    this.mainView.innerHTML = '';

    switch (rootRoute) {
      case '':
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
      case 'catalog':
        this.showCatalog();
        break;
      case 'profile':
        if (!this.consumer.isConsumer) {
          window.history.pushState({}, '', '/login');
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
      case 'categories': // TODO: refactor when sub-categories are available
        if (pathRoutes.length) {
          this.showCategories(pathRoutes[0]);
        } else {
          this.showCategories();
        }
        break;
      case 'product':
        this.showProduct(pathRoutes[0]);
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

  async showCatalog(): Promise<void> {
    const { Catalog } = await import('../catalog/catalog');
    this.mainView.append(new Catalog(this.router, this.consumer).getElement());
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

  async showCategories(subCategory?: string): Promise<void> {
    if (subCategory) {
      const { Category } = await import('../category/category');
      const categories = new Category(subCategory);
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

  async showProduct(slug: string): Promise<void> {
    const productResponse = await getProductIdBySlug(this.consumer.apiClient, slug).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!productResponse) return;

    const productId = productResponse.body.results[0]?.id;
    if (!productId) {
      this.show404();
      return;
    }

    const { Product } = await import('../product/product');
    this.mainView.append(new Product(this.router, this.consumer, productId).getElement());
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
