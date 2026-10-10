import { MenuItemInput } from "@/types/menu";

export const MENU_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export const MENU_IMAGE_BASE =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images";

export function menuItemImageUrl(fileName: string): string {
  return `${MENU_IMAGE_BASE}/${fileName}`;
}

export async function fetchMenu(): Promise<MenuItemInput[]> {
  const response = await fetch(MENU_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch menu: HTTP ${response.status}`);
  }
  const data: { menu: MenuItemInput[] } = await response.json();
  return data.menu;
}