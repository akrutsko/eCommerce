import { ClientResponse, ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import apiRoot from './api-root';

async function getProducts(): Promise<ClientResponse<ProductPagedQueryResponse>> {
  return apiRoot.products().get().execute();
}

export default getProducts;
