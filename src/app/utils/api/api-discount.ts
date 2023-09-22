import { Client } from '@commercetools/sdk-client-v2';
import { ClientResponse, DiscountCode } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

export function getDiscountCode(client: Client, discountId: string): Promise<ClientResponse<DiscountCode>> {
  return getApiRoot(client).discountCodes().withId({ ID: discountId }).get().execute();
}
