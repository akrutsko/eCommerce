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
  getAccessToken,
  introspectToken,
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
import { getMyActiveCart } from '../../utils/api/api-cart';

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
    this.status = ConsumerClient.Anonymous;
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
    const accessToken = localStorage.getItem(Token.Access);

    if (accessToken) {
      this.apiClient = getTokenClient(accessToken);
      try {
        response = await getConsumer(this.apiClient);
        await this.getCart();
      } catch {
        localStorage.removeItem(Token.Access);
        const refreshToken = localStorage.getItem(Token.Refresh);

        if (refreshToken) {
          this.apiClient = getRefreshTokenClient(refreshToken);
          try {
            response = await getConsumer(this.apiClient);
            await this.getCart();
            localStorage.setItem(Token.Access, getToken());
          } catch {
            localStorage.removeItem(Token.Refresh);
            this.apiClient = getAnonymousClient();
          }
        }
      }
    }

    if (response) {
      this.consumerData = response.body;
      this.status = ConsumerClient.Consumer;
      localStorage.removeItem(Token.Anonymous);
      this.notify();
      return;
    }

    const anonymousToken = localStorage.getItem(Token.Anonymous);
    if (anonymousToken) {
      try {
        const accessTokenResponse = await introspectToken(anonymousToken);
        if ('active' in accessTokenResponse && accessTokenResponse.active === true) {
          this.apiClient = getTokenClient(anonymousToken);
          await this.getCart();
          this.notify();
          return;
        }
        throw new Error();
      } catch {
        localStorage.removeItem(Token.Anonymous);
      }
    }

    await this.getAccessToken();
    this.notify();
  }

  async getConsumer(): Promise<Customer> {
    const customer = await getConsumer(this.apiClient);
    return customer.body;
  }

  async getCart(): Promise<void> {
    try {
      this.cart = (await getMyActiveCart(this.apiClient)).body;
    } catch {
      this.cart = null;
    }
  }

  async getAccessToken(): Promise<void> {
    await getAccessToken()
      .then((res) => {
        if ('access_token' in res) {
          localStorage.setItem(Token.Anonymous, String(res.access_token));
          this.apiClient = getTokenClient(String(res.access_token));
        }
      })
      .catch(() => {});
  }

  async logIn(username: string, password: string): Promise<void> {
    await login(this.apiClient, { email: username, password });
    clearTokenStore();
    this.apiClient = getPasswordClient(username, password);
    this.consumerData = await this.getConsumer();
    await this.getCart();
    localStorage.setItem(Token.Access, getToken());
    localStorage.setItem(Token.Refresh, getRefreshToken());
    this.status = ConsumerClient.Consumer;
    this.notify();
  }

  async logOut(): Promise<void> {
    localStorage.clear();
    this.status = ConsumerClient.Anonymous;
    this.consumerData = null;
    this.cart = null;
    clearTokenStore();
    this.apiClient = getAnonymousClient();
    await this.getAccessToken();
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
