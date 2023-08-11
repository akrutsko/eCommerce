import { ElementAnchorCreator } from '../app/utils/element-creator/element-anchor-creator';
import { ElementButtonCreator } from '../app/utils/element-creator/element-button-creator';
import { ElementCreator } from '../app/utils/element-creator/element-creator';
import { ElementInputCreator } from '../app/utils/element-creator/element-input-creator';

describe('Test constuctors of ElementCreator', () => {
  test('Should create a div element with specified text, classes and id', () => {
    const tag = 'div';
    const text = 'Test text';
    const classes = 'div-class';
    const id = 'id';

    const div = new ElementCreator({ tag, text, classes, id }).getElement();

    expect(div.tagName).toBe(tag.toUpperCase());
    expect(div).toHaveTextContent(text);
    expect(div).toHaveClass(classes);
    expect(div).toHaveAttribute('id', id);
  });

  test('Should create an input element with specified type, value and placeholder', () => {
    const type = 'text';
    const value = 'Hello, Jest!';
    const placeholder = 'placeholder';

    const input = new ElementInputCreator({ type, value, placeholder }).getElement();

    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', type);
    expect(input).toHaveValue(value);
    expect(input).toHaveAttribute('placeholder', placeholder);
  });
});

test('Should create a button element with specified text and disabled attribute', () => {
  const text = 'Click me!';
  const disabled = true;

  const button = new ElementButtonCreator({ text, disabled }).getElement();

  expect(button.tagName).toBe('BUTTON');
  expect(button).toHaveTextContent(text);
  expect(button).toBeDisabled();
});

test('Should create a anchor element with specified href and innerHtml', () => {
  const href = '#';
  const html = 'link';

  const anchor = new ElementAnchorCreator({ href, html }).getElement();

  expect(anchor.tagName).toBe('A');
  expect(anchor).toHaveTextContent(html);
  expect(anchor).toHaveAttribute('href', href);
});

describe('Test class methods of ElementCreator', () => {
  test('Should add classes to the element', () => {
    const classesToAdd = ['class1', 'class2'];

    const elementCreator = new ElementCreator({ tag: 'div', classes: 'initial-class' });
    elementCreator.addClasses(classesToAdd);

    const element = elementCreator.getElement();

    expect(element).toHaveClass('initial-class', 'class1', 'class2');
  });

  test('Should set event handler on the element', () => {
    const clickHandler = jest.fn();

    const elementCreator = new ElementButtonCreator({});
    elementCreator.setHandler('click', clickHandler);
    elementCreator.getElement().click();

    expect(clickHandler).toHaveBeenCalled();
  });
});
