import { ClientResponse, Customer, CustomerDraft, CustomerSignInResult } from '@commercetools/platform-sdk';
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

export function changeEmail(client: Client, version: number, email: string): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({ body: { version, actions: [{ action: 'changeEmail', email }] } })
    .execute();
}

export function changePersonal(
  client: Client,
  version: number,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({
      body: {
        version,
        actions: [
          { action: 'setFirstName', firstName },
          { action: 'setLastName', lastName },
          { action: 'setDateOfBirth', dateOfBirth },
        ],
      },
    })
    .execute();
}

export function changePassword(
  client: Client,
  version: number,
  currentPassword: string,
  newPassword: string,
): Promise<ClientResponse<Customer>> {
  return getApiRoot(client).me().password().post({ body: { version, currentPassword, newPassword } }).execute();
}

export function addAddress(
  client: Client,
  version: number,
  country: string,
  city: string,
  streetName: string,
  postalCode: string,
): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({ body: { version, actions: [{ action: 'addAddress', address: { country, city, streetName, postalCode } }] } })
    .execute();
}

export function changeAddress(
  client: Client,
  version: number,
  addressId: string,
  country: string,
  city: string,
  streetName: string,
  postalCode: string,
): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({
      body: { version, actions: [{ action: 'changeAddress', addressId, address: { country, city, streetName, postalCode } }] },
    })
    .execute();
}

export function removeAddress(client: Client, version: number, addressId: string): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({ body: { version, actions: [{ action: 'removeAddress', addressId }] } })
    .execute();
}

export function addShippingAddressId(client: Client, version: number, addressId: string): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({ body: { version, actions: [{ action: 'addShippingAddressId', addressId }] } })
    .execute();
}

export function setDefaultShippingAddress(client: Client, version: number, addressId: string): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({ body: { version, actions: [{ action: 'setDefaultShippingAddress', addressId }] } })
    .execute();
}

export function addBillingAddressId(client: Client, version: number, addressId: string): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({ body: { version, actions: [{ action: 'addBillingAddressId', addressId }] } })
    .execute();
}

export function setDefaultBillingAddress(client: Client, version: number, addressId: string): Promise<ClientResponse<Customer>> {
  return getApiRoot(client)
    .me()
    .post({ body: { version, actions: [{ action: 'setDefaultBillingAddress', addressId }] } })
    .execute();
}
