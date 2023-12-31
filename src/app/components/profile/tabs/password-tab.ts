import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { validatePassword } from '../../../utils/validation/input-validation';
import { Consumer } from '../../consumer/consumer';
import { FormInputPasswordCreator } from '../../../utils/element-creator/form-password-input-creator';
import { Message } from '../../../utils/message/toastify-message';
import { getAccessToken, getTokenClient } from '../../../utils/api/api-client';
import { Token } from '../../../enums/token';

export class PasswordTab extends AccordionTab {
  currentInputContainer: FormInputPasswordCreator;

  newInputContainer: FormInputPasswordCreator;

  constructor(consumer: Consumer, svg: string, heading: string) {
    super(consumer, svg, heading);
    this.currentInputContainer = new FormInputPasswordCreator('current password', validatePassword, 'max-w-xl');
    this.newInputContainer = new FormInputPasswordCreator('new password', validatePassword, 'max-w-xl');
  }

  createContent(): HTMLElement {
    const container = new ElementCreator({
      tag: 'div',
      text: 'here you can change your password if you want',
      classes: 'h5 opacity-60 font-medium',
    });
    return container.getElement();
  }

  createEdit(): HTMLElement {
    this.resetInputs();

    const container = new ElementCreator({ tag: 'div', classes: 'flex flex-col md:flex-row gap-4' });
    container.appendNode(this.currentInputContainer.getContainer(), this.newInputContainer.getContainer());
    return container.getElement();
  }

  resetInputs(): void {
    this.currentInputContainer.setInputValue('');
    this.newInputContainer.setInputValue('');
  }

  async saveChanges(): Promise<void> {
    const currentPassword = this.currentInputContainer.getInput().value;
    const newPassword = this.newInputContainer.getInput().value;

    try {
      await this.consumer.changePassword(currentPassword, newPassword);
      await getAccessToken()
        .then((res) => {
          if ('access_token' in res) {
            localStorage.setItem(Token.Access, String(res.access_token));
            this.consumer.apiClient = getTokenClient(String(res.access_token));
          }
        })
        .catch(() => {});
      new Message('Password has been changed.', 'info').showMessage();

      if (this.consumer.consumerData) {
        await this.consumer.logIn(this.consumer.consumerData.email, newPassword);
        this.resetState();
      }
    } catch (err) {
      if (err instanceof Error) {
        new Message(err.message || 'Something went wrong. Try later.', 'error').showMessage();
      }
    }
  }
}
