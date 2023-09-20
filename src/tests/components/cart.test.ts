import 'jest-fetch-mock';
import { Cart } from '../../app/components/cart/cart';
import { Consumer } from '../../app/components/consumer/consumer';

const consumer = new Consumer();

describe('Cart component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Cart is added to the DOM - getView', () => {
    const cart = new Cart(consumer);
    document.body.append(cart.getView().getElement());

    expect(document.querySelector('div.h4')).toBeInTheDocument();
  });
  test('Cart is added to the DOM - getElement', () => {
    const cart = new Cart(consumer);
    document.body.append(cart.getElement());

    expect(document.querySelector('div.h4')).toBeInTheDocument();
  });
});
