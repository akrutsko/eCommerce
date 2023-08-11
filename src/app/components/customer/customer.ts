import { Client } from '@commercetools/sdk-client-v2';
import { getCtpClient, getPasswordClient, getToken, getTokenClient } from '../../utils/api/api-client';
import { getCustomer } from '../../utils/api/api-customer';
import { CustomerClient } from '../../enums/customer-client';

export class Customer {
  apiClient: Client;

  status: CustomerClient;

  get isRegistered(): boolean {
    return this.status === CustomerClient.Customer;
  }

  constructor() {
    this.apiClient = getCtpClient();
    this.status = CustomerClient.CommerceTools;
    this.init();
  }

  async init(): Promise<void> {
    const token = localStorage.getItem('ecomm-token');
    if (!token) return;

    try {
      this.apiClient = getTokenClient(token);
      await getCustomer(this.apiClient);
      this.status = CustomerClient.Customer;
    } catch {
      localStorage.clear();
    }
  }

  async logIn(username: string, password: string): Promise<void> {
    try {
      this.apiClient = getPasswordClient(username, password);
      await getCustomer(this.apiClient);
      localStorage.setItem('ecomm-token', getToken());
      this.status = CustomerClient.Customer;
    } catch (err) {
      // TODO: update flow when login error
      console.log('Log in error:', err);
    }
  }

  logOut(): void {
    localStorage.clear();
    this.status = CustomerClient.CommerceTools;
    this.apiClient = getCtpClient();
  }
}
