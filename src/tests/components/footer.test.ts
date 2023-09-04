import { Footer } from '../../app/components/footer/footer';
import { Router } from '../../app/router/router';

describe('Footer component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Footer is added to the DOM - getView', () => {
    const router = new Router();
    const footer = new Footer(router);
    document.body.append(footer.getView().getElement());

    expect(document.querySelector('footer')).toBeInTheDocument();
  });
  test('Footer is added to the DOM - getElement', () => {
    const router = new Router();
    const footer = new Footer(router);
    document.body.append(footer.getElement());

    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
