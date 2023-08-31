import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { validatePassword } from '../../../utils/validation/input-validation';
import { Consumer } from '../../consumer/consumer';
import { FormInputPasswordCreator } from '../../../utils/element-creator/form-password-input-creator';
// import { Message } from '../../../utils/message/toastify-message';

export class PasswordTab extends AccordionTab {
  currentInputContainer: FormInputPasswordCreator;

  newInputContainer: FormInputPasswordCreator;

  constructor(consumer: Consumer, svg: string, heading: string) {
    super(consumer, svg, heading);
    this.currentInputContainer = new FormInputPasswordCreator('current password', validatePassword);
    this.newInputContainer = new FormInputPasswordCreator('new password', validatePassword);
  }

  createContent(): HTMLElement {
    const container = new ElementCreator({ tag: 'div', text: 'here you can change your password if you want' });
    return container.getElement();
  }

  createEdit(): HTMLElement {
    if (!this.consumer.consumer) throw new Error('consumerData is undefined');

    const container = new ElementCreator({ tag: 'div', classes: 'flex gap-4' });

    container.appendNode(this.currentInputContainer.getContainer(), this.newInputContainer.getContainer());
    return container.getElement();
  }

  // todo: add methods to change password

  //   async saveChanges(): Promise<void> {
  //     const currentPassword = this.currentInputContainer.getInput().value;
  //     const newPassword = this.newInputContainer.getInput().value;

  //     await this.changeEmail(currentPassword, newPassword);
  //   }

  //   async changeEmail(currentPassword: string, newPassword: string): Promise<void> {
  //     if (!this.consumer.consumer) throw Error('consumerData does not exist');
  //     try {
  //       const consumerPassword = {
  //         version: this.consumer.consumer.version,
  //         currentPassword,
  //         newPassword,
  //       };
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         if (err.message) {
  //           new Message(err.message, 'error').showMessage();
  //         } else {
  //           new Message('Something went wrong. Try later.', 'error').showMessage();
  //         }
  //       }
  //     }
  //   }
}