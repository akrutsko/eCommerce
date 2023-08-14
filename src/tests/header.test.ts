import 'jest-fetch-mock';
import { Consumer } from '../app/components/consumer/consumer';
import { Header } from '../app/components/header/header';

const consumer = new Consumer();

describe('Header component', () => {
  test('Header is added to the DOM', () => {
    const header = new Header(consumer);
    document.body.append(header.getElement());

    expect(document.querySelector('header')).toBeInTheDocument();
  });
});
