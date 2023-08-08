import { ElementButtonCreator } from '../app/utils/element-creator/element-button-creator';
import { ElementCreator } from '../app/utils/element-creator/element-creator';
import { ElementInputCreator } from '../app/utils/element-creator/element-input-creator';

describe('Test constuctors of ElementCreator', () => {
  test('Should create a div element with specified text and classes', () => {
    const text = 'Test text';
    const divCreator = new ElementCreator({
      tag: 'div',
      text,
      classes: 'div-class',
    });

    const divElement = divCreator.getElement();

    expect(divElement.tagName).toBe('DIV');
    expect(divElement).toHaveTextContent(text);
    expect(divElement).toHaveClass('div-class');
  });

  test('Should create an input element with specified classes, type and value', () => {
    const inputType = 'text';
    const inputValue = 'Hello, Jest!';

    const inputCreator = new ElementInputCreator({
      tag: '',
      type: inputType,
      value: inputValue,
      classes: 'input-class',
    });

    const inputElement = inputCreator.getElement();

    expect(inputElement.tagName).toBe('INPUT');
    expect(inputElement.type).toBe(inputType);
    expect(inputElement).toHaveValue(inputValue);
    expect(inputElement).toHaveClass('input-class');
  });
});

test('Should create a button element with specified text, classes and disabled attribute', () => {
  const text = 'Click me!';
  const disabled = true;

  const buttonCreator = new ElementButtonCreator({
    tag: '',
    text,
    disabled,
    classes: 'button-class',
  });

  const buttonElement = buttonCreator.getElement();

  expect(buttonElement.tagName).toBe('BUTTON');
  expect(buttonElement).toHaveTextContent(text);
  expect(buttonElement).toBeDisabled();
  expect(buttonElement).toHaveClass('button-class');
});

describe('Test class methods of ElementCreator', () => {
  test('Should add classes to the element', () => {
    const classesToAdd = ['class1', 'class2'];

    const elementCreator = new ElementCreator({
      tag: 'div',
      classes: 'initial-class',
    });

    elementCreator.addClasses(classesToAdd);

    const element = elementCreator.getElement();

    expect(element).toHaveClass('initial-class');
    expect(element).toHaveClass('class1');
    expect(element).toHaveClass('class2');
  });

  test('Should set event handler on the element', () => {
    let eventHandled = false;

    const elementCreator = new ElementButtonCreator({
      tag: '',
      text: 'Click me',
    });

    const clickHandler = (): void => {
      eventHandled = true;
    };

    elementCreator.setHandler('click', clickHandler);

    const element = elementCreator.getElement();
    element.click();

    expect(eventHandled).toBeTruthy();
  });
});
