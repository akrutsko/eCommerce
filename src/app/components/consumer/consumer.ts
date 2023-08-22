import { Client } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';
import { getCtpClient, getPasswordClient, getToken, getTokenClient, clearTokenStore } from '../../utils/api/api-client';
import { ConsumerClient } from '../../enums/consumer-client';
import { getConsumer } from '../../utils/api/api-consumer';

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
    const token = localStorage.getItem('ecomm-token');
    if (token) {
      this.apiClient = getTokenClient(token);
      await getConsumer(this.apiClient)
        .then((res) => {
          this.consumer = res.body;
          this.status = ConsumerClient.Consumer;
        })
        .catch(() => {});
    }
    this.notify();
  }

  async logIn(username: string, password: string): Promise<void> {
    this.apiClient = getPasswordClient(username, password);
    this.consumer = (await getConsumer(this.apiClient)).body;
    localStorage.setItem('ecomm-token', getToken());
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
