import { Absent } from '../app/components/absent/absent';
import { Router } from '../app/router/router';

describe('Absent component', () => {
  test('Absent is added to the DOM', () => {
    const router = new Router();
    const notFound = new Absent(router);
    document.body.append(notFound.getElement());

    expect(document.querySelector('div')).toBeInTheDocument();
  });
});
