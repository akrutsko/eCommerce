import fetchMock from 'jest-fetch-mock';
import getProducts from '../app/utils/api/product';
import getProductTypes from '../app/utils/api/product-type';

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('Tests for getting products and products types', () => {
  test('Get 1 page of products', async () => {
    const products = await getProducts();
    expect(products.statusCode).toBe(200);
  });

  test('Get 1 page of product types', async () => {
    const productTypes = await getProductTypes();
    expect(productTypes.statusCode).toBe(200);
  });
});
