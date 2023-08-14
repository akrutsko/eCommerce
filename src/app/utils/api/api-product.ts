import { ClientResponse, ProductPagedQueryResponse, ProductTypePagedQueryResponse } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import { getApiRoot } from './api-client';

export function getProducts(client: Client): Promise<ClientResponse<ProductPagedQueryResponse>> {
  return getApiRoot(client).products().get().execute();
}

export function getProductTypes(client: Client): Promise<ClientResponse<ProductTypePagedQueryResponse>> {
  return getApiRoot(client).productTypes().get().execute();
}
