import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { validateEmail } from '../../../utils/validation/input-validation';
import { Consumer } from '../../consumer/consumer';
import { Message } from '../../../utils/message/toastify-message';

export class LoginTab extends AccordionTab {
  emailInputContainer: FormInputCreator;

  constructor(consumer: Consumer, svg: string, heading: string) {
    super(consumer, svg, heading);
    this.emailInputContainer = new FormInputCreator({ placeholder: 'email', validation: validateEmail });
  }

  createContent(): HTMLElement {
    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'email', classes: 'opacity-60 h5' });
    const email = new ElementCreator({
      tag: 'div',
      text: this.consumer.consumerData?.email || '',
      classes: 'text-xs font-medium',
    });

    container.appendNode(emailTitle, email);
    return container.getElement();
  }

  createEdit(): HTMLElement {
    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'email', classes: 'opacity-60 h5' }).getElement();

    this.emailInputContainer.setInputValue(this.consumer.consumerData?.email || '');
    container.appendNode(emailTitle, this.emailInputContainer.getContainer());
    return container.getElement();
  }

  async saveChanges(): Promise<void> {
    const newEmail = this.emailInputContainer.getInput().value;

    try {
      await this.consumer.changeEmail(newEmail);
      new Message('Email has been changed.', 'info').showMessage();
      this.resetState();
    } catch (err) {
      if (err instanceof Error) {
        new Message(err.message || 'Something went wrong. Try later.', 'error').showMessage();
      }
    }
  }
}
