import './modal.css';
import cross from '../../../assets/svg/cross.svg';

import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementDialogCreator } from '../../utils/element-creator/element-dialog-creator';

export class Modal {
  modalView: ElementCreator<HTMLDialogElement>;

  constructor() {
    this.modalView = new ElementDialogCreator({ classes: 'fixed select-none' });

    this.createView();
  }

  createView(): void {
    const closeButton = new ElementButtonCreator({
      tag: 'button',
      classes: 'absolute z-10 top-5 right-5 scale-150 cursor-pointer outline-none text-primary-color',
      html: cross,
    });
    closeButton.setHandler('click', () => {
      document.body.classList.remove('active');
      this.getElement().close();
      this.getElement().remove();
    });
    this.modalView.appendNode(closeButton);
  }

  getView(): ElementCreator<HTMLDialogElement> {
    return this.modalView;
  }

  getElement(): HTMLDialogElement {
    return this.modalView.getElement();
  }

  showModal(): void {
    document.body.classList.add('active');
    this.getElement().showModal();
  }
}
