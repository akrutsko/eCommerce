export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  children?: CategoryTree[];
  parent?: CategoryTree;
}
