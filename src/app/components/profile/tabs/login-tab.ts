import { Customer, CustomerChangeEmailAction } from '@commercetools/platform-sdk';
import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { validateEmail } from '../../../utils/validation/input-validation';

export class LoginTab extends AccordionTab {
  emailInputContainer: FormInputCreator;

  constructor(consumerData: Customer, svg: string, heading: string) {
    super(consumerData, svg, heading);
    this.emailInputContainer = new FormInputCreator({ placeholder: 'email', validation: validateEmail });
  }

  createContent(): HTMLElement {
    if (!this.consumerData) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' });
    const email = new ElementCreator({ tag: 'div', text: this.consumerData.email, classes: 'text-xs font-medium' });

    container.appendNode(emailTitle, email);
    return container.getElement();
  }

  createEdit(): HTMLElement {
    if (!this.consumerData) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div' });
    const emailTitle = new ElementCreator({ tag: 'div', text: 'Login(email)', classes: 'opacity-60 h5' }).getElement();

    if (this.consumerData.email) this.emailInputContainer.setInputValue(this.consumerData.email);
    container.appendNode(emailTitle, this.emailInputContainer.getContainer());
    return container.getElement();
  }

  setActions(newEmail: string): void {
    if (newEmail !== this.consumerData.email) {
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
