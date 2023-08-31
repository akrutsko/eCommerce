import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { validateOnlyLetters } from '../../../utils/validation/input-validation';
import { FormInputBirthdateCreator } from '../../../utils/element-creator/form-birthdate-inputCreator';
import { Consumer } from '../../consumer/consumer';

export class PersonalTab extends AccordionTab {
  nameInputContainer: FormInputCreator;

  surnameInputContainer: FormInputCreator;

  dateInputContainer: FormInputBirthdateCreator;

  constructor(consumer: Consumer, svg: string, heading: string) {
    super(consumer, svg, heading);
    this.nameInputContainer = new FormInputCreator({ placeholder: 'name', validation: validateOnlyLetters });
    this.surnameInputContainer = new FormInputCreator({ placeholder: 'surname', validation: validateOnlyLetters });
    this.dateInputContainer = new FormInputBirthdateCreator('dateOfBirth', 'relative w-full');
  }

  createContent(): HTMLElement {
    if (!this.consumer.consumerData) throw new Error('consumerData is undefined');

    const nameContainer = new ElementCreator({ tag: 'div' });
    const nameTitle = new ElementCreator({ tag: 'div', text: 'name', classes: 'opacity-60 h5' });
    const name = new ElementCreator({
      tag: 'div',
      text: this.consumer.consumerData.firstName,
      classes: 'data-field text-xs font-medium',
    });
    nameContainer.appendNode(nameTitle, name);

    const surnameContainer = new ElementCreator({ tag: 'div' });
    const surnameTitle = new ElementCreator({ tag: 'div', text: 'surname', classes: 'opacity-60 h5' });
    const surname = new ElementCreator({
      tag: 'div',
      text: this.consumer.consumerData.lastName,
      classes: 'data-field text-xs font-medium',
    });
    surnameContainer.appendNode(surnameTitle, surname);

    const dateContainer = new ElementCreator({ tag: 'div' });
    const dateTitle = new ElementCreator({ tag: 'div', text: 'date of birth', classes: 'opacity-60 h5' });

    const date = new ElementCreator({
      tag: 'div',
      text: this.consumer.consumerData.dateOfBirth,
      classes: 'data-field text-xs font-medium',
    });
    dateContainer.appendNode(dateTitle, date);

    const personalInfoContainer = new ElementCreator({ tag: 'div', classes: 'flex justify-between' });
    personalInfoContainer.appendNode(nameContainer, surnameContainer, dateContainer);

    return personalInfoContainer.getElement();
  }

  createEdit(): HTMLElement {
    const content = new ElementCreator({ tag: 'div' });

    const inputsContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between gap-2 md:flex-row md:flex-nowrap md:gap-4',
    });

    this.nameInputContainer.addLabel('name');
    this.surnameInputContainer.addLabel('surname');
    this.dateInputContainer.addLabel('date of birth');

    if (this.consumer.consumerData) {
      if (this.consumer.consumerData.firstName) this.nameInputContainer.setInputValue(this.consumer.consumerData.firstName);
      if (this.consumer.consumerData.lastName) this.surnameInputContainer.setInputValue(this.consumer.consumerData.lastName);
      if (this.consumer.consumerData.dateOfBirth) this.dateInputContainer.setInputValue(this.consumer.consumerData.dateOfBirth);
    }

    inputsContainer.appendNode(
      this.nameInputContainer.getContainer(),
      this.surnameInputContainer.getContainer(),
      this.dateInputContainer.getContainer(),
    );

    return content.appendNode(inputsContainer.getElement()).getElement();
  }

  async saveChanges(): Promise<void> {
    // const newFirstName = this.nameInputContainer.getInput().value; // newFirstName !== this.consumer.consumerData.firstName
    // const newLastName = this.surnameInputContainer.getInput().value; // newLastName !== this.consumer.consumerData.lastName
    // eslint-disable-next-line max-len
    // const newDateOfBirth = this.dateInputContainer.getInput().value; // newDateOfBirth !== this.consumer.consumerData.dateOfBirth
    super.saveChanges();
  }
}
