export interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
  parent?: Category;
}
