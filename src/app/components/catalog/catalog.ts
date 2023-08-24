import searchIcon from '../../../assets/svg/search.svg';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';

export class Catalog {
  catalogView: ElementCreator<HTMLElement>;

  cardsList: ElementCreator<HTMLElement>[];

  constructor() {
    this.cardsList = [];
    this.catalogView = new ElementCreator({ tag: 'div', classes: 'w-full grow flex flex-col items-top' });
    this.createView();
  }

  createView(): void {
    const firstBlock = new ElementCreator({ tag: 'div', classes: 'w-full items-top justify-between flex gap-1' });
    const catalogNameBlock = new ElementCreator({ tag: 'div', classes: '' });
    const breadcrumbsBlock = new ElementCreator({ tag: 'div', text: '1>2', classes: 'breadcrumbs' });
    const catalogName = new ElementCreator({ tag: 'h2', text: 'Catalog', classes: 'h2' });
    catalogNameBlock.appendNode(catalogName, breadcrumbsBlock);

    const form = new ElementCreator({ tag: 'form', classes: 'search-form' });
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

    const thirdBlock = new ElementCreator({ tag: 'div', classes: 'w-full grow items-top justify-between flex gap-1' });
    const filters = new ElementCreator({ tag: 'div', classes: '', text: 'filters' });
    const cards = new ElementCreator({ tag: 'div', classes: 'grow flex flex-wrap' });
    thirdBlock.appendNode(filters, cards);

    for (let i = 0; i < 9; i += 1) {
      const card = new ElementCreator({ tag: 'div', classes: 'card w-36 h-36 border border-1 border-blue-500', text: `card ${i}` });
      cards.appendNode(card);
      this.cardsList.push(card);
    }

    this.catalogView.appendNode(firstBlock, secondBlock, thirdBlock);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.catalogView;
  }

  getElement(): HTMLElement {
    return this.catalogView.getElement();
  }
}
