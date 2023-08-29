import { Category, ProductProjection } from '@commercetools/platform-sdk';
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
import { getPrice } from '../../utils/price/price';

interface FilterInterface {
  id: string;
  name: string;
}
interface Attribute {
  key: string;
  label: string;
}
interface SelectedFilters {
  filterType: string;
  values: string[];
}
export class Catalog extends HandlerLinks {
  catalogView: ElementCreator<HTMLElement>;

  products: ProductProjection[] = [];

  selectedFilters: SelectedFilters[] = [];

  elementCountOfResults: ElementCreator<HTMLElement>;

  categories: Category[] = [];

  cardsElementCreator: ElementCreator<HTMLElement>;

  constructor(router: Router) {
    super(router);
    this.elementCountOfResults = new ElementCreator({ tag: 'div', classes: '', text: '0 results' });
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
    const selectedFilfers = new ElementCreator({ tag: 'div', classes: '', text: 'checked filters, sorting' });

    await this.createCards();

    secondBlock.appendNode(selectedFilfers, this.elementCountOfResults);

    const thirdBlock = new ElementCreator({ tag: 'div', classes: 'w-full justify-between flex gap-3 flex-wrap' });
    const filtersPanel = new ElementCreator({
      tag: 'div',
      classes:
        'w-full md:w-1/4 lg:w-1/8 flex flex-col flex-wrap filters flex-grow-0 flex-shrink-0 gap-2 bg-bg-color border-1 rounded-lg border-solid border-[#fbedec] p-4',
    });
    const filtersPanelHeader = new ElementCreator({
      tag: 'h4',
      text: 'Set filters',
      classes: 'text-center font-ubuntu text-base font-medium leading-5 tracking-normal',
    });
    filtersPanel.appendNode(filtersPanelHeader);
    this.createFiltersPanel(filtersPanel);

    thirdBlock.appendNode(filtersPanel, this.cardsElementCreator);

    this.catalogView.appendNode(firstBlock, secondBlock, thirdBlock);
  }

  changeArraySelectedFilters(filterName: string, isChecked: boolean, value: string): void {
    const foundFilter = this.selectedFilters.find((filter) => filter.filterType === filterName);
    if (isChecked) {
      if (foundFilter) {
        if (!foundFilter.values.includes(value)) {
          foundFilter.values.push(value);
        }
      } else {
        this.selectedFilters.push({ filterType: filterName, values: [value] });
      }
    } else if (foundFilter) {
      const index = foundFilter.values.indexOf(value);
      if (index !== -1) {
        foundFilter.values.splice(index, 1);
      }
    }
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
      const elementFilterInput = new ElementInputCreator({
        type: 'checkbox',
        classes: 'block',
        value: filterElement.id,
        id: filterElement.id,
      });
      const elementFilterLabel = new ElementLabelCreator({ for: filterElement.id, text: filterElement.name });
      elementFilterWrapper.appendNode(elementFilterInput, elementFilterLabel);
      elementFilterPanel.appendNode(elementFilterWrapper);
      elementFilterInput.getElement().addEventListener('change', (event) => {
        if (event.target) {
          const isChecked = elementFilterInput.getElement().checked;
          const { value } = elementFilterInput.getElement();
          this.changeArraySelectedFilters(filterName, isChecked, value);
        }
      });
    });
    filtersElementCreator.appendNode(elementAccordion);

    elementFilterName.getElement().addEventListener('click', () => {
      elementFilterPanel.toggleClass('active');
      elementFilterArrow.toggleClass('arrow-active');
    });
  }

  getUniqueAttributes(products: ProductProjection[], nameAttribute: string): FilterInterface[] {
    const uniqueAttributes: Attribute[] = [];
    products.forEach((product) => {
      product.variants.push(product.masterVariant);
      product.variants.forEach((variant) => {
        if (variant.attributes) {
          const attribute = variant.attributes.find((attr) => attr.name === nameAttribute);

          if (attribute) {
            attribute.value.forEach((brand: Attribute) => {
              if (!uniqueAttributes.some((existingBrand) => existingBrand.key === brand.key)) {
                uniqueAttributes.push(brand);
              }
            });
          }
        }
      });
    });
    return uniqueAttributes.map((brand) => ({
      id: brand.key,
      name: brand.label,
    }));
  }

  async createFiltersPanel(filtersElementCreator: ElementCreator<HTMLElement>): Promise<void> {
    // TODO: add price filter
    const categoriesResponse = await getCategories(getCtpClient());
    if (categoriesResponse.statusCode === 200) {
      this.categories = categoriesResponse.body.results;
      const filterArray: FilterInterface[] = [];
      this.categories.forEach((category) => {
        filterArray.push({ id: category.id, name: category.name[Store.Language] });
      });

      this.createCheckBoxFilter('Category', filterArray, filtersElementCreator);
    }

    const filterBrandString = 'variants.attributes.brand.key:exists';
    const variantsWithBrand = await getProductProjections(getCtpClient(), filterBrandString);

    if (variantsWithBrand.statusCode === 200) {
      const filterArray = this.getUniqueAttributes(variantsWithBrand.body.results, 'brand');
      this.createCheckBoxFilter('Brand', filterArray, filtersElementCreator);
    }

    const filterColorString = 'variants.attributes.color.key:exists';
    const variantsWithColor = await getProductProjections(getCtpClient(), filterColorString);

    if (variantsWithColor.statusCode === 200) {
      const filterArray = this.getUniqueAttributes(variantsWithColor.body.results, 'color');
      this.createCheckBoxFilter('Color', filterArray, filtersElementCreator);
    }
    const elementFilterButton = new ElementButtonCreator({ text: 'apply filters', classes: 'primary-button' });
    filtersElementCreator.appendNode(elementFilterButton);

    elementFilterButton.getElement().addEventListener('click', () => {
      this.filterProducts();
    });
  }

  filterProducts(): void {
    const filterArray: string[] = [];
    this.selectedFilters.forEach((filter) => {
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

    // const filterStr3 = 'variants.price.centAmount:range (3000 to 5000)';
    // filterArray.push(filterStr3);

    this.createCards(filterArray);
  }

  async createCards(filter?: string | string[]): Promise<void> {
    this.cardsElementCreator.getElement().innerHTML = '';
    try {
      const productsResponse = await getProductProjections(getCtpClient(), filter);
      if (productsResponse.statusCode === 200) {
        this.products = productsResponse.body.results;
        this.elementCountOfResults.getElement().textContent = `${this.products.length} results`;
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
