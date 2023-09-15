import { Autoplay, Pagination } from 'swiper/modules';
import Swiper from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ads1 from '../../../assets/img/advertisement/ads1.png';
import ads2 from '../../../assets/img/advertisement/ads2.png';
import ads3 from '../../../assets/img/advertisement/ads3.png';

import summer from '../../../assets/img/categories/summer.png';
import peak from '../../../assets/img/categories/peak.png';
import ball from '../../../assets/img/categories/ball.png';
import ice from '../../../assets/img/categories/ice.png';

import { Router } from '../../router/router';
import { Consumer } from '../consumer/consumer';
import { Message } from '../../utils/message/toastify-message';
import { getProductIdBySlug } from '../../utils/api/api-product';
import { getTreeOfCategories } from '../../utils/api/api-categories';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';

const advertisement = [
  { img: ads1, href: '/categories/water-sports-gear' },
  { img: ads2, href: '/catalog' },
  { img: ads3, href: '/categories/peak-climber' },
];

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

    if (rootRoute !== 'categories' && rootRoute !== 'product') {
      if (pathRoutes.length !== 0) {
        this.show404();
        return;
      }
    }

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
      case 'categories':
        this.showCategories(pathRoutes[0]);
        break;
      case 'product':
        this.showProduct(pathRoutes[0]);
        break;
      default:
        this.show404();
    }
  }

  initAdsSwiper(wrapper: HTMLElement): void {
    const swiperContainer = new ElementCreator({ tag: 'div', classes: 'swiper w-full rounded-xl overflow-hidden' });
    const swiperWrapper = new ElementCreator({ tag: 'div', classes: 'swiper-wrapper' });

    advertisement.forEach((ads) => {
      const imgWrapper = new ElementAnchorCreator({ href: ads.href, classes: 'swiper-slide' });
      imgWrapper.setHandler('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', imgWrapper.getElement().href);
        this.router.handleLocation();
      });
      imgWrapper.appendNode(new ElementImageCreator({ src: ads.img, alt: '', classes: 'w-full rounded-xl overflow-hidden' }));
      swiperWrapper.appendNode(imgWrapper);
    });

    const swiperPagination = new ElementCreator({ tag: 'div', classes: 'swiper-pagination' });
    swiperContainer.appendNode(swiperWrapper, swiperPagination.getElement());
    wrapper.append(swiperContainer.getElement());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const swiper = new Swiper('.swiper', {
      modules: [Pagination, Autoplay],
      slidesPerView: 1,
      centerInsufficientSlides: true,
      spaceBetween: 10,
      direction: 'horizontal',
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
    });
  }

  showMain(): void {
    this.initAdsSwiper(this.mainView);
    const links = [];
    const categories = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] rounded-xl w-full p-4 md:p-6 mt-6' });

    const categoriesTitleContainer = new ElementCreator({ tag: 'div', classes: 'text-center my-4 sm:text-start' });
    const categoriesSubtitle = new ElementCreator({ tag: 'h5', classes: 'h5 opacity-60', text: 'find something you enjoy' });
    const categoriesTitle = new ElementCreator({ tag: 'h2', classes: '', text: 'Categories' });
    categoriesTitleContainer.appendNode(categoriesSubtitle, categoriesTitle);

    const categoriesContainer = new ElementCreator({
      tag: 'div',
      classes: 'grid grid-rows-2 grid-cols-2 gap-2 md:gap-4 lg:gap-6',
    });

    const summerTime = new ElementAnchorCreator({
      href: '/categories/summer-time',
      classes:
        'bg-primary-color p-6 md:p-0 rounded-xl flex hover:drop-shadow-[3px_5px_5px_rgba(219,76,67,0.40)] hover:scale-[1.01] transition-all',
    });
    const summerTimeImage = new ElementCreator({ tag: 'div', classes: 'self-end hidden md:block' });
    summerTimeImage.appendNode(new ElementImageCreator({ src: summer, alt: '' }));
    const summerTitle = new ElementCreator({
      tag: 'div',
      classes: 'self-center open-sans font-semibold w-full text-center text-[3vw] text-white',
      text: 'Summer time',
    });
    summerTime.appendNode(summerTimeImage, summerTitle);
    links.push(summerTime);

    const peakClimber = new ElementAnchorCreator({
      href: '/categories/peak-climber',
      classes:
        'bg-[#FFBA5A] p-6 md:p-0 rounded-xl flex hover:drop-shadow-[3px_5px_5px_rgba(226,164,78,0.40)] hover:scale-[1.01] transition-all',
    });
    const peakClimberImage = new ElementCreator({ tag: 'div', classes: 'hidden md:block' });
    peakClimberImage.appendNode(new ElementImageCreator({ src: peak, alt: '', classes: 'h-full' }));
    const peakClimberTitle = new ElementCreator({
      tag: 'div',
      classes: 'self-center open-sans font-semibold w-full text-center text-[3vw] text-white',
      text: 'Peak climber',
    });
    peakClimber.appendNode(peakClimberTitle, peakClimberImage);
    links.push(peakClimber);

    const ballGames = new ElementAnchorCreator({
      href: '/categories/ball-games',
      classes:
        'bg-[#4C7EC9] p-6 md:p-0 rounded-xl flex hover:drop-shadow-[3px_5px_5px_rgba(76,126,201,0.40)] hover:scale-[1.01] transition-all',
    });
    const ballGamesImage = new ElementCreator({ tag: 'div', classes: 'self-end hidden md:block' });
    ballGamesImage.appendNode(new ElementImageCreator({ src: ball, alt: '' }));
    const ballGamesTitle = new ElementCreator({
      tag: 'div',
      classes: 'self-center open-sans font-semibold w-full text-center text-[3vw] text-white',
      text: 'Ball games',
    });
    ballGames.appendNode(ballGamesTitle, ballGamesImage);
    links.push(ballGames);

    const iceAdventures = new ElementAnchorCreator({
      href: '/categories/ice-adventures',
      classes:
        'bg-[#3D93A3] p-6 md:p-0 rounded-xl flex hover:drop-shadow-[3px_5px_5px_rgba(61,147,163,0.40)] hover:scale-[1.01] transition-all',
    });
    const iceAdventuresImage = new ElementCreator({ tag: 'div', classes: 'self-end hidden md:block' });
    iceAdventuresImage.appendNode(new ElementImageCreator({ src: ice, alt: '' }));
    const iceAdventuresTitle = new ElementCreator({
      tag: 'div',
      classes: 'self-center open-sans font-semibold w-full text-center text-[3vw] text-white',
      text: 'Ice adventures',
    });
    iceAdventures.appendNode(iceAdventuresImage, iceAdventuresTitle);
    links.push(iceAdventures);

    categoriesContainer.appendNode(summerTime, peakClimber, ballGames, iceAdventures);
    categories.appendNode(categoriesTitleContainer, categoriesContainer);

    links.forEach((link) => {
      link.setHandler('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', link.getElement().href);
        this.router.handleLocation();
      });
    });

    this.mainView.append(categories.getElement());
  }

  async showContact(): Promise<void> {
    const { Contact } = await import('../contact/contact');
    this.mainView.append(new Contact().getElement());
  }

  async showCart(): Promise<void> {
    const { Cart } = await import('../cart/cart');
    this.mainView.append(new Cart(this.consumer).getElement());
  }

  async showCatalog(): Promise<void> {
    const { Catalog } = await import('../catalog/catalog');
    this.mainView.append(new Catalog(this.router, this.consumer).getElement());
  }

  async showProfile(): Promise<void> {
    const { Profile } = await import('../profile/profile');
    this.mainView.append(new Profile(this.router, this.consumer).getElement());
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

  async showCategories(category: string): Promise<void> {
    const categories = await getTreeOfCategories(this.consumer.apiClient).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!categories || !categories.length) return;

    if (category) {
      const isCategory = categories.find(
        (cat) => cat.slug === category || cat.children?.filter((child) => child.slug === category).length,
      );
      if (!isCategory) {
        this.show404();
        return;
      }
    }

    const { Catalog } = await import('../catalog/catalog');
    this.mainView.append(new Catalog(this.router, this.consumer, category).getElement());
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
