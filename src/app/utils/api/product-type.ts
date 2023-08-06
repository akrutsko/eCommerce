import { ClientResponse, ProductTypePagedQueryResponse } from '@commercetools/platform-sdk';
import apiRoot from './api-root';

async function getProductTypes(): Promise<ClientResponse<ProductTypePagedQueryResponse>> {
  try {
    const productTypes = await apiRoot.productTypes().get().execute();
    return productTypes;
  } catch (error) {
    return error as Promise<ClientResponse<ProductTypePagedQueryResponse>>;
  }
}

export default getProductTypes;
