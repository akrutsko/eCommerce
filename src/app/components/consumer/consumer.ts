import { Client } from '@commercetools/sdk-client-v2';
import { getCtpClient, getPasswordClient, getToken, getTokenClient } from '../../utils/api/api-client';
import { ConsumerClient } from '../../enums/consumer-client';
import { getConsumer } from '../../utils/api/api-consumer';

export class Consumer {
  apiClient: Client;

  status: ConsumerClient;

  get isConsumer(): boolean {
    return this.status === ConsumerClient.Consumer;
  }

  constructor() {
    this.apiClient = getCtpClient();
    this.status = ConsumerClient.CommerceTools;
  }

  async init(): Promise<void> {
    const token = localStorage.getItem('ecomm-token');
    if (!token) return;

    this.apiClient = getTokenClient(token);
    await getConsumer(this.apiClient);
    this.status = ConsumerClient.Consumer;
  }

  async logIn(username: string, password: string): Promise<void> {
    this.apiClient = getPasswordClient(username, password);
    await getConsumer(this.apiClient);
    localStorage.setItem('ecomm-token', getToken());
    this.status = ConsumerClient.Consumer;
  }

  logOut(): void {
    localStorage.clear();
    this.status = ConsumerClient.CommerceTools;
    this.apiClient = getCtpClient();
  }
}
