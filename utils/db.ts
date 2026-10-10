import * as SQLite from "expo-sqlite";
import { MenuItem, MenuItemInput } from "@/types/menu";
import { buildMenuFilterQuery, MenuFilter } from "@/utils/menuQuery";

const DB_NAME = "little_lemon";

let db: SQLite.SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  db ??= await SQLite.openDatabaseAsync(DB_NAME);
  return db;
};

export async function initMenuDb(): Promise<void> {
  const database = await getDb();
  await database.execAsync(
    "CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, price REAL, image TEXT, category TEXT)",
  );
}

export async function isMenuEmpty(): Promise<boolean> {
  const database = await getDb();
  const row = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM menu",
  );
  return row === null || row.count === 0;
}

export async function saveMenuItems(items: MenuItemInput[]): Promise<void> {
  const database = await getDb();
  await database.withTransactionAsync(async () => {
    for (const item of items) {
      await database.runAsync(
        "INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
        [item.name, item.description, item.price, item.image, item.category],
      );
    }
  });
}

export async function getCategories(): Promise<string[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{ category: string }>(
    "SELECT DISTINCT category FROM menu WHERE category IS NOT NULL AND category != ''",
  );
  return rows.map((row) => row.category);
}

export async function filterMenuItems(
  filter: MenuFilter,
): Promise<MenuItem[]> {
  const database = await getDb();
  const { sql, params } = buildMenuFilterQuery(filter);
  return database.getAllAsync<MenuItem>(sql, ...params);
}