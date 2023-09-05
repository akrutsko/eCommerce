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
const clientScope = [`manage_project:${projectKey}`]; // TODO: set necessary scopes
const customerScope = [`manage_project:${projectKey}`]; // TODO: set necessary scopes
const anonScope = [`manage_project:${projectKey}`, `create_anonymous_token:${projectKey}`]; // TODO: set necessary scopes

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
    credentials: { clientId, clientSecret },
    scopes: anonScope,
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
    credentials: { clientId, clientSecret },
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
    credentials: { clientId, clientSecret, user: { username, password } },
    scopes: customerScope,
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
