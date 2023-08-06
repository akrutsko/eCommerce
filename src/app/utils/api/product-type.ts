import { ClientResponse, ProductTypePagedQueryResponse } from '@commercetools/platform-sdk';
import apiRoot from './api-root';

async function getProductTypes(): Promise<ClientResponse<ProductTypePagedQueryResponse>> {
  return apiRoot.productTypes().get().execute();
}

export default getProductTypes;
