import { ClientResponse, Customer, CustomerDraft, CustomerSignInResult, CustomerUpdate } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import { getApiRoot } from './api-client';

export function createConsumer(client: Client, customer: CustomerDraft): Promise<ClientResponse<CustomerSignInResult>> {
  return getApiRoot(client).customers().post({ body: customer }).execute();
}

export function deleteConsumer(client: Client, id: string, version: number): Promise<ClientResponse<Customer>> {
  return getApiRoot(client).customers().withId({ ID: id }).delete({ queryArgs: { version } }).execute();
}

export function getConsumer(client: Client): Promise<ClientResponse<Customer>> {
  return getApiRoot(client).me().get().execute();
}

export function changePassword(
  client: Client,
  version: number,
  currentPassword: string,
  newPassword: string,
): Promise<ClientResponse<Customer>> {
  return getApiRoot(client).me().password().post({ body: { version, currentPassword, newPassword } }).execute();
}

export function updateConsumer(client: Client, id: string, customer: CustomerUpdate): Promise<ClientResponse<Customer>> {
  return getApiRoot(client).customers().withId({ ID: id }).post({ body: customer }).execute();
}
