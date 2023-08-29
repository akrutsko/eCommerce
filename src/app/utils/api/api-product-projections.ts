import { Client } from '@commercetools/sdk-client-v2';
import { ClientResponse, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function getProductProjections(client: Client): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
  return getApiRoot(client)
    .productProjections()
    .get({ queryArgs: { limit: 30, offset: 0 } })
    .execute();
}
