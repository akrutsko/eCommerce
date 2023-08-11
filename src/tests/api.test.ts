import fetchMock from 'jest-fetch-mock';
import { getProductTypes, getProducts } from '../app/utils/api/api-product';
import { getCtpClient } from '../app/utils/api/api-client';

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('Tests for getting products and products types', () => {
  test('Get 1 page of products', async () => {
    const products = await getProducts(getCtpClient());
    expect(products.statusCode).toBe(200);
  });

  test('Get 1 page of product types', async () => {
    const productTypes = await getProductTypes(getCtpClient());
    expect(productTypes.statusCode).toBe(200);
  });
});
