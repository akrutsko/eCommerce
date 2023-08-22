import 'jest-fetch-mock';
import { Cart } from '../app/components/cart/cart';

describe('Cart component', () => {
  test('Cart is added to the DOM', () => {
    const cart = new Cart();
    document.body.append(cart.getElement());

    expect(document.querySelector('div')).toHaveTextContent('Cart');
  });
});
