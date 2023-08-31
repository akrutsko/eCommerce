import { Client } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';
import {
  getCtpClient,
  getPasswordClient,
  getToken,
  getTokenClient,
  clearTokenStore,
  getRefreshToken,
  getRefreshTokenClient,
} from '../../utils/api/api-client';
import { ConsumerClient } from '../../enums/consumer-client';
import { changeEmail, changePassword, getConsumer } from '../../utils/api/api-consumer';
import { Token } from '../../enums/token';

export class Consumer implements Observable {
  observers: Observer[] = [];

  apiClient: Client;

  status: ConsumerClient;

  consumerData: Customer | null = null;

  get isConsumer(): boolean {
    return this.status === ConsumerClient.Consumer;
  }

  constructor() {
    this.apiClient = getCtpClient();
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
    this.notify();
  }

  async getConsumer(): Promise<Customer> {
    const customer = await getConsumer(this.apiClient);
    return customer.body;
  }

  async logIn(username: string, password: string): Promise<void> {
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
    this.apiClient = getCtpClient();
    this.notify();
  }

  async changeEmail(email: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await changeEmail(this.apiClient, this.consumerData.version, email)).body;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.consumerData) {
      this.consumerData = await this.getConsumer();
    }
    this.consumerData = (await changePassword(this.apiClient, this.consumerData.version, currentPassword, newPassword)).body;
  }
}
