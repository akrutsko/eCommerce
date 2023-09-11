import { ElementButtonCreator } from '../element-creator/element-button-creator';
import { ElementCreator } from '../element-creator/element-creator';

export class Confirmation {
  callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;
  }

  showConfirmation(text: string): void {
    const bg = new ElementCreator({ tag: 'div', classes: 'absolute bg-secondary-color opacity-50 inset-0' });
    const confirmation = new ElementCreator({
      tag: 'div',
      classes: 'bg-[#F1EFEF] p-4 w-full absolute top-20 left-2/4 -translate-x-2/4 drop-shadow-md max-w-xs rounded-xl',
    });

    const title = new ElementCreator({ tag: 'h4', classes: 'h4 text-center', text: 'Are you shure?' });
    const message = new ElementCreator({ tag: 'div', classes: 'text-xs opacity-60 text-center', text });

    const buttons = new ElementCreator({ tag: 'div', classes: 'flex gap-2 mt-3' });
    const cancelButton = new ElementButtonCreator({ classes: 'secondary-button w-full', text: 'cancel' });
    const okButton = new ElementButtonCreator({ classes: 'primary-button w-full', text: 'ok' });
    buttons.appendNode(cancelButton, okButton);

    confirmation.appendNode(title, message, buttons);

    cancelButton.setHandler('click', () => {
      bg.getElement().remove();
      confirmation.getElement().remove();
    });
    okButton.setHandler('click', () => {
      bg.getElement().remove();
      confirmation.getElement().remove();
      this.callback();
    });

    document.body.append(bg.getElement(), confirmation.getElement());
  }
}
