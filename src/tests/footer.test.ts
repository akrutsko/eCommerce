import { Footer } from '../app/components/footer/footer';
import { Router } from '../app/router/router';

describe('Footer component', () => {
  test('Footer is added to the DOM', () => {
    const router = new Router();
    const footer = new Footer(router);
    document.body.append(footer.getElement());

    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
