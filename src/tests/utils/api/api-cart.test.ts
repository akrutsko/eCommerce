/* eslint-disable jest/no-disabled-tests */
import 'jest-fetch-mock';
import { Cart, CartDraft } from '@commercetools/platform-sdk';
import { createCart, deleteCart, getActiveCart, getCartById } from '../../../app/utils/api/api-cart';
import { Consumer } from '../../../app/components/consumer/consumer';

let consumer: Consumer;
let consumerCart: Cart;

describe.skip('Tests for anonymous cart API', () => {
  beforeAll(async () => {
    consumer = new Consumer();
  });

  test('Create a cart', async () => {
    const cartDraft: CartDraft = { currency: 'USD' };
    const cartResponse = await createCart(consumer.apiClient, cartDraft);
    consumerCart = cartResponse.body;

    expect(cartResponse.statusCode).toBe(201);
  });

  test('Get an active cart', async () => {
    await consumer.logIn('login@test.com', 'Password1');
    const cartResponse = await getActiveCart(consumer.apiClient);

    expect(cartResponse.statusCode).toBe(200);
  });
});

describe('Tests for consumer cart API', () => {
  beforeAll(async () => {
    consumer = new Consumer();
    await consumer.logIn('login@test.com', 'Password1');
  });

  test('Create a cart', async () => {
    const cartDraft: CartDraft = { currency: 'USD', customerId: consumer.consumerData?.id };
    const cartResponse = await createCart(consumer.apiClient, cartDraft);
    consumerCart = cartResponse.body;

    expect(cartResponse.statusCode).toBe(201);
  });

  test('Get an active cart', async () => {
    const cartResponse = await getActiveCart(consumer.apiClient);
    const activeCart = cartResponse.body;

    expect(cartResponse.statusCode).toBe(200);
    expect(activeCart).toEqual(expect.objectContaining(consumerCart));
  });

  test('Get a consumer cart', async () => {
    const cartResponse = await getCartById(consumer.apiClient, consumerCart.id);
    const currentCart = cartResponse.body;

    expect(cartResponse.statusCode).toBe(200);
    expect(currentCart).toEqual(expect.objectContaining(consumerCart));
  });

  test('Delete the consumer cart', async () => {
    // console.log('customer cart before delete: ', (await getActiveCart(consumer.apiClient)).body.id);
    const cartResponse = await deleteCart(consumer.apiClient, consumerCart.version, consumerCart.id);
    // console.log('customer cartafter delete: ', (await getActiveCart(consumer.apiClient)).body.id);

    expect(cartResponse.statusCode).toBe(200);
  });
});
