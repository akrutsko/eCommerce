import { Category, ProductProjection, TypedMoney } from '@commercetools/platform-sdk';
import arrowDown from '../../../assets/svg/arrow-down.svg';
import './catalog.css';
import searchIcon from '../../../assets/svg/search.svg';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { getProductProjections } from '../../utils/api/api-product-projections';
import { getCtpClient } from '../../utils/api/api-client';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { Message } from '../../utils/message/toastify-message';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { HandlerLinks } from '../../router/handler-links';
import { Router } from '../../router/router';
import { Store } from '../../enums/store';
import { getCategories } from '../../utils/api/api-categories';
import { ElementLabelCreator } from '../../utils/element-creator/element-label-creator';

interface FilterInterface {
  id: string;
  name: string;
}
export class Catalog extends HandlerLinks {
  catalogView: ElementCreator<HTMLElement>;

  products: ProductProjection[] = [];

  categories: Category[] = [];

  cardsElementCreator: ElementCreator<HTMLElement>;

  constructor(router: Router) {
    super(router);
    this.cardsElementCreator = new ElementCreator({
      tag: 'div',
      classes: 'w-full md:w-2/4 lg:w-6/8 flex flex-wrap gap-3 justify-around grow',
    });
    this.catalogView = new ElementCreator({ tag: 'div', classes: 'w-full grow flex flex-col items-top' });
    this.createView();
  }

  async createView(): Promise<void> {
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
    const selectedFilfers = new ElementCreator({ tag: 'div', classes: '', text: 'checked filters, sorting' });

    await this.createCards();

    const countOfResults = new ElementCreator({ tag: 'div', classes: '', text: `${this.products.length} results` });
    secondBlock.appendNode(selectedFilfers, countOfResults);

    const thirdBlock = new ElementCreator({ tag: 'div', classes: 'w-full justify-between flex gap-3 flex-wrap' });
    const filters = new ElementCreator({
      tag: 'div',
      classes:
        'w-full md:w-1/4 lg:w-1/8 flex flex-col flex-wrap border border-1 border-blue-500 filters flex-grow-0 flex-shrink-0 gap-2',
    });
    this.createFilters(filters);

    thirdBlock.appendNode(filters, this.cardsElementCreator);

    this.catalogView.appendNode(firstBlock, secondBlock, thirdBlock);
  }

  createCheckBoxFilter(
    filterName: string,
    filterArray: FilterInterface[],
    filtersElementCreator: ElementCreator<HTMLElement>,
  ): void {
    const elementAccordion = new ElementCreator({
      tag: 'div',
    });
    const elementFilterName = new ElementCreator({
      tag: 'h5',
      text: filterName,
      classes:
        'flex items-center gap-2 text-h5 font-ubuntu text-base font-medium leading-6 tracking-normal text-[var(--main-color)] cursor-pointer',
    });
    const elementFilterArrow = new ElementCreator({ tag: 'div', classes: 'relative', html: arrowDown });
    elementFilterName.appendNode(elementFilterArrow);
    const elementFilterPanel = new ElementCreator({ tag: 'div', classes: 'filter' });
    elementAccordion.appendNode(elementFilterName, elementFilterPanel);
    filterArray.forEach((filterElement) => {
      const elementFilterWrapper = new ElementCreator({ tag: 'div', classes: 'flex gap-2 text-sm text-[#393E4D]' });
      const elementFilterInput = new ElementInputCreator({ type: 'checkbox', classes: 'block', value: filterElement.id });
      const elementFilterLabel = new ElementLabelCreator({ for: filterElement.id, text: filterElement.name });
      elementFilterWrapper.appendNode(elementFilterInput, elementFilterLabel);
      elementFilterPanel.appendNode(elementFilterWrapper);
    });
    filtersElementCreator.appendNode(elementAccordion);

    elementFilterName.getElement().addEventListener('click', () => {
      elementFilterPanel.toggleClass('active');
      elementFilterArrow.toggleClass('arrow-active');
    });
  }

