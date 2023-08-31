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
    if (!this.consumer.consumerData) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' });
    const email = new ElementCreator({ tag: 'div', text: this.consumer.consumerData.email, classes: 'text-xs font-medium' });

    container.appendNode(emailTitle, email);
    return container.getElement();
  }

  createEdit(): HTMLElement {
    if (!this.consumer.consumerData) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' }).getElement();

    if (this.consumer.consumerData.email) this.emailInputContainer.setInputValue(this.consumer.consumerData.email);
    container.appendNode(emailTitle, this.emailInputContainer.getContainer());
    return container.getElement();
  }

  async saveChanges(): Promise<void> {
    // const newEmail = this.emailInputContainer.getInput().value;

    super.saveChanges();
  }
}
