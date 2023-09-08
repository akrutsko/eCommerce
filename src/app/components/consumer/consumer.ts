import { Client } from '@commercetools/sdk-client-v2';
import { Cart, Customer } from '@commercetools/platform-sdk';
import {
  getPasswordClient,
  getToken,
  getTokenClient,
  clearTokenStore,
  getRefreshToken,
  getRefreshTokenClient,
  getAnonymousClient,
} from '../../utils/api/api-client';
import { ConsumerClient } from '../../enums/consumer-client';
import {
  addAddress,
  addBillingAddressId,
  addShippingAddressId,
  changeAddress,
  changeEmail,
  changePassword,
  changePersonal,
  getConsumer,
  login,
  removeAddress,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
} from '../../utils/api/api-consumer';
import { Token } from '../../enums/token';
import { addToCart, createCart, getActiveCart, updateQuantity } from '../../utils/api/api-cart';

export class Consumer implements Observable {
  observers: Observer[] = [];

  apiClient: Client;

  status: ConsumerClient;

  consumerData: Customer | null = null;

  cart: Cart | null = null;

  get isConsumer(): boolean {
    return this.status === ConsumerClient.Consumer;
  }

  constructor() {
    this.apiClient = getAnonymousClient();
    this.status = ConsumerClient.CommerceTools;
  }

  subscribe(observer: Observer): void {
    if (this.observers.includes(observer)) return;
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) return;
    this.observers.slice(index, 1);
  }

  notify(): void {
    this.observers.forEach((observer) => observer.update());
  }

  async init(): Promise<void> {
    let response;
    const token = localStorage.getItem(Token.Access);

    if (token) {
      this.apiClient = getTokenClient(token);
      try {
        response = await getConsumer(this.apiClient);
      } catch {
        localStorage.removeItem(Token.Access);
        const refreshToken = localStorage.getItem(Token.Refresh);

        if (refreshToken) {
          this.apiClient = getRefreshTokenClient(refreshToken);
          try {
            response = await getConsumer(this.apiClient);
            localStorage.setItem(Token.Access, getToken());
          } catch {
            localStorage.removeItem(Token.Refresh);
          }
        }
      }
    }

    if (response) {
      this.consumerData = response.body;
      this.status = ConsumerClient.Consumer;
    }

    if (this.isConsumer) {
      this.cart = (await getActiveCart(this.apiClient)).body;
    } else {
      this.cart = (await createCart(this.apiClient, { currency: 'USD' })).body;
    }

    // TODO: remove
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, '8ef892fb-cd1f-47e1-8a7f-c38c0ac57f27')).body;
    const lineItemId = this.cart.lineItems.filter((lineItem) => lineItem.productId === '8ef892fb-cd1f-47e1-8a7f-c38c0ac57f27')[0]
      .id;
    this.cart = (await updateQuantity(this.apiClient, this.cart.version, this.cart.id, lineItemId, 2)).body;
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, 'a632302c-d91d-499b-b680-6d29a1f22c19')).body;
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, '4dab7e57-080a-43a3-9fb3-a55d95b91c9d')).body;
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, '19328891-6cc1-46b2-9618-fa4404a06f24')).body;
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, '635e5297-6c5f-412b-831c-35d72f5f6c15')).body;
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, '8be62abc-213e-4907-85d0-8cb43c59d6da')).body;
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, '9715bf15-891c-497a-9135-efb2437f43f0')).body;
    this.cart = (await addToCart(this.apiClient, this.cart.version, this.cart.id, 'c57f7614-3912-4eaf-83c2-184d26b2df0b')).body;
    // TODO: remove

    this.notify();
  }

  async getConsumer(): Promise<Customer> {
    const customer = await getConsumer(this.apiClient);
    return customer.body;
  }

  async logIn(username: string, password: string): Promise<void> {
    await login(this.apiClient, { email: username, password });
    clearTokenStore();
    this.apiClient = getPasswordClient(username, password);
    this.consumerData = await this.getConsumer();
    localStorage.setItem(Token.Access, getToken());
    localStorage.setItem(Token.Refresh, getRefreshToken());
    this.status = ConsumerClient.Consumer;
    this.notify();
  }

  logOut(): void {
    localStorage.clear();
    this.status = ConsumerClient.CommerceTools;
    this.consumerData = null;
    clearTokenStore();
    this.apiClient = getAnonymousClient();
    this.notify();
  }

  async changeEmail(email: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await changeEmail(this.apiClient, this.consumerData.version, email)).body;
  }

  async changePersonal(firstName: string, lastName: string, dateOfBirth: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await changePersonal(this.apiClient, this.consumerData.version, firstName, lastName, dateOfBirth)).body;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await changePassword(this.apiClient, this.consumerData.version, currentPassword, newPassword)).body;
  }

  async addAddress(country: string, city: string, streetName: string, postalCode: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await addAddress(this.apiClient, this.consumerData.version, country, city, streetName, postalCode)).body;
  }

  async changeAddress(addressId: string, country: string, city: string, streetName: string, postalCode: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (
      await changeAddress(this.apiClient, this.consumerData.version, addressId, country, city, streetName, postalCode)
    ).body;
  }

  async removeAddress(addressId: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await removeAddress(this.apiClient, this.consumerData.version, addressId)).body;
  }

  async addShippingAddressId(addressId: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await addShippingAddressId(this.apiClient, this.consumerData.version, addressId)).body;
  }

  async setDefaultShippingAddress(addressId: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await setDefaultShippingAddress(this.apiClient, this.consumerData.version, addressId)).body;
  }

  async addBillingAddressId(addressId: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await addBillingAddressId(this.apiClient, this.consumerData.version, addressId)).body;
  }

  async setDefaultBillingAddress(addressId: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await setDefaultBillingAddress(this.apiClient, this.consumerData.version, addressId)).body;
  }
}
