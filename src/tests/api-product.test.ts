import 'jest-fetch-mock';
import { getCtpClient } from '../app/utils/api/api-client';
import { getProduct, getProductProjection } from '../app/utils/api/api-product';

describe('Tests for product API', () => {
  test('Get a product', async () => {
    const productWithId = await getProduct(getCtpClient(), 'c43011cc-de74-406f-b68e-02c0441bcdb1');

    expect(productWithId.statusCode).toBe(200);
  });

  test('Get a product projection', async () => {
    const productWithId = await getProductProjection(getCtpClient(), 'c43011cc-de74-406f-b68e-02c0441bcdb1');

    expect(productWithId.statusCode).toBe(200);
  });
});
