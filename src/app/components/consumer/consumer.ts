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
import { getConsumer } from '../../utils/api/api-consumer';
import { Token } from '../../enums/token';

export class Consumer implements Observable {
  observers: Observer[] = [];

  apiClient: Client;

  status: ConsumerClient;

  consumer: Customer | null = null;

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
      this.consumer = response.body;
      this.status = ConsumerClient.Consumer;
    }
    this.notify();
  }

  async updateConsumer(): Promise<void> {
    const response = await getConsumer(this.apiClient);
    if (response) {
      this.consumer = response.body;
    }
  }

  async logIn(username: string, password: string): Promise<void> {
    this.apiClient = getPasswordClient(username, password);
    this.consumer = (await getConsumer(this.apiClient)).body;
    localStorage.setItem(Token.Access, getToken());
    localStorage.setItem(Token.Refresh, getRefreshToken());
    this.status = ConsumerClient.Consumer;
    this.notify();
  }

  logOut(): void {
    localStorage.clear();
    this.status = ConsumerClient.CommerceTools;
    this.consumer = null;
    clearTokenStore();
    this.apiClient = getCtpClient();
    this.notify();
  }
}
