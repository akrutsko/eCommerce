import {
  ClientResponse,
  Product,
  ProductPagedQueryResponse,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductTypePagedQueryResponse,
} from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import { getApiRoot } from './api-client';
import { Store } from '../../enums/store';

export function getProducts(client: Client): Promise<ClientResponse<ProductPagedQueryResponse>> {
  return getApiRoot(client).products().get().execute();
}

export function getProductTypes(client: Client): Promise<ClientResponse<ProductTypePagedQueryResponse>> {
  return getApiRoot(client).productTypes().get().execute();
}

export function getProduct(client: Client, id: string): Promise<ClientResponse<Product>> {
  return getApiRoot(client).products().withId({ ID: id }).get().execute();
}

export function getProductProjection(client: Client, id: string): Promise<ClientResponse<ProductProjection>> {
  return getApiRoot(client).productProjections().withId({ ID: id }).get().execute();
}

export function getProductIdBySlug(client: Client, slug: string): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
  return getApiRoot(client)
    .productProjections()
    .get({ queryArgs: { where: `slug(${Store.Language}="${slug}")` } })
    .execute();
}
