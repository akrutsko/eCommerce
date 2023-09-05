import { Cart } from '../../app/components/cart/cart';

describe('Cart component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Cart is added to the DOM - getView', () => {
    const cart = new Cart();
    document.body.append(cart.getView().getElement());

    expect(document.querySelector('div')).toHaveTextContent('Cart');
  });
  test('Cart is added to the DOM - getElement', () => {
    const cart = new Cart();
    document.body.append(cart.getElement());

    expect(document.querySelector('div')).toHaveTextContent('Cart');
  });
});
