import { Client } from '@commercetools/sdk-client-v2';
import { Cart, CartDraft, ClientResponse } from '@commercetools/platform-sdk';
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
