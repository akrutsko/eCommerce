import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './product.css';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { Router } from '../../router/router';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { Consumer } from '../consumer/consumer';
import { getProductProjection } from '../../utils/api/api-product';
import { Message } from '../../utils/message/toastify-message';
import { Store } from '../../enums/store';
import { getPrice } from '../../utils/price/price';
import { ProductModal } from '../modal/product-modal';
import { getCategoryById, getTreeOfCategories } from '../../utils/api/api-categories';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { addToMyCart, createMyCart, removeFromMyCart } from '../../utils/api/api-cart';

export class Product {
  router: Router;

  consumer: Consumer;

  productId: string;

  lineItemId: string | undefined;

  productView: ElementCreator<HTMLElement>;

  productImage: HTMLImageElement | undefined;

  productData: ProductProjection | undefined;

  constructor(router: Router, consumer: Consumer, id: string) {
    this.router = router;
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

    const name = this.productData.name[Store.Language];
    const description = this.productData.description?.[Store.Language] || '';
    const mainImgUrl = this.productData.masterVariant.images?.[0].url || '';
    const embeddedPrice = this.productData.masterVariant.prices?.[0];
    const firmPrice = embeddedPrice?.value;
    const discountedPrice = embeddedPrice?.discounted?.value;
    const { attributes } = this.productData.masterVariant;

    const breadcrumbWrapper = await this.createBreadcrumbs(this.productData.categories[0].id);

    const imageWrapper = new ElementCreator({
      tag: 'div',
      classes: 'max-w-sm min-w-0 w-72 aspect-square bg-white rounded-xl overflow-hidden cursor-zoom-in md:min-w-[16rem] ',
    });
    this.productImage = new ElementImageCreator({ src: mainImgUrl, alt: name, classes: 'h-full object-cover' }).getElement();
    this.productImage.addEventListener('click', () => {
      if (!this.productData) return;

      const modal = new ProductModal(this.productData);
      document.body.append(modal.getElement());
      modal.showModal();

      const index = this.productData.masterVariant.images?.findIndex((image) => image.url === this.productImage?.src) || 0;
      modal.initSwiper(index);
    });
    imageWrapper.appendNode(this.productImage);

    const productWrapper = new ElementCreator({ tag: 'div', classes: 'self-start grow' });
    const productName = new ElementCreator({ tag: 'h3', text: name });
    const productDescription = new ElementCreator({ tag: 'p', text: description, classes: 'mb-5 text-sm' });
    productWrapper.appendNode(productName, productDescription);

    if (attributes) {
      attributes.forEach((attribute) => {
        const label = new ElementCreator({
          tag: 'span',
          text: attribute.value[0].label,
          classes: 'mb-1 mr-1 inline-block filter-button ',
        });
        productWrapper.appendNode(label);
      });
    }

    const swiper = new ElementCreator({ tag: 'div', classes: 'shrink-0 flex md:flex-col md:order-first select-none relative' });
    const wrapper = new ElementCreator({ tag: 'div', classes: 'flex flex-col items-center gap-2.5 md:flex-row md:gap-14' });
    wrapper.appendNode(imageWrapper, swiper, productWrapper);

    this.productView.appendNode(breadcrumbWrapper, wrapper);

    this.initSwiper(swiper.getElement());

    const priceWrapper = new ElementCreator({ tag: 'div', classes: 'mt-5 mb-5' });
    productWrapper.appendNode(priceWrapper);

    if (firmPrice) {
      priceWrapper.appendNode(
        new ElementCreator({
          tag: 'div',
          classes: discountedPrice ? 'subtitle line-through' : 'price',
          text: getPrice(firmPrice),
        }),
      );
    }
    if (discountedPrice) {
      priceWrapper.appendNode(new ElementCreator({ tag: 'div', classes: 'price', text: getPrice(discountedPrice) }));
    }

    const addButton = new ElementButtonCreator({ classes: 'primary-button py-1', text: 'add to cart' });
    const removeButton = new ElementButtonCreator({ classes: 'secondary-button py-1 hidden', text: 'remove from cart' });
    productWrapper.appendNode(addButton, removeButton);

    this.lineItemId = this.consumer.cart?.lineItems.find((li) => li.productId === this.productId)?.id;
    if (this.lineItemId) {
      addButton.addClass('hidden');
      removeButton.removeClass('hidden');
    }

    addButton.setHandler('click', async () => {
      addButton.addClass('pointer-events-none');

      if (!this.consumer.cart) {
        try {
          this.consumer.cart = (await createMyCart(this.consumer.apiClient, { currency: 'USD' })).body;
        } catch {
          new Message('Something went wrong. Try later.', 'error').showMessage();
          addButton.removeClass('pointer-events-none');
        }
      }

      if (!this.consumer.cart) return;

      try {
        this.consumer.cart = (
          await addToMyCart(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id, this.productId)
        ).body;
        this.lineItemId = this.consumer.cart.lineItems.find((li) => li.productId === this.productId)?.id;
        addButton.addClass('hidden');
        removeButton.removeClass('hidden');
        new Message('Product has been added to cart.', 'info').showMessage();
      } catch {
        new Message('Something went wrong. Try later.', 'error').showMessage();
      }
      addButton.removeClass('pointer-events-none');
    });

    removeButton.setHandler('click', async () => {
      if (!this.consumer.cart || !this.lineItemId) return;

      removeButton.addClass('pointer-events-none');

      try {
        this.consumer.cart = (
          await removeFromMyCart(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id, this.lineItemId)
        ).body;
        this.lineItemId = this.consumer.cart.lineItems.find((li) => li.productId === this.productId)?.id;
        addButton.removeClass('hidden');
        removeButton.addClass('hidden');
        new Message('Product has been removed from cart.', 'info').showMessage();
      } catch {
        new Message('Something went wrong. Try later.', 'error').showMessage();
      }
      removeButton.removeClass('pointer-events-none');
    });
  }

