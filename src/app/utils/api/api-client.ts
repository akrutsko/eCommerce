import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  TokenCache,
  TokenStore,
} from '@commercetools/sdk-client-v2';

const projectKey = 'peakpulse';
const baseHost = 'https://api.europe-west1.gcp.commercetools.com/';
const authHost = 'https://auth.europe-west1.gcp.commercetools.com/';
const clientId = 'aSH1Qs-X58nIAdx6Dbrw-pvz';
const clientSecret = 'WgPk-nmbKj2DD1Dk9Aq4m_gFe_Lrv4WO';
const clientScope = [`manage_project:${projectKey}`];
const consumerId = 'oFz5OlFDYJvrPY74XbQ1xvnq';
const consumerSecret = 'vV_MccOwr49Df0ZvBit1_CNCcqxkciXw';
const consumerScope = [
  `view_cart_discounts:${projectKey}`,
  `view_categories:${projectKey}`,
  `view_discount_codes:${projectKey}`,
  `view_products:${projectKey}`,
  `view_types:${projectKey}`,
  `manage_my_orders:${projectKey}`,
  `manage_my_profile:${projectKey}`,
  `create_anonymous_token:${projectKey}`,
];

const httpOptions: HttpMiddlewareOptions = { host: baseHost, fetch };

let tokenStore: TokenStore;
const tokenCache: TokenCache = {
  get(): TokenStore {
    return tokenStore;
  },
  set(cache: TokenStore): void {
    tokenStore = cache;
  },
};

export function getCtpClient(): Client {
  const authOptions: AuthMiddlewareOptions = {
    host: authHost,
    projectKey,
    credentials: { clientId, clientSecret },
    scopes: clientScope,
    fetch,
  };

  return new ClientBuilder().withHttpMiddleware(httpOptions).withClientCredentialsFlow(authOptions).build();
}

export function getAnonymousClient(): Client {
  const anonymousOptions: AnonymousAuthMiddlewareOptions = {
    host: authHost,
    projectKey,
    credentials: { clientId: consumerId, clientSecret: consumerSecret },
    scopes: consumerScope,
    fetch,
  };

  return new ClientBuilder().withHttpMiddleware(httpOptions).withAnonymousSessionFlow(anonymousOptions).build();
}

export function getTokenClient(token: string): Client {
  const authorization = `Bearer ${token}`;

  return new ClientBuilder().withHttpMiddleware(httpOptions).withExistingTokenFlow(authorization, { force: true }).build();
}

export function getRefreshTokenClient(refreshToken: string): Client {
  const refreshOptions: RefreshAuthMiddlewareOptions = {
    host: authHost,
    projectKey,
    credentials: { clientId: consumerId, clientSecret: consumerSecret },
    refreshToken,
    tokenCache,
    fetch,
  };

  return new ClientBuilder().withHttpMiddleware(httpOptions).withRefreshTokenFlow(refreshOptions).build();
}

export function getPasswordClient(username: string, password: string): Client {
  const pwdOptions: PasswordAuthMiddlewareOptions = {
    host: authHost,
    projectKey,
    credentials: { clientId: consumerId, clientSecret: consumerSecret, user: { username, password } },
    scopes: consumerScope,
    tokenCache,
    fetch,
  };

  return new ClientBuilder().withHttpMiddleware(httpOptions).withPasswordFlow(pwdOptions).build();
}

export function getToken(): string {
  return tokenStore?.token || '';
}

export function getRefreshToken(): string {
  return tokenStore?.refreshToken || '';
}

export function getApiRoot(client: Client): ByProjectKeyRequestBuilder {
  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}

export function clearTokenStore(): void {
  tokenStore = { token: '', refreshToken: '', expirationTime: 0 };
}
