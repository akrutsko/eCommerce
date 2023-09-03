import { Client } from '@commercetools/sdk-client-v2';
import { CategoryPagedQueryResponse, ClientResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';

import { Message } from '../message/toastify-message';
import { Category } from '../../interfaces/category';
import { Store } from '../../enums/store';

export function getCategories(
  client: Client,
  where?: string[],
  expand?: string[],
): Promise<ClientResponse<CategoryPagedQueryResponse>> {
  return getApiRoot(client)
    .categories()
    .get({
      queryArgs: {
        where,
        expand,
      },
    })
    .execute();
}

export async function getTreeOfCategoris(
  client: Client,
  where?: string[],
  expand?: string[],
): Promise<Category[]> {
  const categoriesResponse = await getCategories(client, where, expand).catch(() => {
    new Message('Something went wrong. Try later.', 'error').showMessage();
  });
  if (!categoriesResponse) return [];
  const categoriesFromApi = categoriesResponse.body.results;
  const categories: Category[] = [];
  categoriesFromApi.forEach((category) => {
    if (!category.parent) {
      categories.push({
        id: category.id,
        name: category.name[Store.Language],
        slug: category.slug[Store.Language],
        children: [],
      });
    }
  });
  categoriesFromApi.forEach((category) => {
    const parentCategory = category.parent;
    if (parentCategory) {
      const currentCategory: Category = {
        id: category.id,
        name: category.name[Store.Language],
        slug: category.slug[Store.Language],
      };
      const parent = categories.find((element) => element.id === parentCategory.id);
      if (parent) {
        currentCategory.parent = parent;
        parent.children?.push(currentCategory);
      }
    }
  });
  return categories;
}
