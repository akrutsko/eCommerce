import { Category, ProductProjection, ProductType } from '@commercetools/platform-sdk';
import cartSvg from '../../../assets/svg/cart.svg';
import './catalog.css';
import arrowDownSVG from '../../../assets/svg/arrow-down.svg';
import searchIcon from '../../../assets/svg/search.svg';

import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { Message } from '../../utils/message/toastify-message';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { Router } from '../../router/router';
import { Store } from '../../enums/store';
import { getCategoryBySlug, getTreeOfCategories } from '../../utils/api/api-categories';
import { ElementLabelCreator } from '../../utils/element-creator/element-label-creator';
import { getPrice } from '../../utils/price/price';
import { getProductProjections, getProductTypes } from '../../utils/api/api-product';
import { Consumer } from '../consumer/consumer';
import { CategoryTree } from '../../interfaces/category';

export class Catalog {
  router: Router;

  consumer: Consumer;

  catalogView: ElementCreator<HTMLElement>;

  countOfResultsView: ElementCreator<HTMLElement>;

  cardsView: ElementCreator<HTMLElement>;

  checkBoxFilterViews: ElementCreator<HTMLInputElement>[] = [];

  minPriceFilterView: ElementCreator<HTMLInputElement>;

  maxPriceFilterView: ElementCreator<HTMLInputElement>;

  selectedFiltersView: ElementCreator<HTMLElement>;

  breadcrumbsBlock: ElementCreator<HTMLElement>;

  categories: Category[] = [];

  categoryTree: CategoryTree[] = [];

  products: ProductProjection[] = [];

  selectedCheckBoxFilters: SelectedFilters[] = [];

  currentSortingString: string | undefined;

  currentFilters: string | string[] = [];

  currentCategoryFilter: string | undefined;

  currentSearch = '';

  constructor(router: Router, consumer: Consumer, subCategory?: string) {
    this.router = router;
    this.consumer = consumer;
    this.breadcrumbsBlock = new ElementCreator({ tag: 'div', classes: 'flex gap-1' });
    this.catalogView = new ElementCreator({ tag: 'div', classes: 'w-full grow flex flex-col items-top gap-2' });
    this.countOfResultsView = new ElementCreator({ tag: 'div', text: '0 results' });
    this.selectedFiltersView = new ElementCreator({ tag: 'div', classes: 'flex gap-2 flex-wrap md:max-w-[55%]' });
    this.cardsView = new ElementCreator({
      tag: 'div',
      classes: 'w-full gap-4 products',
    });
    this.minPriceFilterView = new ElementInputCreator({
      type: 'number',
      classes: 'border-1 rounded-lg border-solid border-[#E8E6E8] w-0 grow max-w-[90px]',
    });
    this.maxPriceFilterView = new ElementInputCreator({
      type: 'number',
      classes: 'border-1 rounded-lg border-solid border-[#E8E6E8] w-0 grow max-w-[90px]',
    });
    this.createView(subCategory);
  }

  sort(fieldName: String, method: String): void {
    const sortingString = `${fieldName} ${method}`;
    this.createCards(this.currentFilters, sortingString, this.currentSearch);
    this.currentSortingString = sortingString;
  }

