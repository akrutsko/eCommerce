import { Client } from '@commercetools/sdk-client-v2';
import { ClientResponse, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function getProductProjections(client: Client): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
  return getApiRoot(client)
    .productProjections()
    .get({ queryArgs: { staged: true, limit: 9, offset: 0 } })
    .execute();
  // return [
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest?fuzzy=true',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get({ queryArgs: { fuzzy: true } }),
  //   },
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest?searchKeywords.locale=searchKeywords.locale',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get({
  //         queryArgs: { 'searchKeywords.locale': 'searchKeywords.locale' },
  //       }),
  //   },
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest?sort=sort',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get({ queryArgs: { sort: 'sort' } }),
  //   },
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest?limit=7',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get({ queryArgs: { limit: 7 } }),
  //   },
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest?offset=3',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get({ queryArgs: { offset: 3 } }),
  //   },
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest?withTotal=true',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get({ queryArgs: { withTotal: true } }),
  //   },
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest?staged=true',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get({ queryArgs: { staged: true } }),
  //   },
  //   {
  //     method: 'get',
  //     uri: '/test_projectKey/product-projections/suggest',
  //     request: apiRoot
  //       .withProjectKey({ projectKey: 'test_projectKey' })
  //       .productProjections()
  //       .suggest()
  //       .get(),
  //   },
  // ];
}
