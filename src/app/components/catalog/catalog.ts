import { ProductProjection } from '@commercetools/platform-sdk';
import searchIcon from '../../../assets/svg/search.svg';
import './catalog.css';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { getProductProjections } from '../../utils/api/api-product-projections';
import { getCtpClient } from '../../utils/api/api-client';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';

export class Catalog {
  catalogView: ElementCreator<HTMLElement>;

  cardsList: ElementCreator<HTMLElement>[];

  cardsElementCreator: ElementCreator<HTMLElement>;

  constructor() {
    this.cardsElementCreator = new ElementCreator({
      tag: 'div',
      classes: 'w-full md:w-2/4 lg:w-6/8 flex flex-wrap gap-3 justify-around grow',
    });
    this.cardsList = [];
    this.catalogView = new ElementCreator({ tag: 'div', classes: 'w-full grow flex flex-col items-top' });
    this.createView();
  }

  createView(): void {
    const firstBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-full items-top justify-between flex gap-6 flex-wrap flex-col md:flex-row',
    });
    const catalogNameBlock = new ElementCreator({ tag: 'div', classes: 'order-2 md:order-1' });
    const breadcrumbsBlock = new ElementCreator({ tag: 'div', text: '1>2', classes: 'breadcrumbs' });
    const catalogName = new ElementCreator({ tag: 'h2', text: 'Catalog', classes: 'h2' });
    catalogNameBlock.appendNode(catalogName, breadcrumbsBlock);

    const form = new ElementCreator({ tag: 'form', classes: 'search-form order-1 md:order-2' });
    const search = new ElementInputCreator({ type: 'search', name: 'search', placeholder: 'search' });
    search.getElement().addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }); // TODO: implement search
    const submitButton = new ElementButtonCreator({ classes: 'absolute right-0 top-0 focus:outline-none', html: searchIcon });
    form.appendNode(search, submitButton);
    firstBlock.appendNode(catalogNameBlock, form);

    const secondBlock = new ElementCreator({ tag: 'div', classes: 'w-full items-top justify-between flex gap-1' });
    const seletedFilfers = new ElementCreator({ tag: 'div', classes: '', text: 'filters' });
    const countOfResults = new ElementCreator({ tag: 'div', classes: '', text: '12 results' });
    secondBlock.appendNode(seletedFilfers, countOfResults);

    const thirdBlock = new ElementCreator({ tag: 'div', classes: 'w-full justify-between flex gap-3 flex-wrap' });
    const filters = new ElementCreator({
      tag: 'div',
      classes: 'w-full md:w-1/4 lg:w-1/8 flex flex-col flex-wrap border border-1 border-blue-500 filters',
      text: 'filters',
    });

    thirdBlock.appendNode(filters, this.cardsElementCreator);

    this.createCards();

    this.catalogView.appendNode(firstBlock, secondBlock, thirdBlock);
  }

  async createCards(): Promise<void> {
    const productsResponse = await getProductProjections(getCtpClient());
    if (productsResponse.statusCode === 200) {
      const { results } = productsResponse.body;
      results.forEach((product) => {
        this.addProduct(product);
      });
    }
  }

  addProduct(product: ProductProjection): void {
    const localizedString = 'en-US';
    const productName = product.name[localizedString];
    let productDescription = '';
    let price = '';
    let priceWithOutDiscount = '';
    console.log(product);
    if (product.description) {
      productDescription = product.description[localizedString];
    }
    const card = new ElementCreator({
      tag: 'div',
      classes: 'card w-60 h-88 hover:scale-105 hover:cursor-pointer hover:border',
    });
    this.cardsElementCreator.appendNode(card);
    this.cardsList.push(card);

    const productImageBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-60 h-60 border-2 rounded-lg border-solid border-[#fbedec] p-4 bg-gray-200',
    });
    let url = '';
    const { variants } = product;
    if (variants) {
      const { images } = variants[0];
      if (images) {
        url = images[0].url;
      }
      const { prices } = variants[0];
      if (prices?.length) {
        priceWithOutDiscount = `${prices[0].value.centAmount / prices[0].value.fractionDigits}${prices[0].value.currencyCode}`;
        if (prices[0].discounted && prices[0].discounted.value) {
          price = `${prices[0].discounted.value.centAmount / prices[0].discounted.value.fractionDigits}${
            prices[0].discounted.value.currencyCode
          }`;
        } else {
          price = priceWithOutDiscount;
        }
      }
    }
    const image = new ElementImageCreator({ alt: productName, src: url, classes: 'w-full h-full object-cover' });
    productImageBlock.appendNode(image);

    const productNameBlock = new ElementCreator({ tag: 'h4', text: `${productName}` });

    const productDescriptionBlock = new ElementCreator({
      tag: 'div',
      text: productDescription,
      classes:
        'font-open-sans text-xs font-normal leading-4 tracking-normal h-8 overflow-hidden whitespace-normal overflow-ellipsis',
    });

    const productPricesBlock = new ElementCreator({ tag: 'div', classes: 'flex' });

    const productPriceBlock = new ElementCreator({ tag: 'div', text: `${price}` });
    const productPriceWithOutDiscountBlock = new ElementCreator({
      tag: 'div',
      text: `${priceWithOutDiscount}`,
      classes: 'line-through',
    });

    productPricesBlock.appendNode(productPriceBlock);
    if (price !== priceWithOutDiscount) {
      productPricesBlock.appendNode(productPriceWithOutDiscountBlock);
    }

    card.appendNode(productImageBlock, productNameBlock, productDescriptionBlock, productPricesBlock);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.catalogView;
  }

  getElement(): HTMLElement {
    return this.catalogView.getElement();
  }
}
