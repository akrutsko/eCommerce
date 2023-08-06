import { ClientResponse, ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import apiRoot from './api-root';

async function getProducts(): Promise<ClientResponse<ProductPagedQueryResponse>> {
  try {
    const products = await apiRoot.products().get().execute();
    return products;
  } catch (error) {
    return error as ClientResponse<ProductPagedQueryResponse>;
  }
}

export default getProducts;