  async createFilters(filtersElementCreator: ElementCreator<HTMLElement>): Promise<void> {
    const categoriesResponse = await getCategories(getCtpClient());
    if (categoriesResponse.statusCode === 200) {
      this.categories = categoriesResponse.body.results;
      const filterArray: FilterInterface[] = [];
      this.categories.forEach((category) => {
        filterArray.push({ id: category.id, name: category.name[Store.Language] });
      });

      this.createCheckBoxFilter('Category', filterArray, filtersElementCreator);
    }

    const elementFilterButton = new ElementButtonCreator({ text: 'filter', classes: 'primary-button' });
    filtersElementCreator.appendNode(elementFilterButton);

    elementFilterButton.getElement().addEventListener('click', () => {
      // window.history.pushState({}, '', '/login');
      // this.router.handleLocation();
      // checked filters
    });
  }

  async createCards(): Promise<void> {
    try {
      const productsResponse = await getProductProjections(getCtpClient());
      if (productsResponse.statusCode === 200) {
        this.products = productsResponse.body.results;
        console.log(this.products);
        this.products.forEach((product) => {
          this.addProduct(product);
        });
      } else {
        new Message('Something went wrong. Try later.', 'error').showMessage();
      }
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

  formatPrice(price: TypedMoney): string {
    return `$${(price.centAmount / (100 * price.fractionDigits)).toFixed(2)}`;
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
      classes: 'relative card w-60 h-88 hover:scale-105 hover:cursor-pointer hover:border',
    });
    this.cardsElementCreator.appendNode(card);

    const productImageBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-60 h-60 border-2 rounded-lg border-solid border-[#fbedec] p-4 bg-gray-200',
    });
    let url = '';
    const { masterVariant } = product;
    if (masterVariant) {
      const { images } = masterVariant;
      if (images) {
        url = images[0].url;
      }
      const { prices } = masterVariant;
      if (prices?.length) {
        priceWithOutDiscount = this.formatPrice(prices[0].value);
        if (prices[0].discounted && prices[0].discounted.value) {
          price = this.formatPrice(prices[0].discounted.value);
        } else {
          price = priceWithOutDiscount;
        }
      }
    }
    const image = new ElementImageCreator({ alt: productName, src: url, classes: 'w-full h-full object-cover' });
    productImageBlock.appendNode(image);

    const productNameBlock = new ElementCreator({ tag: 'h4', text: `${productName}`, classes: 'text-[#393E4D]' });

    const productDescriptionBlock = new ElementCreator({
      tag: 'div',
      text: productDescription,
      classes:
        'font-open-sans text-xs font-normal leading-4 tracking-normal h-8 overflow-hidden whitespace-normal overflow-ellipsis',
    });

    const productPricesBlock = new ElementCreator({ tag: 'div', classes: 'flex gap-2' });

    const productPriceBlock = new ElementCreator({
      tag: 'div',
      text: `${price}`,
      classes: 'font-sans text-xl font-semibold leading-6 tracking-wider text-[#DB5743]',
    });
    const productPriceWithOutDiscountBlock = new ElementCreator({
      tag: 'div',
      text: `${priceWithOutDiscount}`,
      classes: 'line-through font-sans text-xl font-semibold leading-6 tracking-wider text-[#f9b8b3]',
    });

    productPricesBlock.appendNode(productPriceBlock);
    if (price !== priceWithOutDiscount) {
      productPricesBlock.appendNode(productPriceWithOutDiscountBlock);
    }

    const aCard = new ElementAnchorCreator({ href: `/product#${product.id}`, classes: 'absolute inset-0' });
    this.listOfLinks.push(aCard.getElement());
    card.appendNode(productImageBlock, productNameBlock, productDescriptionBlock, productPricesBlock, aCard);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.catalogView;
  }

  getElement(): HTMLElement {
    return this.catalogView.getElement();
  }
}
