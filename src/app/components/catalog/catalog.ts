import { Category, ProductProjection, ProductType } from '@commercetools/platform-sdk';
import './catalog.css';
import arrowDownSVG from '../../../assets/svg/arrow-down.svg';
import deleteFilterSVG from '../../../assets/svg/delete-filter.svg';
import searchIcon from '../../../assets/svg/search.svg';

import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { Message } from '../../utils/message/toastify-message';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { HandlerLinks } from '../../router/handler-links';
import { Router } from '../../router/router';
import { Store } from '../../enums/store';
import { getCategories } from '../../utils/api/api-categories';
import { ElementLabelCreator } from '../../utils/element-creator/element-label-creator';
import { getPrice } from '../../utils/price/price';
import { getProductProjections, getProductTypes } from '../../utils/api/api-product';
import { Consumer } from '../consumer/consumer';

export class Catalog extends HandlerLinks {
  catalogView: ElementCreator<HTMLElement>;

  countOfResultsView: ElementCreator<HTMLElement>;

  cardsView: ElementCreator<HTMLElement>;

  checkBoxFilterViews: ElementCreator<HTMLInputElement>[] = [];

  minPriceFilterView: ElementCreator<HTMLInputElement>;

  maxPriceFilterView: ElementCreator<HTMLInputElement>;

  consumer: Consumer;

  categories: Category[] = [];

  products: ProductProjection[] = [];

  selectedCheckBoxFilters: SelectedFilters[] = [];

  constructor(router: Router, consumer: Consumer) {
    super(router);
    this.consumer = consumer;
    this.catalogView = new ElementCreator({ tag: 'div', classes: 'w-full grow flex flex-col items-top' });
    this.countOfResultsView = new ElementCreator({ tag: 'div', text: '0 results' });
    this.cardsView = new ElementCreator({
      tag: 'div',
      classes: 'w-full md:w-2/4 lg:w-6/8 flex flex-wrap gap-3 justify-around grow',
    });
    this.minPriceFilterView = new ElementInputCreator({
      type: 'number',
      classes: 'border-1 rounded-lg border-solid border-[#E8E6E8] min-w-0',
    });
    this.maxPriceFilterView = new ElementInputCreator({
      type: 'number',
      classes: 'border-1 rounded-lg border-solid border-[#E8E6E8] min-w-0',
    });
    this.createView();
  }

