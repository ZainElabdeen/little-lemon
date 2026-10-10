import { CATEGORY_OPTIONS, mergeCategories } from "./categories";

describe("mergeCategories", () => {
  test("always includes the configured options, even with an empty DB", () => {
    expect(mergeCategories([])).toEqual(CATEGORY_OPTIONS);
    expect(mergeCategories([])).toContain("drinks");
  });

  test("appends DB categories that are not configured", () => {
    expect(mergeCategories(["starters", "soups"])).toEqual([
      ...CATEGORY_OPTIONS,
      "soups",
    ]);
  });

  test("does not duplicate a configured category", () => {
    expect(mergeCategories(["drinks", "mains"])).toEqual(CATEGORY_OPTIONS);
  });
});