import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { HandlerLinks } from '../../router/handler-links';
import { Router } from '../../router/router';

export class Absent extends HandlerLinks {
  notFoundView: ElementCreator<HTMLElement>;

  homeButton: HTMLAnchorElement;

  backButton: HTMLButtonElement;

  constructor(router: Router) {
    super(router);
    this.notFoundView = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] rounded-xl w-full flex-1 p-5 md:p-10 relative' });
    this.homeButton = new ElementAnchorCreator({ href: '/', classes: 'primary-button', text: 'Home' }).getElement();
    this.listOfLinks.push(this.homeButton);
    this.backButton = new ElementButtonCreator({ classes: 'secondary-button', text: 'Go back' }).getElement();
    this.backButton.addEventListener('click', () => {
      window.history.back();
    });
    this.createView();
    this.handleLinks();
  }

  createView(): void {
    const infoMessage = new ElementCreator({
      tag: 'h3',
      text: "🚴‍♂️ Oops, looks like you got off Route 404! Lost like a cyclist in strange places. But don't worry, we're here to help you get back in the game!",
    });

    const buttons = new ElementCreator({ tag: 'div', classes: 'flex gap-4 md:gap-6 mt-4' });
    buttons.appendNode(this.homeButton, this.backButton);

    const wrapper = new ElementCreator({ tag: 'div', classes: 'max-w-full md:max-w-2xl' });
    wrapper.appendNode(infoMessage, buttons);

    const errorMessage = new ElementCreator({
      tag: 'div',
      classes:
        'text-[#DFDDDF] text-9xl md:text-[265px] lg:text-[350px] font-bold drop-shadow-[10px_4px_0px_rgba(57,62,77,0.18)] absolute bottom-6 right-6',
      text: '404',
    });

    this.notFoundView.appendNode(wrapper, errorMessage);
  }

  getView(): ElementCreator<HTMLElement> {
    return this.notFoundView;
  }

  getElement(): HTMLElement {
    return this.notFoundView.getElement();
  }
}
