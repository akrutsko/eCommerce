import { Client } from '@commercetools/sdk-client-v2';
import { CategoryPagedQueryResponse, ClientResponse } from '@commercetools/platform-sdk';
import { getApiRoot } from './api-client';
import { Category } from '../../interfaces/category';
import { Store } from '../../enums/store';

export function getCategories(
  client: Client,

): Promise<ClientResponse<CategoryPagedQueryResponse>> {
  return getApiRoot(client)
    .categories()
    .get()
    .execute();
}

export function getCategoriesWithoutParent(
  client: Client,

): Promise<ClientResponse<CategoryPagedQueryResponse>> {
  return getApiRoot(client)
    .categories()
    .get({
      queryArgs: {
        where: ['parent is not defined'],

      },
    })
    .execute();
}

export async function getTreeOfCategoris(client: Client): Promise<Category[]> {
  const categoriesResponse = await getCategories(client);
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

export function getCategoryById(id: string, categories: Category[]): Category | undefined {
  for (let i = 0; i < categories.length; i += 1) {
    const category = categories[i];
    if (category.id === id) {
      return category;
    }

    if (category.children) {
      const result = getCategoryById(id, category.children);
      if (result) {
        return result;
      }
    }
  }

  return undefined;
}