  async createView(): Promise<void> {
    const firstBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-full items-top justify-between flex gap-6 flex-wrap flex-col md:flex-row',
    });
    const catalogNameBlock = new ElementCreator({ tag: 'div', classes: 'order-2 md:order-1' });
    const breadcrumbsBlock = new ElementCreator({ tag: 'div', text: 'Catalog>', classes: 'breadcrumbs' });
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

    await this.createCards();

    const sortByNameElement = new ElementCreator({ tag: 'div', classes: 'filter-button', text: 'Sort by name' });
    secondBlock.appendNode(sortByNameElement, this.countOfResultsView);

    const thirdBlock = new ElementCreator({ tag: 'div', classes: 'w-full justify-between flex gap-3 flex-wrap' });
    const filtersPanel = new ElementCreator({
      tag: 'div',
      classes:
        'w-full md:w-1/4 lg:w-1/8 flex flex-col flex-wrap filters grow-0 shrink-0 gap-2 bg-bg-color border-1 rounded-lg border-solid border-[#fbedec] p-4',
    });
    const filtersPanelHeader = new ElementCreator({
      tag: 'h4',
      text: 'Set filters',
      classes: 'f-full ext-center font-ubuntu text-base font-medium leading-5 tracking-normal',
    });
    filtersPanel.appendNode(filtersPanelHeader);

    this.createFiltersView(filtersPanel);

    thirdBlock.appendNode(filtersPanel, this.cardsView);

    this.catalogView.appendNode(firstBlock, secondBlock, thirdBlock);
  }

  changeArraySelectedFilters(filterName: string, isChecked: boolean, value: string): void {
    const foundFilter = this.selectedCheckBoxFilters.find((filter) => filter.filterType === filterName);
    if (isChecked) {
      if (foundFilter && !foundFilter.values.includes(value)) {
        foundFilter.values.push(value);
      } else {
        this.selectedCheckBoxFilters.push({ filterType: filterName, values: [value] });
      }
    } else if (foundFilter) {
      const index = foundFilter.values.indexOf(value);
      if (index !== -1) {
        foundFilter.values.splice(index, 1);
      }
    }
  }

  createPriceFilter(min: number, max: number, filtersElementCreator: ElementCreator<HTMLElement>): void {
    const elementAccordion = new ElementCreator({
      tag: 'div',
      classes: 'w-full',
    });
    const elementFilterName = new ElementCreator({
      tag: 'h5',
      text: 'Price',
      classes:
        'flex items-center gap-2 text-h5 font-ubuntu text-base font-medium leading-6 tracking-normal text-primary-color cursor-pointer',
    });
    const elementFilterArrow = new ElementCreator({ tag: 'div', classes: 'relative', html: arrowDownSVG });
    elementFilterName.appendNode(elementFilterArrow);
    const elementFilterPanel = new ElementCreator({ tag: 'div', classes: 'filter' });
    elementAccordion.appendNode(elementFilterName, elementFilterPanel);
    filtersElementCreator.appendNode(elementAccordion);

    const minmaxElement = new ElementCreator({ tag: 'div', classes: 'flex gap-1' });
    elementFilterPanel.appendNode(minmaxElement);

    this.minPriceFilterView.getElement().step = '0.01';
    this.minPriceFilterView.getElement().min = `${min}`;
    this.minPriceFilterView.getElement().max = `${max}`;
    this.minPriceFilterView.getElement().placeholder = '$0.00';

    this.maxPriceFilterView.getElement().step = '0.01';
    this.maxPriceFilterView.getElement().min = `${min}`;
    this.maxPriceFilterView.getElement().max = `${max}`;
    this.maxPriceFilterView.getElement().placeholder = '$0.00';

    minmaxElement.appendNode(this.minPriceFilterView, this.maxPriceFilterView);

    elementFilterName.getElement().addEventListener('click', () => {
      elementFilterPanel.toggleClass('active');
      elementFilterArrow.toggleClass('arrow-active');
    });
  }

  createCheckBoxFilter(filterName: string, filterArray: Attribute[], filtersElementCreator: ElementCreator<HTMLElement>): void {
    const elementAccordion = new ElementCreator({
      tag: 'div',
      classes: 'w-full',
    });
    const elementFilterName = new ElementCreator({
      tag: 'h5',
      text: filterName,
      classes:
        'w-full flex items-center gap-2 text-h5 font-ubuntu text-base font-medium leading-6 tracking-normal text-primary-color cursor-pointer',
    });
    const elementFilterArrow = new ElementCreator({ tag: 'div', classes: 'relative', html: arrowDownSVG });
    elementFilterName.appendNode(elementFilterArrow);
    const elementFilterPanel = new ElementCreator({ tag: 'div', classes: 'w-full filter' });
    elementAccordion.appendNode(elementFilterName, elementFilterPanel);
    filterArray.forEach((filterElement) => {
      const elementFilterWrapper = new ElementCreator({ tag: 'div', classes: 'w-full flex gap-2 text-sm text-[#393E4D]' });
      const elementFilterInput = new ElementInputCreator({
        type: 'checkbox',
        classes: 'block',
        value: filterElement.key,
        id: `${filterName}-${filterElement.key}`,
      });
      elementFilterInput.getElement().setAttribute('filter-name', filterName);
      this.checkBoxFilterViews.push(elementFilterInput);
      const elementFilterLabel = new ElementLabelCreator({
        for: `${filterName}-${filterElement.key}`,
        text: filterElement.label,
      });
      elementFilterWrapper.appendNode(elementFilterInput, elementFilterLabel);
      elementFilterPanel.appendNode(elementFilterWrapper);
      elementFilterInput.getElement().addEventListener('change', () => {
        const isChecked = elementFilterInput.getElement().checked;
        const { value } = elementFilterInput.getElement();
        this.changeArraySelectedFilters(filterName, isChecked, value);
      });
    });
    filtersElementCreator.appendNode(elementAccordion);

    elementFilterName.getElement().addEventListener('click', () => {
      elementFilterPanel.toggleClass('active');
      elementFilterArrow.toggleClass('arrow-active');
    });
  }

  getUniqueAttributesByKey(productTypes: ProductType[], nameAttribute: string): Attribute[] {
    const uniqueAttributes: Attribute[] = [];
    productTypes.forEach((productType) => {
      if (productType.attributes) {
        const attribute = productType.attributes.find((attr) => attr.name === nameAttribute);

        if (attribute && attribute.type.name === 'set' && attribute.type.elementType.name === 'enum') {
          attribute.type.elementType.values.forEach((gettedAttribute: Attribute) => {
            if (!uniqueAttributes.some((existingBrand) => existingBrand.key === gettedAttribute.key)) {
              uniqueAttributes.push(gettedAttribute);
            }
          });
        }
      }
    });
    return uniqueAttributes;
  }

  getSortedPrices(products: ProductProjection[]): number[] {
    const allPrices: number[] = [];

    products.forEach((product) => {
      product.variants.push(product.masterVariant);
      product.variants.forEach((variant) => {
        if (variant.prices) {
          const prices = variant.prices.filter((price) => price.value.currencyCode === Store.Currency);

          prices.forEach((price) => {
            if (price.discounted) {
              allPrices.push(price.discounted.value.centAmount / 10 ** price.discounted.value.fractionDigits);
            } else {
              allPrices.push(price.value.centAmount / 10 ** price.value.fractionDigits);
            }
          });
        }
      });
    });

    allPrices.sort((a, b) => a - b);

    return allPrices;
  }

  async createFiltersView(filtersElementCreator: ElementCreator<HTMLElement>): Promise<void> {
    const productsResponse = await getProductProjections(this.consumer.apiClient).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!productsResponse) return;

    const categoriesResponse = await getCategories(this.consumer.apiClient, ['parent is not defined']).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!categoriesResponse) return;
    this.categories = categoriesResponse.body.results;
    const filterArray: Attribute[] = [];
    this.categories.forEach((category) => {
      filterArray.push({ key: category.id, label: category.name[Store.Language] });
    });
    this.createCheckBoxFilter('Category', filterArray, filtersElementCreator);

    const sortedPrices = this.getSortedPrices(productsResponse.body.results);
    if (sortedPrices.length) {
      this.createPriceFilter(sortedPrices[0], sortedPrices[sortedPrices.length - 1], filtersElementCreator);
    }

    const productTypesResponse = await getProductTypes(this.consumer.apiClient).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!productTypesResponse) return;

    const filters: Attribute[] = [
      { key: 'brand', label: 'Brand' },
      { key: 'color', label: 'Color' },
    ];

    filters.forEach((filter) => {
      const filterArrayBrand = this.getUniqueAttributesByKey(productTypesResponse.body.results, filter.key);
      this.createCheckBoxFilter(filter.label, filterArrayBrand, filtersElementCreator);
    });

    const btsWrapper = new ElementCreator({ tag: 'div', classes: 'flex gap-1 justify-between' });
    filtersElementCreator.appendNode(btsWrapper);

    const btbApplyFilters = new ElementButtonCreator({ text: 'apply', classes: 'w-full primary-button' });

    btbApplyFilters.getElement().addEventListener('click', () => {
      this.applyFilters();
    });

    const btbResetFilters = new ElementButtonCreator({ text: 'reset', classes: 'w-full secondary-button' });
    btsWrapper.appendNode(btbResetFilters, btbApplyFilters);

    btbResetFilters.getElement().addEventListener('click', () => {
      this.resetFilters();
    });
  }

  applyFilters(): void {
    const filterArray: string[] = [];

    const min = parseFloat(this.minPriceFilterView.getElement().value) * 10 ** Store.FractionDigits;
    const max = parseFloat(this.maxPriceFilterView.getElement().value) * 10 ** Store.FractionDigits;

    if (min || max) {
      let from = '*';
      let fromStr = '0';
      if (min) {
        from = min.toString();
        fromStr = (min / 10 ** Store.FractionDigits).toString();
      }
      let to = '*';
      let toStr = '';
      if (max) {
        to = max.toString();
        toStr = (max / 10 ** Store.FractionDigits).toString();
      }
      const filterStr = `variants.price.centAmount:range (${from} to ${to})`;
      filterArray.push(filterStr);
      const resetPriceElement = new ElementCreator({
        tag: 'button',
        text: `$${fromStr}-${toStr}`,
        classes: 'filter-button flex items-center',
      });
      const elementFilterDelete = new ElementCreator({ tag: 'div', classes: 'relative', html: deleteFilterSVG });
      resetPriceElement.appendNode(elementFilterDelete);
    }

    this.selectedCheckBoxFilters.forEach((filter) => {
      if (filter.values.length) {
        if (filter.filterType === 'Category') {
          const resultArray = filter.values.map((element) => `subtree("${element}")`);
          filterArray.push(`categories.id:${resultArray.join(',')}`);
        } else if (filter.filterType === 'Color') {
          const resultArray = filter.values.map((element) => `"${element}"`);
          filterArray.push(`variants.attributes.color.key:${resultArray.join(',')}`);
        } else if (filter.filterType === 'Brand') {
          const resultArray = filter.values.map((element) => `"${element}"`);
          filterArray.push(`variants.attributes.brand.key:${resultArray.join(',')}`);
        }
      }
    });

    this.createCards(filterArray);
  }

  resetFilters(): void {
    this.checkBoxFilterViews.forEach((element) => {
      const checkBox = element.getElement();
      checkBox.checked = false;
    });
    this.selectedCheckBoxFilters = [];
    this.minPriceFilterView.getElement().value = '';
    this.maxPriceFilterView.getElement().value = '';
    this.applyFilters();
  }

  async createCards(filter?: string | string[]): Promise<void> {
    this.cardsView.getElement().innerHTML = '';

    const productsResponse = await getProductProjections(this.consumer.apiClient, 30, 0, filter).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!productsResponse) return;

    this.products = productsResponse.body.results;
    this.countOfResultsView.getElement().textContent = `${this.products.length} results`;
    this.products.forEach((product) => {
      this.addProduct(product);
    });
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
    this.cardsView.appendNode(card);

    const productImageBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-60 h-60 border-2 rounded-lg border-solid border-[#fbedec] p-4 bg-bg-color',
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

    const aCard = new ElementAnchorCreator({ href: `/product/${product.slug[Store.Language]}`, classes: 'absolute inset-0' });
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
