import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

export const projectKey = 'peakpulse';
const baseHost = 'https://api.europe-west1.gcp.commercetools.com';
const authHost = 'https://auth.europe-west1.gcp.commercetools.com';
const clientId = 'BMrv0PEWYmDqlVSQmAso81HV';
const clientSecret = 'CDqe_LrMv8wt3men-OczcN5tCUBcNxse';
const scopes = [
  'view_products:peakpulse manage_my_payments:peakpulse manage_my_quote_requests:peakpulse manage_my_business_units:peakpulse manage_my_profile:peakpulse view_types:peakpulse manage_my_shopping_lists:peakpulse manage_my_quotes:peakpulse create_anonymous_token:peakpulse view_categories:peakpulse manage_my_orders:peakpulse view_published_products:peakpulse',
];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authHost,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: baseHost,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export default ctpClient;
