import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './home.css';

import { advertisement } from './advertisement';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';

export class Home {
  homeView: HTMLElement;

  adsSwiper: Swiper | undefined;

  bestSellSwiper: Swiper | undefined;

  constructor() {
    this.homeView = new ElementCreator({ tag: 'div' }).getElement();
    this.createView();
  }

  createView(): void {
    this.initAdsSwiper(this.homeView);
  }

  initAdsSwiper(wrapper: HTMLElement): void {
    const swiperContainer = new ElementCreator({
      tag: 'div',
      classes: 'swiper swiper-ads max-w-5xl w-full rounded-xl overflow-hidden',
    });
    const swiperWrapper = new ElementCreator({ tag: 'div', classes: 'swiper-wrapper' });

    advertisement.forEach((ads) => {
      const imgWrapper = new ElementAnchorCreator({ href: ads.href, classes: 'swiper-slide' });
      imgWrapper.appendNode(new ElementImageCreator({ src: ads.img, alt: '', classes: 'w-full rounded-xl overflow-hidden' }));
      swiperWrapper.appendNode(imgWrapper);
    });

    const swiperPagination = new ElementCreator({ tag: 'div', classes: 'swiper-pagination' });
    swiperContainer.appendNode(swiperWrapper, swiperPagination.getElement());
    wrapper.append(swiperContainer.getElement());

    this.adsSwiper = new Swiper('.swiper-ads', {
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

  initSwiper(): void {
    if (!this.adsSwiper) return;
    this.adsSwiper.init();
  }

  getElement(): HTMLElement {
    return this.homeView;
  }
}
