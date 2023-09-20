import 'jest-fetch-mock';
import { Catalog } from '../../app/components/catalog/catalog';
import { Consumer } from '../../app/components/consumer/consumer';
import { Router } from '../../app/router/router';

const consumer = new Consumer();
describe('Catalog component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Catalog is added to the DOM - getView', async () => {
    const router = new Router();
    const catalog = new Catalog(router, consumer);
    await catalog.createView();
    document.body.append(catalog.getView().getElement());

    expect(document.querySelector('h4')).toHaveTextContent('Categories');
    expect(document.querySelector('h2')).toHaveTextContent('Catalog');
  });

  test('Catalog is added to the DOM - getElement', async () => {
    const router = new Router();
    const catalog = new Catalog(router, consumer);
    await catalog.createView();
    document.body.append(catalog.getElement());

    expect(document.querySelector('h4')).toHaveTextContent('Categories');
  });
});
