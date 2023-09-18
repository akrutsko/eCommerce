import 'jest-fetch-mock';

import { Consumer } from '../../app/components/consumer/consumer';
import { Router } from '../../app/router/router';
import { Main } from '../../app/components/main/main';

const router = new Router();
const consumer = new Consumer();

describe('Main component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Main is added to the DOM - getView', () => {
    const main = new Main(router, consumer);
    document.body.append(main.getView());

    expect(document.querySelector('main')).toBeInTheDocument();
  });

  test('Contact is added to Main', async () => {
    const main = new Main(router, consumer);
    document.body.append(main.getView());
    await main.showContact();

    expect(document.querySelector('div')).toHaveTextContent('Contact');
  });
  test('Cart is added to Main', async () => {
    const main = new Main(router, consumer);
    document.body.append(main.getView());
    await main.showCart();

    expect(document.querySelector('.container')).toBeInTheDocument();
  });
});
