import 'jest-fetch-mock';
import { Cart, CartDraft } from '@commercetools/platform-sdk';
import {
  addToCart,
  createCart,
  deleteCart,
  getActiveCart,
  getCartById,
  removeFromCart,
  updateQuantity,
} from '../../../app/utils/api/api-cart';
import { Consumer } from '../../../app/components/consumer/consumer';

let consumer: Consumer;
let consumerCart: Cart;

describe('Tests for anonymous cart API', () => {
  beforeAll(async () => {
    consumer = new Consumer();
  });

  test('Create a cart', async () => {
    const cartDraft: CartDraft = { currency: 'USD' };
    const cartResponse = await createCart(consumer.apiClient, cartDraft);
    consumerCart = cartResponse.body;

    expect(cartResponse.statusCode).toBe(201);
  });

  test('add a product to the cart', async () => {
    const cartResponse = await addToCart(
      consumer.apiClient,
      consumerCart.version,
      consumerCart.id,
      '8ef892fb-cd1f-47e1-8a7f-c38c0ac57f27',
    );
    consumerCart = cartResponse.body;

    expect(cartResponse.statusCode).toBe(200);
  });

  test('Get an active cart', async () => {
    await consumer.logIn('login@test.com', 'Password1');

    const cartResponse = await getActiveCart(consumer.apiClient);
    const activeCart = cartResponse.body;

    expect(cartResponse.statusCode).toBe(200);
    expect(activeCart.lineItems.length).toBe(1);
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
    const cartResponse = await deleteCart(consumer.apiClient, consumerCart.version, consumerCart.id);

    expect(cartResponse.statusCode).toBe(200);
  });
});

describe('Tests for manage products in cart API', () => {
  beforeAll(async () => {
    consumer = new Consumer();
    await consumer.logIn('login@test.com', 'Password1');
    consumerCart = (await getActiveCart(consumer.apiClient)).body;
  });

  test('add a product to the cart', async () => {
    const cartResponse = await addToCart(
      consumer.apiClient,
      consumerCart.version,
      consumerCart.id,
      '8ef892fb-cd1f-47e1-8a7f-c38c0ac57f27',
    );
    consumerCart = cartResponse.body;
    expect(cartResponse.statusCode).toBe(200);
  });

  test('update product quantity in the cart', async () => {
    const lineItemId = consumerCart.lineItems.filter(
      (lineItem) => lineItem.productId === '8ef892fb-cd1f-47e1-8a7f-c38c0ac57f27',
    )[0].id;

    const cartResponse = await updateQuantity(consumer.apiClient, consumerCart.version, consumerCart.id, lineItemId, 10);
    consumerCart = cartResponse.body;
    expect(cartResponse.statusCode).toBe(200);
  });

  test('remove a product from the cart', async () => {
    const lineItemId = consumerCart.lineItems.filter(
      (lineItem) => lineItem.productId === '8ef892fb-cd1f-47e1-8a7f-c38c0ac57f27',
    )[0].id;

    const cartResponse = await removeFromCart(consumer.apiClient, consumerCart.version, consumerCart.id, lineItemId);
    consumerCart = cartResponse.body;
    expect(cartResponse.statusCode).toBe(200);
  });
});
