import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import ctpClient, { projectKey } from './ctp-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey(
  { projectKey },
);

export default apiRoot;