  async createView(subCategory?: string): Promise<void> {
    const firstBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-full justify-center flex-col gap-4 sm:justify-between sm:flex-row items-center flex md:gap-6 flex-wrap',
    });
    const catalogNameBlock = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-1 items-center sm:items-start' });
    const catalogName = new ElementCreator({ tag: 'h2', text: 'Catalog', classes: 'h2' });
    catalogNameBlock.appendNode(catalogName, this.breadcrumbsBlock);

    const form = new ElementCreator({ tag: 'form', classes: 'search-form max-w-full sm:max-w-xs' });
    const search = new ElementInputCreator({ type: 'search', name: 'search', placeholder: 'search' });
    search.getElement().addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.currentSearch = search.getElement().value;
        this.search(this.currentSearch);
      }
    });
    const submitButton = new ElementButtonCreator({ classes: 'absolute right-0 top-0 focus:outline-none', html: searchIcon });
    submitButton.getElement().addEventListener('click', () => {
      this.currentSearch = search.getElement().value;
      this.search(this.currentSearch);
    });
    search.getElement().addEventListener('search', () => {
      this.currentSearch = '';
      this.search(this.currentSearch);
    });
    form.appendNode(search, submitButton);
    firstBlock.appendNode(catalogNameBlock, form);

    const secondBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-full items-top justify-between flex flex-col md:flex-row gap-1',
    });
    this.categoryTree = await getTreeOfCategories(this.consumer.apiClient);
    const catalogBlock = new ElementAnchorCreator({ href: '/catalog', text: 'All products', classes: 'breadcrumbs' });
    this.breadcrumbsBlock.appendNode(catalogBlock);
    if (subCategory) {
      const cat = getCategoryBySlug(subCategory, this.categoryTree);
      const catId = cat?.id;
      this.currentCategoryFilter = `categories.id:subtree("${catId}")`;
      this.createBreadCrumb(cat);
    }

    await this.createCards();

    const sortByNameElement = new ElementButtonCreator({ classes: 'sorting-button  rounded-l-full', text: 'Sort by name' });
    const sortByPriceElement = new ElementButtonCreator({ classes: 'sorting-button  rounded-r-full', text: 'Sort by price' });

    sortByNameElement.getElement().addEventListener('click', () => {
      let sortingMethod = 'asc';
      if (sortByNameElement.getElement().classList.contains('asc')) {
        sortingMethod = 'desc';
        sortByNameElement.removeClass('asc');
        sortByNameElement.addClass('desc');
      } else {
        sortByNameElement.removeClass('desc');
        sortByNameElement.addClass('asc');
      }
      sortByPriceElement.removeClass('asc');
      sortByPriceElement.removeClass('desc');
      this.sort(`name.${Store.Language}`, sortingMethod);
    });

    sortByPriceElement.getElement().addEventListener('click', () => {
      let sortingMethod = 'asc';
      if (sortByPriceElement.getElement().classList.contains('asc')) {
        sortingMethod = 'desc';
        sortByPriceElement.removeClass('asc');
        sortByPriceElement.addClass('desc');
      } else {
        sortByPriceElement.removeClass('desc');
        sortByPriceElement.addClass('asc');
      }
      sortByNameElement.removeClass('asc');
      sortByNameElement.removeClass('desc');
      this.sort('price', sortingMethod);
    });

    const resultSortingView = new ElementCreator({ tag: 'div', classes: 'flex gap-1 items-center self-end' });
    resultSortingView.appendNode(this.countOfResultsView, sortByNameElement, sortByPriceElement);
    secondBlock.appendNode(this.selectedFiltersView, resultSortingView);

    const thirdBlock = new ElementCreator({ tag: 'div', classes: 'catalog gap-4' });
    const filtersPanel = new ElementCreator({
      tag: 'div',
      classes: 'w-full h-fit filters gap-2 bg-bg-color border-1 rounded-lg border-solid border-[#fbedec] p-4',
    });
    const filtersPanelHeader = new ElementCreator({
      tag: 'h4',
      text: 'Set filters',
      classes: 'h4',
    });
    filtersPanel.appendNode(filtersPanelHeader);

    this.createFiltersView(filtersPanel);

    thirdBlock.appendNode(filtersPanel, this.cardsView);

    this.catalogView.appendNode(firstBlock, secondBlock, thirdBlock);
  }

  createBreadCrumb(cat: CategoryTree | undefined): void {
    const crumb = new ElementCreator({ tag: 'span', text: ' » ', classes: 'text-primary-color opacity-60' }).getElement();
    if (cat?.parent) {
      const categoryBlock = new ElementAnchorCreator({
        href: `/categories/${cat.parent.slug}`,
        text: `${cat.parent.name}`,
        classes: 'breadcrumbs',
      });
      this.breadcrumbsBlock.appendNode(crumb, categoryBlock);
    }
    const secondCrumb = new ElementCreator({ tag: 'span', text: ' » ', classes: 'text-primary-color opacity-60' }).getElement();
    const categoryBlock = new ElementAnchorCreator({
      href: `/categories/${cat?.slug}`,
      text: `${cat?.name}`,
      classes: 'breadcrumbs',
    });
    this.breadcrumbsBlock.appendNode(secondCrumb, categoryBlock);
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

  createPriceFilter(filtersElementCreator: ElementCreator<HTMLElement>): void {
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

    this.minPriceFilterView.getElement().step = '1';
    this.minPriceFilterView.getElement().placeholder = '$0.00';

    this.maxPriceFilterView.getElement().step = '1';
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
      elementFilterInput.getElement().setAttribute('filter-value', filterElement.label);
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

  async createFiltersView(filtersElementCreator: ElementCreator<HTMLElement>): Promise<void> {
    const productsResponse = await getProductProjections(this.consumer.apiClient).catch(() => {
      new Message('Something went wrong. Try later.', 'error').showMessage();
    });
    if (!productsResponse) return;

    this.createPriceFilter(filtersElementCreator);

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

    const btsWrapper = new ElementCreator({ tag: 'div', classes: 'flex gap-4 sm:gap-2 justify-between mt-2' });
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
    this.selectedFiltersView.getElement().innerHTML = '';

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
      this.selectedFiltersView.appendNode(resetPriceElement);
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

    this.checkBoxFilterViews.forEach((checkbox) => {
      if (checkbox.getElement().checked) {
        const textName = checkbox.getElement().getAttribute('filter-name');
        const textValue = checkbox.getElement().getAttribute('filter-value');
        if (textName && textValue) {
          const resetFilterElement = new ElementCreator({
            tag: 'button',
            text: `${textValue}`,
            classes: 'filter-button flex items-center',
          });
          this.selectedFiltersView.appendNode(resetFilterElement);
        }
      }
    });

    this.currentFilters = filterArray;
    if (this.currentCategoryFilter) {
      filterArray.push(this.currentCategoryFilter);
    }

    this.createCards(filterArray, this.currentSortingString, this.currentSearch);
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

  search(word: string): void {
    this.checkBoxFilterViews.forEach((element) => {
      const checkBox = element.getElement();
      checkBox.checked = false;
    });
    this.selectedCheckBoxFilters = [];
    this.minPriceFilterView.getElement().value = '';
    this.maxPriceFilterView.getElement().value = '';
    this.createCards([], this.currentSortingString, word);
  }

  async createCards(filter?: string | string[], sort?: string, search?: string): Promise<void> {
    this.cardsView.getElement().innerHTML = '';
    let curFilter = filter;
    if (this.currentCategoryFilter) {
      if (curFilter instanceof Array) {
        curFilter.push(this.currentCategoryFilter);
      } else if (filter) {
        curFilter = [];
        curFilter.push(filter.toString());
        curFilter.push(this.currentCategoryFilter);
      } else {
        curFilter = this.currentCategoryFilter;
      }
    }
    const productsResponse = await getProductProjections(this.consumer.apiClient, 50, 0, curFilter, sort, search).catch(() => {
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
      classes:
        'relative max-w-full sm:max-w-sm card bg-white w-full h-auto mx-auto rounded-lg transition-all shadow-md hover:scale-[1.02] hover:shadow-xl',
    });
    this.cardsView.appendNode(card);

    const productImageBlock = new ElementCreator({
      tag: 'div',
      classes: 'w-full h-auto border-2 rounded-lg border-solid border-[#fbedec] p-4 bg-bg-color',
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

    const cartElement = new ElementButtonCreator({ classes: 'relative cart-button', html: cartSvg });
    productPricesBlock.appendNode(cartElement);

    const aCard = new ElementAnchorCreator({ href: `/product/${product.slug[Store.Language]}`, classes: 'absolute inset-0' });

    nameDescriptionBlock.appendNode(productNameBlock, productDescriptionBlock);
    infoBlock.appendNode(nameDescriptionBlock, productPricesBlock);
    card.appendNode(productImageBlock, infoBlock, aCard);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.catalogView;
  }

  getElement(): HTMLElement {
    return this.catalogView.getElement();
  }
}
