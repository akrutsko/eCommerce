import 'jest-fetch-mock';
import { getCtpClient } from '../../../app/utils/api/api-client';
import { getCategories, getCategoryById, getTreeOfCategories } from '../../../app/utils/api/api-categories';

describe('Tests for categories API', () => {
  test('Get categories', async () => {
    const productWithId = await getCategories(getCtpClient());

    expect(productWithId.statusCode).toBe(200);
  });

  test('Get tree of categories', async () => {
    const tree = await getTreeOfCategories(getCtpClient());
    expect(tree.length).toBeGreaterThan(0);
    expect(tree[0].parent).toBeUndefined();
    expect(tree[0].children).toBeDefined();

    const categorySummerTime = getCategoryById('b45da64a-0f9d-4ad4-b0ad-1da10a3f4f46', tree);
    expect(categorySummerTime).toBeDefined();
    expect(categorySummerTime?.children).toBeDefined();
  });
});
