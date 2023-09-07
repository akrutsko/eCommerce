import { Client } from '@commercetools/sdk-client-v2';
import { Cart, CartDraft, ClientResponse, DiscountCodeReference } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function createCart(client: Client, cart: CartDraft): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).carts().post({ body: cart }).execute();
}

export function getActiveCart(client: Client): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).me().activeCart().get().execute();
}

export function getCartById(client: Client, id: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).me().carts().withId({ ID: id }).get().execute();
}

export function deleteCart(client: Client, version: number, id: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).me().carts().withId({ ID: id }).delete({ queryArgs: { version } }).execute();
}

export function addToCart(client: Client, version: number, cartId: string, productId: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client)
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions: [{ action: 'addLineItem', productId }] } })
    .execute();
}

export function removeFromCart(
  client: Client,
  version: number,
  cartId: string,
  lineItemId: string,
): Promise<ClientResponse<Cart>> {
  return getApiRoot(client)
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions: [{ action: 'removeLineItem', lineItemId }] } })
    .execute();
}

export function updateQuantity(
  client: Client,
  version: number,
  cartId: string,
  lineItemId: string,
  quantity: number,
): Promise<ClientResponse<Cart>> {
  return getApiRoot(client)
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }] } })
    .execute();
}

export function addDiscount(client: Client, version: number, cartId: string, code: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client)
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions: [{ action: 'addDiscountCode', code }] } })
    .execute();
}

export function removeDiscount(
  client: Client,
  version: number,
  cartId: string,
  discountCode: DiscountCodeReference,
): Promise<ClientResponse<Cart>> {
  return getApiRoot(client)
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions: [{ action: 'removeDiscountCode', discountCode }] } })
    .execute();
}
