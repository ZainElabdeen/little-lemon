export type MenuFilter = { categories: string[]; query: string };

export function buildMenuFilterQuery(
  filter: MenuFilter,
): { sql: string; params: (string | number)[] } {
  let sql = "SELECT * FROM menu";
  const params: (string | number)[] = [];

  const clauses: string[] = [];
  if (filter.categories.length > 0) {
    clauses.push(
      `category IN (${filter.categories.map(() => "?").join(", ")})`,
    );
    params.push(...filter.categories);
  }
  const query = filter.query.trim();
  if (query !== "") {
    clauses.push("name LIKE ?");
    params.push(`%${query}%`);
  }

  if (clauses.length > 0) {
    sql += ` WHERE ${clauses.join(" AND ")}`;
  }

  return { sql, params };
}