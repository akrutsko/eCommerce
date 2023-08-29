import { Client } from '@commercetools/sdk-client-v2';
import { ClientResponse, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function getProductProjections(
  client: Client,
  filter?: string,
): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
  return getApiRoot(client)
    .productProjections()
    .search()
    .get({ queryArgs: { limit: 30, offset: 0, filter } })
    .execute();
}
