import { ProductProjection } from '@commercetools/platform-sdk';

import addToCartSVG from '../../../assets/svg/cart-add.svg';

import { getProductProjections } from '../../utils/api/api-product';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { Message } from '../../utils/message/toastify-message';
import { Consumer } from '../consumer/consumer';
import { Store } from '../../enums/store';
import { getPrice } from '../../utils/price/price';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { addToMyCart, createMyCart } from '../../utils/api/api-cart';
import { Loader } from '../loader/loader';

export class Goods {
  goodsView: ElementCreator<HTMLElement>;

  content: ElementCreator<HTMLElement>;

  consumer: Consumer;

  total: number | undefined;

  constructor(consumer: Consumer) {
    this.consumer = consumer;
    this.goodsView = new ElementCreator({ tag: 'div', classes: 'grid place-items-center gap-8' });
    this.content = new ElementCreator({ tag: 'div' });
    this.createView();
  }

  async createView(): Promise<void> {
    await this.setProductsAmount();
    const title = new ElementCreator({
      tag: 'h2',
      classes: 'text-center',
      text: "Don't know what to buy or give an athlete? Leave it to fate to decide.",
    });
    this.content.appendNode(title);

    const button = new ElementButtonCreator({ classes: 'primary-button px-10 text-xl', text: 'push your luck' });
    button.setHandler('click', async () => {
      button.getElement().disabled = true;
      await this.createCard();
      button.getElement().disabled = false;
    });

    this.goodsView.appendNode(this.content, button);
  }

  async setProductsAmount(): Promise<void> {
    const response = await getProductProjections(this.consumer.apiClient, 1, 0).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (response) {
      this.total = response.body.total;
    }
  }

  generateRandom(): number {
    const max = this.total || 0;
    return Math.floor(Math.random() * max);
  }

  addProduct(product: ProductProjection): void {
    const productName = product.name[Store.Language];
    const productDescription = product.description?.[Store.Language] || '';
    const mainImgUrl = product.masterVariant.images?.[0].url || '';
    const embeddedPrice = product.masterVariant.prices?.[0];

    const card = new ElementCreator({
      tag: 'div',
      classes:
        'max-w-full sm:max-w-xs card bg-white w-full h-auto mx-auto rounded-lg transition-all shadow-md hover:scale-[1.02] hover:shadow-xl',
    });

    const productImageBlock = new ElementCreator({
      tag: 'div',
      classes: 'relative w-full h-auto border-2 rounded-lg border-solid border-[#fbedec] p-4 bg-bg-color',
    });

    const aCard = new ElementAnchorCreator({ href: `/product/${product.slug[Store.Language]}`, classes: 'absolute inset-0' });
    const image = new ElementImageCreator({ alt: productName, src: mainImgUrl, classes: 'w-full h-full object-cover' });
    productImageBlock.appendNode(image, aCard);

    const infoBlock = new ElementCreator({ tag: 'div', classes: 'p-3 h-full flex flex-col justify-between gap-1' });
    const nameDescriptionBlock = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-1' });

    const productNameBlock = new ElementCreator({ tag: 'h4', text: `${productName}`, classes: 'product-name font-medium' });

    const productDescriptionBlock = new ElementCreator({
      tag: 'div',
      text: productDescription,
      classes:
        'font-open-sans text-xs font-normal leading-4 tracking-normal h-8 overflow-hidden whitespace-normal overflow-ellipsis',
    });

    const productPricesBlock = new ElementCreator({ tag: 'div', classes: 'flex gap-2 items-center' });

    let priceWithOutDiscount = '';
    let price = '';
    if (embeddedPrice) {
      priceWithOutDiscount = getPrice(embeddedPrice.value);
      if (embeddedPrice.discounted?.value) {
        price = getPrice(embeddedPrice.discounted.value);
      } else {
        price = priceWithOutDiscount;
      }
    }

    const productPriceBlock = new ElementCreator({
      tag: 'div',
      text: price,
      classes: 'font-sans text-xl font-semibold leading-6 tracking-wider text-[#DB5743] self-end',
    });
    const productPriceWithOutDiscountBlock = new ElementCreator({
      tag: 'div',
      text: priceWithOutDiscount,
      classes: 'subtitle line-through',
    });

    productPricesBlock.appendNode(productPriceBlock);
    if (price !== priceWithOutDiscount) {
      productPricesBlock.appendNode(productPriceWithOutDiscountBlock);
    }

    const addButton = new ElementButtonCreator({ classes: 'add-to-cart ml-auto scale-125', html: addToCartSVG });
    productPricesBlock.appendNode(addButton);

    let lineItemId = this.consumer.cart?.lineItems.find((li) => li.productId === product.id)?.id;
    if (lineItemId) {
      addButton.getElement().disabled = true;
    }

    addButton.setHandler('click', async () => {
      const loader = new Loader(card.getElement());
      loader.showLoader();
      addButton.addClass('pointer-events-none');

      if (!this.consumer.cart) {
        try {
          this.consumer.cart = (await createMyCart(this.consumer.apiClient, { currency: 'USD' })).body;
        } catch {
          new Message('Something went wrong. Try later.', 'error').showMessage();
          loader.hideLoader();
          addButton.removeClass('pointer-events-none');
        }
      }

      if (!this.consumer.cart) return;

      try {
        this.consumer.cart = (
          await addToMyCart(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id, product.id)
        ).body;
        addButton.getElement().disabled = true;
        lineItemId = this.consumer.cart.lineItems.find((li) => li.productId === product.id)?.id;
        new Message('Product has been added to cart.', 'info').showMessage();
      } catch {
        new Message('Something went wrong. Try later.', 'error').showMessage();
      }
      loader.hideLoader();
      addButton.removeClass('pointer-events-none');
    });

    nameDescriptionBlock.appendNode(productNameBlock, productDescriptionBlock);
    infoBlock.appendNode(nameDescriptionBlock, productPricesBlock);
    card.appendNode(productImageBlock, infoBlock);

    image.setHandler('load', () => {
      this.content.getElement().innerHTML = '';
      this.content.appendNode(card);
    });
    image.setHandler('error', () => {
      this.content.getElement().innerHTML = '';
      this.content.appendNode(card);
    });
  }

  async createCard(): Promise<void> {
    const randomNum = this.generateRandom();
    const productResponse = await getProductProjections(this.consumer.apiClient, 1, randomNum).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (productResponse) {
      this.addProduct(productResponse.body.results[0]);
    }
  }

  getView(): ElementCreator<HTMLElement> {
    return this.goodsView;
  }

  getElement(): HTMLElement {
    return this.goodsView.getElement();
  }
}
