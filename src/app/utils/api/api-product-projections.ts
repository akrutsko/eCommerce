import { Client } from '@commercetools/sdk-client-v2';
import { ClientResponse, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';
import { Store } from '../../enums/store';

export function getProductProjections(
  client: Client,
  filter?: string | string[],
): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
  return getApiRoot(client)
    .productProjections()
    .search()
    .get({ queryArgs: { limit: 30, offset: 0, filter, priceCountry: Store.Country, priceCurrency: Store.Currency } })
    .execute();
}
