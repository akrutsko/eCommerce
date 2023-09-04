import { Contact } from '../../app/components/contact/contact';

describe('Contact component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Contact is added to the DOM - getView', () => {
    const contact = new Contact();
    document.body.append(contact.getView().getElement());

    expect(document.querySelector('div')).toHaveTextContent('Contact');
  });
  test('Cart is added to the DOM - getElement', () => {
    const cart = new Contact();
    document.body.append(cart.getElement());

    expect(document.querySelector('div')).toHaveTextContent('Contact');
  });
});
