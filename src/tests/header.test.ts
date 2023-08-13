import { Header } from '../app/components/header/header';
import { Router } from '../app/router/router';

describe('Header component', () => {
  test('Header is added to the DOM', () => {
    const router = new Router();
    const header = new Header(router);
    document.body.append(header.getElement());

    expect(document.querySelector('header')).toBeInTheDocument();
  });
});
