import { Footer } from '../app/components/footer/footer';

describe('Footer component', () => {
  test('Footer is added to the DOM', () => {
    const footer = new Footer();
    document.body.append(footer.getElement());

    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
