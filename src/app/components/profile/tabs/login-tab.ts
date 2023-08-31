import { CustomerChangeEmailAction } from '@commercetools/platform-sdk';
import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { validateEmail } from '../../../utils/validation/input-validation';
import { Consumer } from '../../consumer/consumer';

export class LoginTab extends AccordionTab {
  emailInputContainer: FormInputCreator;

  constructor(consumer: Consumer, svg: string, heading: string) {
    super(consumer, svg, heading);
    this.emailInputContainer = new FormInputCreator({ placeholder: 'email', validation: validateEmail });
  }

  createContent(): HTMLElement {
    if (!this.consumer.consumer) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' });
    const email = new ElementCreator({ tag: 'div', text: this.consumer.consumer.email, classes: 'text-xs font-medium' });

    container.appendNode(emailTitle, email);
    return container.getElement();
  }

  createEdit(): HTMLElement {
    if (!this.consumer.consumer) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' }).getElement();

    if (this.consumer.consumer.email) this.emailInputContainer.setInputValue(this.consumer.consumer.email);
    container.appendNode(emailTitle, this.emailInputContainer.getContainer());
    return container.getElement();
  }

  setActions(newEmail: string): void {
    if (!this.consumer.consumer) throw Error('consumerData does not exist');

    if (newEmail !== this.consumer.consumer.email) {
      const action: CustomerChangeEmailAction = { action: 'changeEmail', email: newEmail };
      this.actions.push(action);
    }
  }

  async saveChanges(): Promise<void> {
    const newEmail = this.emailInputContainer.getInput().value;
    this.setActions(newEmail);

    await super.saveChanges();
  }
}
