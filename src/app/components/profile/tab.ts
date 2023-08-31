import { CustomerUpdate, CustomerUpdateAction } from '@commercetools/platform-sdk';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';

import arrow from '../../../assets/svg/arrow.svg';
import { getCtpClient } from '../../utils/api/api-client';
import { updateConsumer } from '../../utils/api/api-consumer';
import { Message } from '../../utils/message/toastify-message';
import { Consumer } from '../consumer/consumer';

export abstract class AccordionTab {
  tab: ElementCreator<HTMLElement>;

  contentField: ElementCreator<HTMLElement>;

  editButton: HTMLButtonElement;

  saveButton: HTMLButtonElement;

  cancelButton: HTMLButtonElement;

  actions: CustomerUpdateAction[];

  consumer: Consumer;

  constructor(consumer: Consumer, svg: string, heading: string) {
    this.consumer = consumer;
    this.tab = new ElementCreator({ tag: 'div', classes: 'tab w-full p-4 md:p-6 bg-white rounded-xl' });
    this.contentField = new ElementCreator({ tag: 'div', classes: 'content mx-2 sm:mx-4 md:mx-8 mt-2 hidden' });
    this.editButton = new ElementButtonCreator({ classes: 'primary-button mt-3 py-1', text: 'edit' }).getElement();
    this.saveButton = new ElementButtonCreator({ disabled: true, classes: 'primary-button py-1', text: 'save' }).getElement();
    this.cancelButton = new ElementButtonCreator({ classes: 'secondary-button py-1', text: 'cancel' }).getElement();
    this.actions = [];

    this.createView(svg, heading);
    this.initialize();
  }

  abstract createContent(): HTMLElement;
  abstract createEdit(): HTMLElement;

  createView(svg: string, heading: string): void {
    const header = new ElementCreator({
      tag: 'div',
      classes: 'tab-header flex flex-row-reverse cursor-pointer justify-between items-center',
      html: arrow,
    });

    const titleContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-4 items-center', html: svg });
    const title = new ElementCreator({ tag: 'h4', classes: 'h4', text: heading });
    titleContainer.appendNode(title);
    header.appendNode(titleContainer);

    this.contentField.appendNode(this.createContent(), this.editButton);

    this.tab.appendNode(header, this.contentField);

    header.getElement().addEventListener('click', () => {
      this.contentField.getElement().classList.toggle('hidden');
    });
  }

  initialize(): void {
    this.editButton.addEventListener('click', () => this.openEditMode());
    this.saveButton.addEventListener('click', () => this.saveChanges());
    this.cancelButton.addEventListener('click', () => this.cancelChanges());
  }

  validateSaveButton(): void {
    const allInputs = this.getElement().querySelectorAll('input');
    const allErrors = this.getElement().querySelectorAll('div.error');
    const emptyInputs = [...allInputs].filter((input) => input.value.length === 0);
    const showingErrors = [...allErrors].filter((error) => !error.classList.contains('hidden'));
    this.saveButton.disabled = Boolean(showingErrors.length || emptyInputs.length);
  }

  createSaveCancelButton(): HTMLElement {
    const buttonsContainer = new ElementCreator({ tag: 'div', classes: 'flex gap-2 mt-3' });
    buttonsContainer.appendNode(this.saveButton, this.cancelButton);
    return buttonsContainer.getElement();
  }

  getElement(): HTMLElement {
    return this.tab.getElement();
  }

  private openEditMode(): void {
    this.contentField.getElement().innerHTML = '';
    const edit = this.createEdit();
    this.contentField.appendNode(edit, this.createSaveCancelButton());

    const inputs = edit.querySelectorAll('input');
    const select = edit.querySelector('select');

    select?.addEventListener('change', () => this.validateSaveButton());
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        this.validateSaveButton();
      });
    });
  }

  async saveChanges(): Promise<void> {
    this.saveButton.disabled = true;
    await this.updateCustomer();
    this.contentField.getElement().innerHTML = '';
    this.contentField.appendNode(this.createContent(), this.editButton);
  }

  private cancelChanges(): void {
    this.saveButton.disabled = true;
    this.contentField.getElement().innerHTML = '';
    this.contentField.appendNode(this.createContent(), this.editButton);
  }

  async updateCustomer(): Promise<void> {
    if (!this.consumer.consumer) throw Error('consumerData does not exist');
    try {
      const consumerUpdate: CustomerUpdate = {
        version: this.consumer.consumer.version,
        actions: this.actions,
      };

      await updateConsumer(getCtpClient(), this.consumer.consumer.id, consumerUpdate);
      await this.consumer.updateConsumer();
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
}
