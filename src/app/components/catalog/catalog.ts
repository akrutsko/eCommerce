import { ProductProjection } from '@commercetools/platform-sdk';
import searchIcon from '../../../assets/svg/search.svg';
import './catalog.css';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { getProductProjections } from '../../utils/api/api-product-projections';
import { getCtpClient } from '../../utils/api/api-client';

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
    console.log(productsResponse);
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
    const card = new ElementCreator({
      tag: 'div',
      classes: 'card w-60 h-72 border border-1 border-blue-500',
      text: `${productName}`,
    });
    this.cardsElementCreator.appendNode(card);
    this.cardsList.push(card);

    const rectangle = document.createElement('div');
    rectangle.classList.add('w-60', 'h-60', 'rounded-10', 'border-2', 'p-4');

    const image = document.createElement('img');
    const { variants } = product;
    if (variants) {
      const { images } = variants[0];
      if (images) {
        const { url } = images[0];
        image.src = url;
      }
    }
    image.alt = productName;
    image.classList.add('w-full', 'h-full', 'object-cover');

    rectangle.appendChild(image);

    card.getElement().append(rectangle);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.catalogView;
  }

  getElement(): HTMLElement {
    return this.catalogView.getElement();
  }
}
