import 'jest-fetch-mock';
import { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import { getCtpClient, getPasswordClient } from '../app/utils/api/api-client';
import { createConsumer, deleteConsumer, getConsumer } from '../app/utils/api/api-consumer';

describe('Tests for consumer API', () => {
  test('create a consumer', async () => {
    const shippingAddress: BaseAddress = { country: 'BY', city: 'Minsk', streetName: 'Street1', postalCode: '220000' };
    const billingAddress: BaseAddress = { country: 'PL', city: 'Warsaw', streetName: 'Street2', postalCode: '00-001' };
    const email = 'test@email.com';
    const password = 'password';
    const firstName = 'John';
    const lastName = 'Doe';
    const dateOfBirth = '2000-01-01';

    const consumerDraft: CustomerDraft = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses: [shippingAddress, billingAddress],
      shippingAddresses: [0],
      billingAddresses: [1],
      defaultShippingAddress: 0,
      defaultBillingAddress: 1,
    };

    await getConsumer(getPasswordClient(email, password))
      .then((res) => deleteConsumer(getPasswordClient(email, password), res.body.id, res.body.version))
      .catch(() => {});

    const consumerResponse = await createConsumer(getCtpClient(), consumerDraft);
    const customerData = consumerResponse.body.customer;

    expect(consumerResponse.statusCode).toBe(201);
    expect(customerData.email).toBe(email);
    expect(customerData.firstName).toBe(firstName);
    expect(customerData.lastName).toBe(lastName);
    expect(customerData.dateOfBirth).toBe(dateOfBirth);
    expect(customerData.addresses[0]).toEqual(expect.objectContaining(shippingAddress));
    expect(customerData.addresses[1]).toEqual(expect.objectContaining(billingAddress));
  });
});