  initSwiper(wrapper: HTMLElement): void {
    if (!this.productData || !this.productData.masterVariant.images) return;

    const images = this.productData.masterVariant.images.map((image) => image.url);

    const swiperContainer = new ElementCreator({ tag: 'div', classes: 'swiper w-[212px] md:w-16 h-16 md:h-[212px]' });
    const swiperWrapper = new ElementCreator({ tag: 'div', classes: 'swiper-wrapper' });
    images.forEach((image) => {
      const imgWrapper = new ElementCreator({
        tag: 'div',
        classes: 'swiper-slide bg-white rounded-md cursor-pointer overflow-hidden',
      });
      const sliderImage = new ElementImageCreator({ src: image, alt: '', classes: 'h-full object-cover' });
      sliderImage.setHandler('click', () => {
        if (this.productImage) {
          this.productImage.src = sliderImage.getElement().src;
        }
      });
      imgWrapper.appendNode(sliderImage);
      swiperWrapper.appendNode(imgWrapper);
    });
    swiperContainer.appendNode(swiperWrapper);

    const swiperPrevButton = new ElementCreator({ tag: 'div', classes: 'swiper-button-prev swiper-button-prev-product' });
    const swiperNextButton = new ElementCreator({ tag: 'div', classes: 'swiper-button-next swiper-button-next-product' });
    wrapper.append(swiperContainer.getElement(), swiperPrevButton.getElement(), swiperNextButton.getElement());

    const swiperPagination = new ElementCreator({ tag: 'div', classes: 'swiper-pagination hidden md:block' });
    wrapper.append(swiperPagination.getElement());

    const swiper = new Swiper('.swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 3,
      centerInsufficientSlides: true,
      spaceBetween: 10,
      direction: window.innerWidth < 768 ? 'horizontal' : 'vertical',
      loop: images.length >= 6,
      navigation: { prevEl: '.swiper-button-prev-product', nextEl: '.swiper-button-next-product' },
      pagination: { el: '.swiper-pagination', clickable: true },
    });

    swiper.on('resize', () => {
      swiper.changeDirection(window.innerWidth < 768 ? 'horizontal' : 'vertical');
    });
  }

  async createBreadcrumbs(categoryId: string): Promise<HTMLElement> {
    const breadcrumbWrapper = new ElementCreator({ tag: 'div', classes: 'mb-4' });

    const catalog = new ElementAnchorCreator({ href: '/catalog', text: 'Catalog', classes: 'breadcrumbs' });
    breadcrumbWrapper.appendNode(catalog);

    const categoriesTree = await getTreeOfCategories(this.consumer.apiClient).catch(() => {});
    if (!categoriesTree) return breadcrumbWrapper.getElement();

    const category = getCategoryById(categoryId, categoriesTree);
    const parentCategory = category?.parent;

    if (parentCategory) {
      breadcrumbWrapper.appendNode(
        new ElementCreator({ tag: 'span', text: ' » ', classes: 'text-primary-color opacity-60' }),
        new ElementAnchorCreator({
          href: `/categories/${parentCategory.slug}`,
          text: parentCategory.name,
          classes: 'breadcrumbs',
        }),
      );
    }
    if (category) {
      breadcrumbWrapper.appendNode(
        new ElementCreator({ tag: 'span', text: ' » ', classes: 'text-primary-color opacity-60' }),
        new ElementAnchorCreator({ href: `/categories/${category.slug}`, text: category.name, classes: 'breadcrumbs' }),
      );
    }

    return breadcrumbWrapper.getElement();
  }

  getView(): ElementCreator<HTMLElement> {
    return this.productView;
  }

  getElement(): HTMLElement {
    return this.productView.getElement();
  }
}
