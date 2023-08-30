import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './product-modal.css';

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { Modal } from './modal';

export class ProductModal extends Modal {
  productData: ProductProjection;

  swiper: Swiper | undefined;

  constructor(productData: ProductProjection) {
    super();
    this.productData = productData;

    this.setView();
  }

  setView(): void {
    if (!this.productData.masterVariant.images) return;

    const images = this.productData.masterVariant.images.map((image) => image.url);

    const swiperContainer = new ElementCreator({ tag: 'div', classes: 'swiper swiper-modal max-w-5xl' });
    const swiperWrapper = new ElementCreator({ tag: 'div', classes: 'swiper-wrapper items-center' });
    images.forEach((image) => {
      const imgWrapper = new ElementCreator({ tag: 'div', classes: 'swiper-slide swiper-slide-modal bg-white' });
      const sliderImage = new ElementImageCreator({ src: image, alt: '', classes: 'object-cover' });
      imgWrapper.appendNode(sliderImage);
      swiperWrapper.appendNode(imgWrapper);
    });
    swiperContainer.appendNode(swiperWrapper);

    const swiperPrevButton = new ElementCreator({ tag: 'div', classes: 'swiper-button-prev swiper-button-prev-modal' });
    const swiperNextButton = new ElementCreator({ tag: 'div', classes: 'swiper-button-next swiper-button-next-modal' });
    this.getView().appendNode(swiperContainer, swiperPrevButton, swiperNextButton);

    this.swiper = new Swiper('.swiper-modal', {
      modules: [Navigation],
      slidesPerView: 1,
      direction: 'horizontal',
      loop: true,
      navigation: { prevEl: '.swiper-button-prev-modal', nextEl: '.swiper-button-next-modal' },
    });
  }

  initSwiper(index = 0): void {
    if (!this.swiper) return;
    this.swiper.init();
    this.swiper.slideTo(index, 0);
  }
}
