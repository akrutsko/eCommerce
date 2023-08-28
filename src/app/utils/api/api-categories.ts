import { Client } from '@commercetools/sdk-client-v2';
import { CategoryPagedQueryResponse, ClientResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function getCategories(client: Client): Promise<ClientResponse<CategoryPagedQueryResponse>> {
  return getApiRoot(client).categories().get().execute();
}
