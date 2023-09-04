import 'jest-fetch-mock';
import { Consumer } from '../../app/components/consumer/consumer';
import { Header } from '../../app/components/header/header';
import { Router } from '../../app/router/router';

const consumer = new Consumer();

describe('Header component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Header is added to the DOM', async () => {
    const router = new Router();
    const header = new Header(router, consumer);
    document.body.append(header.getElement());
    await header.createView();

    expect(document.querySelector('header')).toBeInTheDocument();
  });
});
