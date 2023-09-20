import 'jest-fetch-mock';
import { Goods } from '../../app/components/goods/goods';
import { Consumer } from '../../app/components/consumer/consumer';

const consumer = new Consumer();

describe('Goods component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Goods is added to the DOM - getView', async () => {
    const goods = new Goods(consumer);
    await goods.createView();
    document.body.append(goods.getElement());

    expect(document.querySelector('h2')).toBeInTheDocument();
  });
  test('Button is added to the DOM - getElement', async () => {
    const goods = new Goods(consumer);
    await goods.createView();
    document.body.append(goods.getElement());

    expect(document.querySelector('button')).toBeInTheDocument();
  });
});
