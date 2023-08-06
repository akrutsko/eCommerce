import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

export const projectKey = 'peakpulse';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: 'BMrv0PEWYmDqlVSQmAso81HV',
    clientSecret: 'CDqe_LrMv8wt3men-OczcN5tCUBcNxse',
  },
  scopes: [
    'view_products:peakpulse manage_my_payments:peakpulse manage_my_quote_requests:peakpulse manage_my_business_units:peakpulse manage_my_profile:peakpulse view_types:peakpulse manage_my_shopping_lists:peakpulse manage_my_quotes:peakpulse create_anonymous_token:peakpulse view_categories:peakpulse manage_my_orders:peakpulse view_published_products:peakpulse',
  ],
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export default ctpClient;
