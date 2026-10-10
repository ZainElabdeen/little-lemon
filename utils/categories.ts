export const CATEGORY_OPTIONS = ["starters", "mains", "desserts", "drinks"];

export function mergeCategories(dbCategories: string[]): string[] {
  const known = new Set(CATEGORY_OPTIONS);
  const extras = dbCategories.filter((category) => !known.has(category));
  return [...CATEGORY_OPTIONS, ...extras];
}