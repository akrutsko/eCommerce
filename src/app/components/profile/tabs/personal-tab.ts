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
    if (!this.consumer.consumer) throw new Error('consumerData is undefined');

    const nameContainer = new ElementCreator({ tag: 'div' });
    const nameTitle = new ElementCreator({ tag: 'div', text: 'name', classes: 'opacity-60 h5' });
    const name = new ElementCreator({
      tag: 'div',
      text: this.consumer.consumer.firstName,
      classes: 'data-field text-xs font-medium',
    });
    nameContainer.appendNode(nameTitle, name);

    const surnameContainer = new ElementCreator({ tag: 'div' });
    const surnameTitle = new ElementCreator({ tag: 'div', text: 'surname', classes: 'opacity-60 h5' });
    const surname = new ElementCreator({
      tag: 'div',
      text: this.consumer.consumer.lastName,
      classes: 'data-field text-xs font-medium',
    });
    surnameContainer.appendNode(surnameTitle, surname);

    const dateContainer = new ElementCreator({ tag: 'div' });
    const dateTitle = new ElementCreator({ tag: 'div', text: 'date of birth', classes: 'opacity-60 h5' });

    const date = new ElementCreator({
      tag: 'div',
      text: this.consumer.consumer.dateOfBirth,
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

    if (this.consumer.consumer) {
      if (this.consumer.consumer.firstName) this.nameInputContainer.setInputValue(this.consumer.consumer.firstName);
      if (this.consumer.consumer.lastName) this.surnameInputContainer.setInputValue(this.consumer.consumer.lastName);
      if (this.consumer.consumer.dateOfBirth) this.dateInputContainer.setInputValue(this.consumer.consumer.dateOfBirth);
    }

    inputsContainer.appendNode(
      this.nameInputContainer.getContainer(),
      this.surnameInputContainer.getContainer(),
      this.dateInputContainer.getContainer(),
    );

    return content.appendNode(inputsContainer.getElement()).getElement();
  }

  setActions(newFirstName: string, newLastName: string, newDateOfBirth: string): void {
    if (!this.consumer.consumer) throw Error('consumerData does not exist');
    if (newFirstName !== this.consumer.consumer.firstName) {
      this.actions.push({ action: 'setFirstName', firstName: newFirstName });
    }
    if (newLastName !== this.consumer.consumer.lastName) {
      this.actions.push({ action: 'setLastName', lastName: newLastName });
    }
    if (newDateOfBirth !== this.consumer.consumer.dateOfBirth) {
      this.actions.push({ action: 'setDateOfBirth', dateOfBirth: newDateOfBirth });
    }
  }

  async saveChanges(): Promise<void> {
    const newFirstName = this.nameInputContainer.getInput().value;
    const newLastName = this.surnameInputContainer.getInput().value;
    const newDateOfBirth = this.dateInputContainer.getInput().value;

    this.setActions(newFirstName, newLastName, newDateOfBirth);

    await super.saveChanges();
  }
}
