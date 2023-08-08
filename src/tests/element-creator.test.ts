import { ElementButtonCreator } from '../app/utils/element-creator/element-button-creator';
import { ElementCreator } from '../app/utils/element-creator/element-creator';
import { ElementInputCreator } from '../app/utils/element-creator/element-input-creator';

describe('Test constuctors of ElementCreator', () => {
  test('Should create a div element with specified text and classes', () => {
    const text = 'Test text';
    const divCreator = new ElementCreator({
      tag: 'div',
      text,
      classes: ['div-class'],
    });

    const divElement = divCreator.getElement();

    expect(divElement.tagName).toBe('DIV');
    expect(divElement.textContent).toBe(text);
    expect(divElement.classList.contains('div-class')).toBe(true);
  });

  test('Should create an input element with specified classes, type and value', () => {
    const inputType = 'text';
    const inputValue = 'Hello, Jest!';

    const inputCreator = new ElementInputCreator({
      tag: 'input',
      type: inputType,
      value: inputValue,
      classes: ['input-class'],
    });

    const inputElement = inputCreator.getElement();

    expect(inputElement.tagName).toBe('INPUT');
    expect(inputElement.type).toBe(inputType);
    expect(inputElement.value).toBe(inputValue);
    expect(inputElement.classList.contains('input-class')).toBe(true);
  });
});

test('Should create a button element with specified text, classes and disabled attribute', () => {
  const text = 'Click me!';
  const disabled = true;

  const buttonCreator = new ElementButtonCreator({
    tag: 'button',
    text,
    disabled,
    classes: ['button-class'],
  });

  const buttonElement = buttonCreator.getElement();

  expect(buttonElement.tagName).toBe('BUTTON');
  expect(buttonElement.textContent).toBe(text);
  expect(buttonElement.disabled).toBe(disabled);
  expect(buttonElement.classList.contains('button-class')).toBe(true);
});

describe('Test class methods of ElementCreator', () => {
  test('Should add classes to the element', () => {
    const classesToAdd = ['class1', 'class2'];

    const elementCreator = new ElementCreator({
      tag: 'div',
      classes: ['initial-class'],
    });

    elementCreator.addClasses(classesToAdd);

    const element = elementCreator.getElement();

    expect(element.classList.contains('initial-class')).toBe(true);
    expect(element.classList.contains('class1')).toBe(true);
    expect(element.classList.contains('class2')).toBe(true);
  });

  test('Should set event handler on the element', () => {
    let eventHandled = false;

    const elementCreator = new ElementCreator({
      tag: 'button',
      text: 'Click me',
    });

    const clickHandler = (): void => {
      eventHandled = true;
    };

    elementCreator.setHandler('click', clickHandler);

    const element = elementCreator.getElement();

    const clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(clickEvent);

    expect(eventHandled).toBe(true);
  });
});
