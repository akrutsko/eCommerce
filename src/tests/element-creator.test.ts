import { ElementAnchorCreator } from '../app/utils/element-creator/element-anchor-creator';
import { ElementButtonCreator } from '../app/utils/element-creator/element-button-creator';
import { ElementCreator } from '../app/utils/element-creator/element-creator';
import { ElementDialogCreator } from '../app/utils/element-creator/element-dialog-creator';
import { ElementImageCreator } from '../app/utils/element-creator/element-image-creator';
import { ElementInputCreator } from '../app/utils/element-creator/element-input-creator';
import { ElementOptionCreator } from '../app/utils/element-creator/element-option-creator';
import { ElementSelectCreator } from '../app/utils/element-creator/element-selector-creator';

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

  test('Should create a button element with specified text and disabled attribute', () => {
    const text = 'Click me!';
    const disabled = true;

    const button = new ElementButtonCreator({ text, disabled }).getElement();

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveTextContent(text);
    expect(button).toBeDisabled();
  });

  test('Should create an anchor element with specified href and innerHtml', () => {
    const href = '#';
    const html = 'link';

    const anchor = new ElementAnchorCreator({ href, html }).getElement();

    expect(anchor.tagName).toBe('A');
    expect(anchor).toHaveTextContent(html);
    expect(anchor).toHaveAttribute('href', href);
  });

  test('Should create an image element with specified src and alt', () => {
    const src = 'http://example.com';
    const alt = 'image';

    const image = new ElementImageCreator({ src, alt }).getElement();

    expect(image.tagName).toBe('IMG');
    expect(image).toHaveAttribute('src', src);
    expect(image).toHaveAttribute('alt', alt);
  });

  test('Should create a dialog element', () => {
    const dialog = new ElementDialogCreator({}).getElement();

    expect(dialog.tagName).toBe('DIALOG');
  });

  test('Should create a select element', () => {
    const dialog = new ElementDialogCreator({}).getElement();

    expect(dialog.tagName).toBe('DIALOG');
  });

  test('Should create a select element with disabled attribute', () => {
    const disabled = true;

    const select = new ElementSelectCreator({ disabled }).getElement();

    expect(select.tagName).toBe('SELECT');
    expect(select).toBeDisabled();
  });

  test('Should create an option element with value and hidden attribute', () => {
    const value = 'id';
    const hidden = true;

    const option = new ElementOptionCreator({ value, hidden }).getElement();

    expect(option.tagName).toBe('OPTION');
    expect(option).toHaveAttribute('hidden');
    expect(option).toHaveValue(value);
  });
});

describe('Test class methods of ElementCreator', () => {
  test('Should add class to the element', () => {
    const elementCreator = new ElementCreator({ tag: 'div', classes: 'initial-class' });
    elementCreator.addClass('added-class');

    const element = elementCreator.getElement();

    expect(element).toHaveClass('initial-class', 'added-class');
  });

  test('Should remove class from the element', () => {
    const elementCreator = new ElementCreator({ tag: 'div', classes: 'initial-class class-to-remove' });
    elementCreator.removeClass('class-to-remove');

    const element = elementCreator.getElement();

    expect(element).toHaveClass('initial-class');
    expect(element).not.toHaveClass('class-to-remove');
  });

  test('Should toggle class on the element', () => {
    const elementCreator = new ElementCreator({ tag: 'div', classes: 'class-to-toggle' });
    const element = elementCreator.getElement();

    elementCreator.toggleClass('class-to-toggle');
    expect(element).not.toHaveClass('class-to-remove');

    elementCreator.toggleClass('class-to-toggle');
    expect(element).toHaveClass('class-to-toggle');
  });

  test('Should set event handler on the element', () => {
    const clickHandler = jest.fn();

    const elementCreator = new ElementButtonCreator({});
    elementCreator.setHandler('click', clickHandler);
    elementCreator.getElement().click();

    expect(clickHandler).toHaveBeenCalled();
  });

  test('Should append an element', () => {
    const div = new ElementCreator({ tag: 'div' });
    const p = new ElementCreator({ tag: 'p' });
    div.appendNode(p);
    document.body.append(div.getElement());

    expect(document.querySelector('p')).toBeInTheDocument();
  });
});
