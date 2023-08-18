import 'jest-fetch-mock';
import { Consumer } from '../app/components/consumer/consumer';
import { Header } from '../app/components/header/header';
import { Router } from '../app/router/router';

const consumer = new Consumer();

describe('Header component', () => {
  test('Header is added to the DOM', () => {
    const router = new Router();
    const header = new Header(router, consumer);
    document.body.append(header.getElement());

    expect(document.querySelector('header')).toBeInTheDocument();
  });
});
