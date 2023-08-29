import { Client } from '@commercetools/sdk-client-v2';
import { ClientResponse, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function getProductProjections(
  client: Client,
  filter?: string | string[],
  limit = 30,
  offset = 0,
): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
  return getApiRoot(client)
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit,
        offset,
        filter,
        markMatchingVariants: true,
      },
    })
    .execute();
}
