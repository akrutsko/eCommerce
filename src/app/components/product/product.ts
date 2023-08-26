import 'swiper/css';
import './product.css';

import Swiper from 'swiper';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { HandlerLinks } from '../../router/handler-links';
import { Router } from '../../router/router';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { Consumer } from '../consumer/consumer';
import { getProductProjection } from '../../utils/api/api-product';
import { Message } from '../../utils/message/toastify-message';

export class Product extends HandlerLinks {
  consumer: Consumer;

  productId: string;

  productData: ProductProjection | undefined;

  productView: ElementCreator<HTMLElement>;

  swiper: Swiper | undefined;

  constructor(router: Router, consumer: Consumer, id: string) {
    super(router);
    this.consumer = consumer;
    this.productId = id;

    this.productView = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] rounded-xl w-full flex-1 p-5 md:p-10' });
    this.createView();
  }

  async createView(): Promise<void> {
    const productResponse = await getProductProjection(this.consumer.apiClient, this.productId).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!productResponse) return;

    this.productData = productResponse.body;

    const name = this.productData.name['en-US'];
    const description = this.productData.description?.['en-US'] || '';
    const images = this.productData.masterVariant.images?.map((image) => image.url);
    const mainImgUrl = images?.[0] || '';

    console.log(this.productData);

    const breadcrumbWrapper = new ElementCreator({ tag: 'div', classes: 'mb-2.5' }); // TODO: generate breadcrumb

    const imageWrapper = new ElementCreator({
      tag: 'div',
      classes: 'max-w-sm w-72 aspect-square bg-white rounded-xl',
    });
    const productImage = new ElementImageCreator({ src: mainImgUrl, alt: name, classes: 'h-full object-cover' });
    imageWrapper.appendNode(productImage);

    const swiperEl = new ElementCreator({
      tag: 'div',
      classes: 'swiper w-[212px] md:w-16 h-16 md:h-[212px] shrink-0 flex md:flex-col md:order-first select-none',
    });
    const swiperWrapper = new ElementCreator({ tag: 'div', classes: 'swiper-wrapper' });
    images?.forEach((image) => {
      const imgWrapper = new ElementCreator({
        tag: 'div',
        classes: 'swiper-slide aspect-square bg-white rounded-md object-cover',
      });
      const sliderImage = new ElementImageCreator({ src: image, alt: '', classes: 'h-full object-cover' });
      imgWrapper.appendNode(sliderImage);
      swiperWrapper.appendNode(imgWrapper);
    });
    swiperEl.appendNode(swiperWrapper);
    const swiperPrevButton = new ElementCreator({ tag: 'div', classes: 'swiper-button-prev' });
    const swiperNextButton = new ElementCreator({ tag: 'div', classes: 'swiper-button-next' });
    swiperEl.appendNode(swiperPrevButton, swiperNextButton);

    this.swiper = new Swiper(swiperEl.getElement(), {
      enabled: Boolean(images?.length && images?.length > 1),
      slidesPerView: 3,
      centerInsufficientSlides: true,
      spaceBetween: 10,
      direction: window.innerWidth < 768 ? 'horizontal' : 'vertical',
      loop: true,
      grabCursor: true,
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      },
    });

    this.swiper.on('click', (swiper) => {
      if (images) {
        productImage.getElement().src = images[swiper.clickedIndex];
      }
    });
    this.swiper.on('resize', (swiper) => {
      swiper.changeDirection(window.innerWidth < 768 ? 'horizontal' : 'vertical');
    });

    swiperPrevButton.setHandler('click', () => this.swiper?.slidePrev());
    swiperNextButton.setHandler('click', () => this.swiper?.slideNext());

    const productWrapper = new ElementCreator({ tag: 'div', classes: 'self-start grow' });
    const productName = new ElementCreator({ tag: 'h3', text: name });
    const productDescription = new ElementCreator({ tag: 'p', text: description });
    productWrapper.appendNode(productName, productDescription);

    const wrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col items-center gap-2.5 md:flex-row md:gap-14' });
    wrapper.appendNode(imageWrapper, swiperEl, productWrapper);

    this.productView.appendNode(breadcrumbWrapper, wrapper);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.productView;
  }

  getElement(): HTMLElement {
    return this.productView.getElement();
  }
}
