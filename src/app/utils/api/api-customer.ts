import { ClientResponse, Customer, CustomerSignInResult, MyCustomerDraft } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import { getApiRoot } from './api-client';

export function createCustomer(client: Client, customer: MyCustomerDraft): Promise<ClientResponse<CustomerSignInResult>> {
  return getApiRoot(client).me().signup().post({ body: customer }).execute();
}

export function deleteCustomer(client: Client, id: string, version: number): Promise<ClientResponse<Customer>> {
  return getApiRoot(client).customers().withId({ ID: id }).delete({ queryArgs: { version } }).execute();
}

export function getCustomer(client: Client): Promise<ClientResponse<Customer>> {
  return getApiRoot(client).me().get().execute();
}
