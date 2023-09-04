import { Goods } from '../../app/components/goods/goods';

describe('Goods component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Goods is added to the DOM - getView', () => {
    const goods = new Goods();
    document.body.append(goods.getView().getElement());

    expect(document.querySelector('div')).toHaveTextContent('Goods');
  });
  test('Cart is added to the DOM - getElement', () => {
    const cart = new Goods();
    document.body.append(cart.getElement());

    expect(document.querySelector('div')).toHaveTextContent('Goods');
  });
});
