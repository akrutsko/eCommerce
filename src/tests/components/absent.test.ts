import { Absent } from '../../app/components/absent/absent';
import { Router } from '../../app/router/router';

describe('Absent component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Absent is added to the DOM - getView', () => {
    const router = new Router();
    const notFound = new Absent(router);
    document.body.append(notFound.getView().getElement());

    expect(document.querySelector('h3')).toHaveTextContent('Route 404');
  });

  test('Absent is added to the DOM - getElement', () => {
    const router = new Router();
    const notFound = new Absent(router);
    document.body.append(notFound.getElement());

    expect(document.querySelector('h3')).toHaveTextContent('Route 404');
  });
});
