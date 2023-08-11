import { Header } from '../app/components/header/header';

describe('Header component', () => {
  test('Header is added to the DOM', () => {
    const header = new Header();
    document.body.append(header.getElement());

    expect(document.querySelector('header')).toBeInTheDocument();
  });
});
