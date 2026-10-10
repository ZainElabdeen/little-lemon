import { buildMenuFilterQuery } from "./menuQuery";

describe("buildMenuFilterQuery", () => {
  test("no filters returns full select with no params", () => {
    const { sql, params } = buildMenuFilterQuery({ categories: [], query: "" });
    expect(sql).toBe("SELECT * FROM menu");
    expect(params).toEqual([]);
  });

  test("categories only adds an IN clause", () => {
    const { sql, params } = buildMenuFilterQuery({
      categories: ["starters", "mains"],
      query: "",
    });
    expect(sql).toBe("SELECT * FROM menu WHERE category IN (?, ?)");
    expect(params).toEqual(["starters", "mains"]);
  });

  test("query only adds a case-insensitive LIKE", () => {
    const { sql, params } = buildMenuFilterQuery({ categories: [], query: "br" });
    expect(sql).toBe("SELECT * FROM menu WHERE name LIKE ?");
    expect(params).toEqual(["%br%"]);
  });

  test("categories and query intersect with AND", () => {
    const { sql, params } = buildMenuFilterQuery({
      categories: ["mains"],
      query: "gr",
    });
    expect(sql).toBe("SELECT * FROM menu WHERE category IN (?) AND name LIKE ?");
    expect(params).toEqual(["mains", "%gr%"]);
  });

  test("whitespace-only query behaves like no query", () => {
    const { sql, params } = buildMenuFilterQuery({ categories: [], query: "   " });
    expect(sql).toBe("SELECT * FROM menu");
    expect(params).toEqual([]);
  });
});