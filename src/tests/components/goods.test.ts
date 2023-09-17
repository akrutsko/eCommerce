import { Goods } from '../../app/components/goods/goods';
import { Consumer } from '../../app/components/consumer/consumer';

const consumer = new Consumer();

describe('Goods component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Goods is added to the DOM - getView', () => {
    const goods = new Goods(consumer);
    document.body.append(goods.getView().getElement());

    expect(document.querySelector('div')).toHaveTextContent('Goods');
  });
  test('Cart is added to the DOM - getElement', () => {
    const cart = new Goods(consumer);
    document.body.append(cart.getElement());

    expect(document.querySelector('div')).toHaveTextContent('Goods');
  });
});
