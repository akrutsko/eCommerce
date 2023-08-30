import { Customer } from '@commercetools/platform-sdk';
import { AccordionTab } from '../tab';
import { ElementCreator } from '../../../utils/element-creator/element-creator';
import { FormInputCreator } from '../../../utils/element-creator/form-input-creator';
import { validateOnlyLetters } from '../../../utils/validation/input-validation';
import { FormInputBirthdateCreator } from '../../../utils/element-creator/form-birthdate-inputCreator';

export class PersonalTab extends AccordionTab {
  nameInputContainer: FormInputCreator;

  surnameInputContainer: FormInputCreator;

  dateInputContainer: FormInputBirthdateCreator;

  constructor(consumerData: Customer, svg: string, heading: string) {
    super(consumerData, svg, heading);
    this.nameInputContainer = new FormInputCreator({ placeholder: 'name', validation: validateOnlyLetters });
    this.surnameInputContainer = new FormInputCreator({ placeholder: 'surname', validation: validateOnlyLetters });
    this.dateInputContainer = new FormInputBirthdateCreator('dateOfBirth', 'relative w-full');
  }

  createContent(): HTMLElement {
    if (!this.consumerData) throw new Error('consumerData is undefined');

    const nameContainer = new ElementCreator({ tag: 'div' });
    const nameTitle = new ElementCreator({ tag: 'div', text: 'name', classes: 'opacity-60 h5' });
    const name = new ElementCreator({
      tag: 'div',
      text: this.consumerData.firstName,
      classes: 'data-field text-xs font-medium',
    });
    nameContainer.appendNode(nameTitle, name);

    const surnameContainer = new ElementCreator({ tag: 'div' });
    const surnameTitle = new ElementCreator({ tag: 'div', text: 'surname', classes: 'opacity-60 h5' });
    const surname = new ElementCreator({
      tag: 'div',
      text: this.consumerData.lastName,
      classes: 'data-field text-xs font-medium',
    });
    surnameContainer.appendNode(surnameTitle, surname);

    const dateContainer = new ElementCreator({ tag: 'div' });
    const dateTitle = new ElementCreator({ tag: 'div', text: 'date of birth', classes: 'opacity-60 h5' });

    const date = new ElementCreator({
      tag: 'div',
      text: this.consumerData.dateOfBirth,
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

    if (this.consumerData) {
      if (this.consumerData.firstName) this.nameInputContainer.setInputValue(this.consumerData.firstName);
      if (this.consumerData.lastName) this.surnameInputContainer.setInputValue(this.consumerData.lastName);
      if (this.consumerData.dateOfBirth) this.dateInputContainer.setInputValue(this.consumerData.dateOfBirth);
    }

    inputsContainer.appendNode(
      this.nameInputContainer.getContainer(),
      this.surnameInputContainer.getContainer(),
      this.dateInputContainer.getContainer(),
    );

    return content.appendNode(inputsContainer.getElement()).getElement();
  }

  setActions(newFirstName: string, newLastName: string, newDateOfBirth: string): void {
    if (newFirstName !== this.consumerData.firstName) {
      this.actions.push({ action: 'setFirstName', firstName: newFirstName });
    }
    if (newLastName !== this.consumerData.lastName) {
      this.actions.push({ action: 'setLastName', lastName: newLastName });
    }
    if (newDateOfBirth !== this.consumerData.dateOfBirth) {
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
