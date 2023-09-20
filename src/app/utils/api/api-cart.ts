import { Client } from '@commercetools/sdk-client-v2';
import { Cart, CartDraft, ClientResponse, DiscountCodeReference } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function getCartById(client: Client, cartId: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).carts().withId({ ID: cartId }).get().execute();
}

export function getCartByCustomerId(client: Client, customerId: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).carts().withCustomerId({ customerId }).get().execute();
}

export function deleteCart(client: Client, cartId: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).carts().withCustomerId({ customerId: cartId }).get().execute();
}

export function createMyCart(client: Client, cart: CartDraft): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).me().carts().post({ body: cart }).execute();
}

export function getMyActiveCart(client: Client): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).me().activeCart().get().execute();
}

export function getMyCartById(client: Client, id: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).me().carts().withId({ ID: id }).get().execute();
}

export function deleteMyCart(client: Client, version: number, id: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client).me().carts().withId({ ID: id }).delete({ queryArgs: { version } }).execute();
}

export function addToMyCart(client: Client, version: number, cartId: string, productId: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client)
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions: [{ action: 'addLineItem', productId }] } })
    .execute();
}

export function removeFromMyCart(
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

export function updateMyCartQuantity(
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

export function addMyCartDiscount(client: Client, version: number, cartId: string, code: string): Promise<ClientResponse<Cart>> {
  return getApiRoot(client)
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions: [{ action: 'addDiscountCode', code }] } })
    .execute();
}

export function removeMyCartDiscount(
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
