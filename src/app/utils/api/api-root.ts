import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ctpClient, projectKey } from './ctp-client';

const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey(
  { projectKey },
);

export default apiRoot;
