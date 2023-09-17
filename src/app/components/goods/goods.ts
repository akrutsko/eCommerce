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
import { addToCart, createCart } from '../../utils/api/api-cart';

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

  async setProductsAmount(): Promise<void> {
    const response = await getProductProjections(this.consumer.apiClient, 1, 0).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (response) {
      this.total = response.body.total;
    }
  }

  async createView(): Promise<void> {
    await this.setProductsAmount();
    const title = new ElementCreator({
      tag: 'h2',
      classes: 'text-center',
      text: "Don't know what to buy or give an athlete? Leave it to fate to decide",
    });
    this.content.appendNode(title);

    const button = new ElementButtonCreator({ classes: 'primary-button px-10 text-xl', text: 'push your luck' });
    button.setHandler('click', () => this.createCard());

    this.goodsView.appendNode(this.content, button);
  }

  generateRandom(): number {
    const max = this.total || 0;
    return Math.floor(Math.random() * (max + 1));
  }

  addProduct(product: ProductProjection): void {
    const productName = product.name[Store.Language];
    let productDescription = '';
    let price = '';
    let priceWithOutDiscount = '';
    if (product.description) {
      productDescription = product.description[Store.Language];
    }
    const card = new ElementCreator({
      tag: 'div',
      classes:
        'max-w-full sm:max-w-xs card bg-white w-full h-auto mx-auto rounded-lg transition-all shadow-md hover:scale-[1.02] hover:shadow-xl',
    });

    const productImageBlock = new ElementCreator({
      tag: 'div',
      classes: 'relative w-full h-auto border-2 rounded-lg border-solid border-[#fbedec] p-4 bg-bg-color',
    });
    let url = '';
    let { masterVariant } = product;
    const { variants } = product;
    if (!masterVariant.isMatchingVariant) {
      if (variants.length) {
        const newMatchingVariant = variants.find((variant) => variant.isMatchingVariant);
        if (newMatchingVariant) {
          masterVariant = newMatchingVariant;
        }
      }
    }
    const { images } = masterVariant;
    if (images) {
      url = images[0].url;
    }
    const { prices } = masterVariant;
    if (prices?.length) {
      priceWithOutDiscount = getPrice(prices[0].value);
      if (prices[0].discounted && prices[0].discounted.value) {
        price = getPrice(prices[0].discounted.value);
      } else {
        price = priceWithOutDiscount;
      }
    }
    const aCard = new ElementAnchorCreator({ href: `/product/${product.slug[Store.Language]}`, classes: 'absolute inset-0' });
    const image = new ElementImageCreator({ alt: productName, src: url, classes: 'w-full h-full object-cover' });
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

    const productPriceBlock = new ElementCreator({
      tag: 'div',
      text: `${price}`,
      classes: 'font-sans text-xl font-semibold leading-6 tracking-wider text-[#DB5743] self-end',
    });
    const productPriceWithOutDiscountBlock = new ElementCreator({
      tag: 'div',
      text: `${priceWithOutDiscount}`,
      classes: 'subtitle line-through',
    });

    productPricesBlock.appendNode(productPriceBlock);
    if (price !== priceWithOutDiscount) {
      productPricesBlock.appendNode(productPriceWithOutDiscountBlock);
    }

    const addButton = new ElementButtonCreator({ classes: 'add-to-cart ml-auto scale-125', html: addToCartSVG }).getElement();
    productPricesBlock.appendNode(addButton);

    let lineItemId = this.consumer.cart?.lineItems.find((li) => li.productId === product.id)?.id;
    if (lineItemId) {
      addButton.disabled = true;
    }

    addButton.addEventListener('click', async () => {
      if (!this.consumer.cart) {
        try {
          this.consumer.cart = (await createCart(this.consumer.apiClient, { currency: 'USD' })).body;
        } catch (err) {
          if (err instanceof Error) {
            if (err.message) {
              new Message(err.message, 'error').showMessage();
            } else {
              new Message('Something went wrong. Try later.', 'error').showMessage();
            }
          }
        }
      }

      if (!this.consumer.cart) return;

      try {
        this.consumer.cart = (
          await addToCart(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id, product.id)
        ).body;
        lineItemId = this.consumer.cart.lineItems.find((li) => li.productId === product.id)?.id;
        addButton.disabled = true;
        new Message('Product has been added to cart.', 'info').showMessage();
      } catch (err) {
        if (err instanceof Error) {
          if (err.message) {
            new Message(err.message, 'error').showMessage();
          } else {
            new Message('Something went wrong. Try later.', 'error').showMessage();
          }
        }
      }
    });

    nameDescriptionBlock.appendNode(productNameBlock, productDescriptionBlock);
    infoBlock.appendNode(nameDescriptionBlock, productPricesBlock);
    card.appendNode(productImageBlock, infoBlock);

    this.content.getElement().innerHTML = '';
    this.content.appendNode(card);
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
